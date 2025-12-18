/**
 * TopNav.tsx
 *
 * Pixel-matched top navigation (layout + behavior) to provided reference.
 * Icons are placeholders — swap with your real SVGs when ready.
 */

import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./TopNav.module.css";

type NavItem = {
  label: string;
  to: string;
  iconSrc: string; // path in /public
};

const items: NavItem[] = [
  { label: "Projects", to: "/projects", iconSrc: "/assets/nav/projects.svg" },
  { label: "Orders", to: "/orders", iconSrc: "/assets/nav/orders.svg" },
  { label: "Statements", to: "/statements", iconSrc: "/assets/nav/statements.svg" },
  { label: "Catalog", to: "/catalog", iconSrc: "/assets/nav/catalog.svg" },
  { label: "Communities", to: "/communities", iconSrc: "/assets/nav/community.svg" },
  { label: "Schedule", to: "/schedule", iconSrc: "/assets/nav/schedule.svg" },
  { label: "Crews", to: "/crews", iconSrc: "/assets/nav/crews.svg" },
  { label: "Profile", to: "/profile", iconSrc: "/assets/nav/profile.svg" },
  { label: "Digital Tools", to: "/digital-tools", iconSrc: "/assets/nav/tools.svg" },
];

export default function TopNav() {
  const location = useLocation();

  return (
    <header className={styles.top} role="banner">
      {/* LEFT: white brand panel */}
      <div className={styles.leftBrand}>
        <div className={styles.logoBox} aria-hidden="true">
          <img
            src="/assets/myBLDR-icon.png"
            alt=""
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
            draggable={false}
          />
        </div>

        <div className={styles.brandText}>
          <div className={styles.company}>Wind &amp; Water Construction</div>
          <div className={styles.sub}>817255</div>
        </div>
      </div>

      {/* RIGHT: dark nav bar (with angled notch on the left) */}
      <div className={styles.bar}>
        <nav className={styles.nav} aria-label="Primary">
          {items.map((it) => {
            const isCommunity = it.to === "/communities";
            const forceCommunityActive =
              isCommunity && location.pathname.startsWith("/communities");

            return (
              <NavLink
                key={it.label}
                to={it.to}
                className={({ isActive }) => {
                  const active = isActive || forceCommunityActive;
                  if (!active) return styles.navItem;

                  const extra = isCommunity ? ` ${styles.communityActive}` : "";
                  return `${styles.navItem} ${styles.active}${extra}`;
                }}
              >
                <span className={styles.icon} aria-hidden="true">
                  <img
                    src={it.iconSrc}
                    alt=""
                    className={styles.navIconImg}
                    draggable={false}
                  />
                </span>
                <span className={styles.label}>{it.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.user} aria-label="User menu">
          <div className={styles.userIcon} aria-hidden="true">
            <img
              src="/assets/nav/user.svg"
              alt=""
              className={styles.navIconImg}
              draggable={false}
            />
          </div>

          <div className={styles.userLabel}>User</div>
        </div>
      </div>
    </header>
  );
}
