/**
 * TopNav.tsx
 *
 * Pixel-perfect top navigation bar matching Figma design.
 * Features: Logo, Search bar with active state dropdown, Avatar with dropdown.
 * Responsive: Hamburger menu on mobile/tablet.
 */

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMobileNav } from "../../contexts/MobileNavContext";
import { communities } from "../../mock-data/communities";
import { plans } from "../../mock-data/plans";
import { constructionSpecs } from "../../components/SpecSheetTable/mockData";
import PlanDetailModal from "../../components/modals/PlanDetailModal/PlanDetailModal";
import styles from "./TopNav.module.css";

// Types for search results
interface SearchResult {
  id: string;
  type: "quote" | "project" | "plan" | "delivery" | "specification" | "community" | "page";
  title: string;
  subtitle: string;
  meta?: string;
  extra?: string;
  status?: string;
  date?: { month: string; day: string };
  navigationPath?: string;
  planId?: string;
  thumbnail?: string;
  icon?: string;
}

// Mock data for quotes (not yet implemented in the app)
const mockQuotes: SearchResult[] = [
  { id: "q1", type: "quote", title: "Quote #12345", subtitle: "Whispering Hills - Lot 12", meta: "$245,000", navigationPath: "/quotes/12345" },
  { id: "q2", type: "quote", title: "Quote #12346", subtitle: "Riverside Estates - Lot 8", meta: "$312,000", navigationPath: "/quotes/12346" },
  { id: "q3", type: "quote", title: "Quote #12347", subtitle: "The Pines - Lot 22", meta: "$278,000", navigationPath: "/quotes/12347" },
];

// Mock data for projects (not yet implemented in the app)
const mockProjects: SearchResult[] = [
  { id: "p1", type: "project", title: "Project #45523", subtitle: "The Aspen > Whispering Hills", meta: "In Progress", navigationPath: "/projects/45523" },
  { id: "p2", type: "project", title: "Project #45524", subtitle: "The Woodford > Riverside Estates", meta: "Framing", navigationPath: "/projects/45524" },
  { id: "p3", type: "project", title: "Project #45525", subtitle: "The Serena > The Pines", meta: "Foundation", navigationPath: "/projects/45525" },
];

// Mock data for deliveries (not yet implemented in the app)
const mockDeliveries: SearchResult[] = [
  { id: "d1", type: "delivery", title: "Exterior Doors", subtitle: "Lot 485", meta: "Whispering Hills", extra: "224431", status: "Delivered", date: { month: "JAN", day: "16" }, navigationPath: "/deliveries/224431" },
  { id: "d2", type: "delivery", title: "Windows Package", subtitle: "Lot 312", meta: "Riverside Estates", extra: "224432", status: "In Transit", date: { month: "JAN", day: "18" }, navigationPath: "/deliveries/224432" },
  { id: "d3", type: "delivery", title: "Roofing Materials", subtitle: "Lot 108", meta: "The Pines", extra: "224433", status: "Scheduled", date: { month: "JAN", day: "20" }, navigationPath: "/deliveries/224433" },
];

// Page navigation results - these are the main pages users can navigate to
const pageResults: SearchResult[] = [
  {
    id: "page-plan-library",
    type: "page",
    title: "Plan Library",
    subtitle: "View and manage all plans",
    navigationPath: "/plan-library",
    icon: "community",
  },
  {
    id: "page-communities",
    type: "page",
    title: "Communities",
    subtitle: "View and manage all communities",
    navigationPath: "/communities",
    icon: "community-2",
  },
  {
    id: "page-specifications",
    type: "page",
    title: "Specifications",
    subtitle: "View global specifications",
    navigationPath: "/specifications",
    icon: "article",
  },
];

