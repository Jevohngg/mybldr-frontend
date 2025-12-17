import TopNav from '../../navigation/TopNav/TopNav'
import SideNav from '../../navigation/SideNav/SideNav'
import styles from './AppLayout.module.css'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.app}>
      <TopNav />
      <div className={styles.body}>
        <SideNav />
        <main className={styles.main}>
          <div className={styles.container}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
