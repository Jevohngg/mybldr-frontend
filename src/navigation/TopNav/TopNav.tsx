/**
 * TopNav.tsx
 *
 * Pixel-perfect top navigation bar matching Figma design.
 * Features: Logo, Search bar with active state dropdown, Avatar with dropdown.
 * Responsive: Hamburger menu on mobile/tablet.
 */

import React, { useState, useRef, useEffect } from "react";
import { useMobileNav } from "../../contexts/MobileNavContext";
import styles from "./TopNav.module.css";

// Dummy data for recent searches
const recentSearches = [
  {
    id: 1,
    type: "lot",
    title: "Lot 485",
    subtitle: "Mountain Aberdeen > Silver Lake",
    meta: "45523",
  },
  {
    id: 2,
    type: "spec",
    title: "Exterior Doors",
    subtitle: "Lot 485",
  },
  {
    id: 3,
    type: "plan",
    title: "Mountain Aberdeen",
    subtitle: "Silver Lake",
    meta: "Aberdeen",
  },
  {
    id: 4,
    type: "specification",
    title: "Exterior Paint",
    subtitle: "Apply two coats of acrylic latex paint with a minimum dry film thickness of 2 mils per coat.",
  },
  {
    id: 5,
    type: "delivery",
    title: "Exterior Doors",
    subtitle: "Lot 485",
    meta: "Silver Lake",
    extra: "224431",
    status: "Delivered",
    date: { month: "JAN", day: "16" },
  },
  {
    id: 6,
    type: "community",
    title: "Silver Lake",
    subtitle: "Harrisville, UT",
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

export default function TopNav() {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleMobileNav, isMobileNavOpen, isMobile, isTablet } = useMobileNav();
  const showHamburger = isMobile || isTablet;

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
                  <button key={filter} className={styles.filterChip}>
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches Section */}
            <div className={styles.recentSection}>
              <div className={styles.recentHeader}>
                <span className={styles.recentTitle}>Recents</span>
              </div>
              <div className={styles.recentList}>
                {recentSearches.map((item) => (
                  <div key={item.id} className={styles.recentItem}>
                    <div className={styles.recentItemIcon}>
                      {item.type === "delivery" && item.date ? (
                        <div className={styles.dateCard}>
                          <span className={styles.dateMonth}>{item.date.month}</span>
                          <span className={styles.dateDay}>{item.date.day}</span>
                        </div>
                      ) : (
                        <div className={styles.iconWrapper}>
                          <img
                            src={`/assets/icons/icon-${item.type === "lot" ? "folder" : item.type === "spec" ? "assignment" : item.type === "plan" ? "community" : item.type === "specification" ? "article" : "community-2"}.svg`}
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
                ))}
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
    </>
  );
}