// Recent searches (static for now, could be persisted in localStorage)
const recentSearches: SearchResult[] = [
  {
    id: "r1",
    type: "project",
    title: "Lot 485",
    subtitle: "The Aspen > Whispering Hills",
    meta: "45523",
    navigationPath: "/projects/45523",
  },
  {
    id: "r2",
    type: "specification",
    title: "Exterior Doors",
    subtitle: "Lot 485",
    navigationPath: "/communities/CM-4456/specifications",
  },
  {
    id: "r3",
    type: "plan",
    title: "The Aspen",
    subtitle: "Whispering Hills",
    planId: "aspen",
  },
  {
    id: "r4",
    type: "specification",
    title: "Exterior Paint",
    subtitle: "Apply two coats of acrylic latex paint with a minimum dry film thickness of 2 mils per coat.",
    navigationPath: "/communities/CM-4456/specifications",
  },
  {
    id: "r5",
    type: "delivery",
    title: "Exterior Doors",
    subtitle: "Lot 485",
    meta: "Whispering Hills",
    extra: "224431",
    status: "Delivered",
    date: { month: "JAN", day: "16" },
    navigationPath: "/deliveries/224431",
  },
  {
    id: "r6",
    type: "community",
    title: "Whispering Hills",
    subtitle: "Dallas, TX",
    navigationPath: "/communities/CM-4456",
    thumbnail: "/assets/maps/placeholder.png",
  },
];

const quickFilters = [
  "Quotes",
  "Projects",
  "Plans",
  "Deliveries",
  "Specifications",
  "Communities",
];

// Helper function to get icon name based on item type
const getIconName = (type: string, customIcon?: string): string => {
  if (customIcon) return customIcon;
  switch (type) {
    case "community":
      return "community-2";
    case "plan":
      return "community";
    case "specification":
      return "article";
    case "quote":
      return "assignment";
    case "project":
      return "folder";
    case "delivery":
      return "assignment";
    case "page":
      return "article";
    default:
      return "article";
  }
};

