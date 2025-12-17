import { Outlet, useParams } from 'react-router-dom'
import CommunitySideNav from '../../navigation/CommunitySideNav/CommunitySideNav'
import styles from './CommunityLayout.module.css'

export default function CommunityLayout() {
  const { communityId } = useParams()
  return (
    <div className={styles.wrap}>
      <CommunitySideNav communityId={communityId || ''} />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
