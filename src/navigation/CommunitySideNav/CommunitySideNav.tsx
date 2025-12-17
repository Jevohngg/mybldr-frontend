import { NavLink } from 'react-router-dom'
import styles from './CommunitySideNav.module.css'
import { useData } from '../../app/providers'

export default function CommunitySideNav({ communityId }: { communityId: string }) {
  const { communities } = useData()
  const current = communities.find(c => c.id === communityId)


}