export default function TopNav() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; communityCount: number } | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleMobileNav, isMobileNavOpen, isMobile, isTablet } = useMobileNav();
  const showHamburger = isMobile || isTablet;

  // Convert real data to SearchResult format
  const communityResults: SearchResult[] = useMemo(() =>
    communities.map(c => ({
      id: c.id,
      type: "community" as const,
      title: c.name,
      subtitle: `${c.division} • ${c.lots} lots`,
      navigationPath: `/communities/${c.id}`,
      thumbnail: `/assets/maps/placeholder.png`,
    })), []);

  const planResults: SearchResult[] = useMemo(() =>
    plans.map(p => ({
      id: p.id,
      type: "plan" as const,
      title: p.name,
      subtitle: `${p.beds} bed • ${p.baths} bath • ${p.sqft}`,
      meta: p.series,
      planId: p.id,
      thumbnail: p.image,
    })), []);

  const specificationResults: SearchResult[] = useMemo(() =>
    constructionSpecs.map(s => ({
      id: s.id,
      type: "specification" as const,
      title: s.subCategory,
      subtitle: s.description.substring(0, 80) + (s.description.length > 80 ? "..." : ""),
      meta: s.category,
      navigationPath: `/communities/CM-4456/specifications`,
    })), []);

  // Filter search results based on search value and active filter
  const searchResults = useMemo(() => {
    if (!searchValue.trim()) return [];

    const query = searchValue.toLowerCase();
    let results: SearchResult[] = [];

    // Get results based on active filter
    const filterResults = (items: SearchResult[]) =>
      items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        (item.meta && item.meta.toLowerCase().includes(query))
      );

    // Check for page navigation matches first
    // Match "plans", "plan library", "plan" to Plan Library page
    // Match "communities", "community" to Communities page
    // Match "specifications", "specs", "spec" to Specifications page
    const matchingPages: SearchResult[] = [];

    if (activeFilter === "All" || activeFilter === "Plans") {
      if ("plans".includes(query) || "plan library".includes(query) || query.includes("plan")) {
        const planLibraryPage = pageResults.find(p => p.id === "page-plan-library");
        if (planLibraryPage) matchingPages.push(planLibraryPage);
      }
    }

    if (activeFilter === "All" || activeFilter === "Communities") {
      if ("communities".includes(query) || "community".includes(query) || query.includes("communit")) {
        const communitiesPage = pageResults.find(p => p.id === "page-communities");
        if (communitiesPage) matchingPages.push(communitiesPage);
      }
    }

    if (activeFilter === "All" || activeFilter === "Specifications") {
      if ("specifications".includes(query) || "specs".includes(query) || query.includes("spec")) {
        const specificationsPage = pageResults.find(p => p.id === "page-specifications");
        if (specificationsPage) matchingPages.push(specificationsPage);
      }
    }

    // Add matching pages first
    results = [...matchingPages];

    // Then add data results
    if (activeFilter === "All" || activeFilter === "Communities") {
      results = [...results, ...filterResults(communityResults)];
    }
    if (activeFilter === "All" || activeFilter === "Plans") {
      results = [...results, ...filterResults(planResults)];
    }
    if (activeFilter === "All" || activeFilter === "Specifications") {
      results = [...results, ...filterResults(specificationResults)];
    }
    if (activeFilter === "All" || activeFilter === "Quotes") {
      results = [...results, ...filterResults(mockQuotes)];
    }
    if (activeFilter === "All" || activeFilter === "Projects") {
      results = [...results, ...filterResults(mockProjects)];
    }
    if (activeFilter === "All" || activeFilter === "Deliveries") {
      results = [...results, ...filterResults(mockDeliveries)];
    }

    return results.slice(0, 10); // Limit to 10 results
  }, [searchValue, activeFilter, communityResults, planResults, specificationResults]);

  // Handle clicking on a search result or recent item
  const handleResultClick = (item: SearchResult) => {
    setIsSearchActive(false);
    setSearchValue("");

    if (item.type === "plan" && item.planId) {
      // Open plan detail modal directly
      const plan = plans.find(p => p.id === item.planId);
      if (plan) {
        setSelectedPlan({
          id: plan.id,
          name: plan.name,
          communityCount: plan.communityCount || 0,
        });
      }
    } else if (item.navigationPath) {
      navigate(item.navigationPath);
    }
  };

  // Close plan modal
  const handleClosePlanModal = () => {
    setSelectedPlan(null);
  };

  // Handle filter chip click - toggle selection (click to select, click again to deselect)
  const handleFilterClick = (filter: string) => {
    setActiveFilter(prev => prev === filter ? "All" : filter);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when search becomes active
  useEffect(() => {
    if (isSearchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchActive]);

  const handleSearchClick = () => {
    setIsSearchActive(true);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  return (
    <>
      <header className={styles.topNav} role="banner">
        {/* Hamburger Menu - Mobile/Tablet only */}
        {showHamburger && (
          <button
            className={`${styles.hamburger} ${isMobileNavOpen ? styles.hamburgerActive : ''}`}
            onClick={toggleMobileNav}
            aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileNavOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        )}

        {/* Logo */}
        <div className={styles.logo}>
          <img
            src="/assets/mybldr-logo-white.svg"
            alt="myBLDR"
            className={styles.logoImage}
            draggable={false}
          />
        </div>

        {/* Search Container - this is a fixed-size wrapper */}
        <div
          className={styles.searchContainer}
          ref={searchContainerRef}
        >
          {/* Collapsed Search Field - visible when not active */}
          <div
            className={`${styles.searchField} ${isSearchActive ? styles.searchFieldHidden : ""}`}
            onClick={handleSearchClick}
          >
            <svg
              className={styles.searchIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className={styles.searchPlaceholder}>Search or ask BLDR</span>
          </div>

          {/* Active Search Dropdown - absolutely positioned, appears when active */}
          <div className={`${styles.searchDropdown} ${isSearchActive ? styles.searchDropdownVisible : ""}`}>
            {/* Search Input Section */}
            <div className={styles.searchDropdownHeader}>
              <div className={styles.searchInputWrapper}>
                <svg
                  className={styles.searchInputIcon}
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                    stroke="currentColor"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.searchDropdownInput}
                  placeholder="Search or ask BLDR"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {/* Always reserve space for clear button to prevent layout shift */}
                <div className={styles.clearButtonWrapper}>
                  {searchValue && (
                    <button
                      className={styles.clearButton}
                      onClick={handleClearSearch}
                      aria-label="Clear search"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Filter Chips */}
              <div className={styles.quickFilters}>
                {quickFilters.map((filter) => (
                  <button
                    key={filter}
                    className={`${styles.filterChip} ${activeFilter === filter ? styles.filterChipActive : ""}`}
                    onClick={() => handleFilterClick(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results or Recent Searches Section */}
            <div className={styles.recentSection}>
              <div className={styles.recentHeader}>
                <span className={styles.recentTitle}>
                  {searchValue.trim() ? `Results${searchResults.length > 0 ? ` (${searchResults.length})` : ""}` : "Recents"}
                </span>
              </div>
              <div className={styles.recentList}>
                {searchValue.trim() ? (
                  searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <div
                        key={item.id}
                        className={`${styles.recentItem} ${item.type === "page" ? styles.pageItem : ""}`}
                        onClick={() => handleResultClick(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleResultClick(item)}
                      >
                        <div className={styles.recentItemIcon}>
                          {item.type === "delivery" && item.date ? (
                            <div className={styles.dateCard}>
                              <span className={styles.dateMonth}>{item.date.month}</span>
                              <span className={styles.dateDay}>{item.date.day}</span>
                            </div>
                          ) : (item.type === "community" || item.type === "plan") && item.thumbnail ? (
                            <div className={styles.communityThumbnail}>
                              <img
                                src={item.thumbnail}
                                alt=""
                                className={styles.communityThumbnailImg}
                                draggable={false}
                              />
                            </div>
                          ) : (
                            <div className={styles.iconWrapper}>
                              <img
                                src={`/assets/icons/icon-${getIconName(item.type, item.icon)}.svg`}
                                alt=""
                                className={styles.resultIcon}
                              />
                            </div>
                          )}
                        </div>
                        <div className={styles.recentItemContent}>
                          <div className={styles.recentItemTitle}>
                            <span>{item.title}</span>
                            {item.type === "page" && (
                              <span className={styles.pageChip}>Page</span>
                            )}
                            {item.status && (
                              <span className={styles.statusChip}>{item.status}</span>
                            )}
                          </div>
                          <div className={styles.recentItemSubtitle}>
                            <span>{item.subtitle}</span>
                            {item.meta && (
                              <>
                                <span className={styles.dot}></span>
                                <span>{item.meta}</span>
                              </>
                            )}
                            {item.extra && (
                              <>
                                <span className={styles.dot}></span>
                                <span>{item.extra}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noResults}>
                      <span>No results found for "{searchValue}"</span>
                    </div>
                  )
                ) : (
                  recentSearches.map((item) => (
                    <div
                      key={item.id}
                      className={styles.recentItem}
                      onClick={() => handleResultClick(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && handleResultClick(item)}
                    >
                      <div className={styles.recentItemIcon}>
                        {item.type === "delivery" && item.date ? (
                          <div className={styles.dateCard}>
                            <span className={styles.dateMonth}>{item.date.month}</span>
                            <span className={styles.dateDay}>{item.date.day}</span>
                          </div>
                        ) : (item.type === "community" || item.type === "plan") && item.thumbnail ? (
                          <div className={styles.communityThumbnail}>
                            <img
                              src={item.thumbnail}
                              alt=""
                              className={styles.communityThumbnailImg}
                              draggable={false}
                            />
                          </div>
                        ) : (
                          <div className={styles.iconWrapper}>
                            <img
                              src={`/assets/icons/icon-${getIconName(item.type, item.icon)}.svg`}
                              alt=""
                              className={styles.resultIcon}
                            />
                          </div>
                        )}
                      </div>
                      <div className={styles.recentItemContent}>
                        <div className={styles.recentItemTitle}>
                          <span>{item.title}</span>
                          {item.status && (
                            <span className={styles.statusChip}>{item.status}</span>
                          )}
                        </div>
                        <div className={styles.recentItemSubtitle}>
                          <span>{item.subtitle}</span>
                          {item.meta && (
                            <>
                              <span className={styles.dot}></span>
                              <span>{item.meta}</span>
                            </>
                          )}
                          {item.extra && (
                            <>
                              <span className={styles.dot}></span>
                              <span>{item.extra}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Avatar with Dropdown */}
        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <span className={styles.avatarInitials}>D</span>
          </div>
          <svg
            className={styles.dropdownIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10L12 15L17 10"
              fill="currentColor"
            />
          </svg>
        </div>
      </header>

      {/* Plan Detail Modal - opens when a plan is selected from search */}
      <PlanDetailModal
        open={!!selectedPlan}
        onClose={handleClosePlanModal}
        planId={selectedPlan?.id || ""}
        planName={selectedPlan?.name || ""}
        communityCount={selectedPlan?.communityCount || 0}
      />
    </>
  );
}
