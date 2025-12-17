import { NavLink } from 'react-router-dom'
import styles from './CommunitySideNav.module.css'
import { useData } from '../../app/providers'

export default function CommunitySideNav({ communityId }: { communityId: string }) {
  const { communities } = useData()
  const current = communities.find(c => c.id === communityId)

  return (
    <nav className={styles.nav}>
      <div className={styles.header}>
        <h2>{current?.name || 'Community'}</h2>
      </div>
      <NavLink to={`/communities/${communityId}/overview`} className={styles.link}>Overview</NavLink>
      <NavLink to={`/communities/${communityId}/lots`} className={styles.link}>Lots</NavLink>
      <NavLink to={`/communities/${communityId}/plans`} className={styles.link}>Plans</NavLink>
      <NavLink to={`/communities/${communityId}/specifications`} className={styles.link}>Specifications</NavLink>
      <NavLink to={`/communities/${communityId}/documents`} className={styles.link}>Documents</NavLink>
      <NavLink to={`/communities/${communityId}/hoa`} className={styles.link}>HOA Requirements</NavLink>
    </nav>
  )
}
