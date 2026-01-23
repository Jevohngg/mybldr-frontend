import TopNav from '../../navigation/TopNav/TopNav'
import SideNav from '../../navigation/SideNav/SideNav'
import { useMobileNav } from '../../contexts/MobileNavContext'
import styles from './AppLayout.module.css'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isMobileNavOpen, closeMobileNav, isMobile, isTablet } = useMobileNav()
  const showMobileNav = isMobile || isTablet

  return (
    <div className={styles.app}>
      <TopNav />
      <div className={styles.body}>
        {/* Mobile overlay */}
        {showMobileNav && (
          <div
            className={`${styles.mobileOverlay} ${isMobileNavOpen ? styles.mobileOverlayActive : ''}`}
            onClick={closeMobileNav}
            aria-hidden="true"
          />
        )}

        {/* SideNav - becomes drawer on mobile */}
        <div
          className={`${styles.sidenavWrapper} ${showMobileNav ? styles.sidenavMobile : ''} ${
            isMobileNavOpen ? styles.sidenavOpen : ''
          }`}
        >
          <SideNav />
        </div>

        <main className={styles.main}>
          <div className={styles.container}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
