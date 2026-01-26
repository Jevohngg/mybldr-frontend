import React from 'react'
import { useParams } from 'react-router-dom'
import { useData } from '../../../app/providers'
import styles from './PlanCard.module.css'
import type { Plan } from '../../../app/providers'

type PlanWithOptionalImage = Plan & { image?: string; communityName?: string }

function formatBeds(value: unknown) {
  if (value == null) return ''
  const s = String(value).trim()
  if (!s) return ''
  return /\bbd\b/i.test(s) ? s : `${s} bd`
}

function formatBaths(value: unknown) {
  if (value == null) return ''
  const s = String(value).trim()
  if (!s) return ''
  return /\bba\b/i.test(s) ? s : `${s} ba`
}

function formatArea(value: unknown) {
  if (value == null) return ''
  if (typeof value === 'number' && Number.isFinite(value)) return `${value.toLocaleString()} sqft`

  const s = String(value).trim()
  if (!s) return ''

  // If it already contains letters (e.g. "sqft", "sf"), keep as-is.
  if (/[a-z]/i.test(s)) return s

  // Otherwise assume it's a number-ish string
  return `${s} sqft`
}

export default function PlanCard({ plan, onClick }: { plan: Plan; onClick?: () => void }) {
  const typedPlan = plan as PlanWithOptionalImage

  // Try to match the design line that shows the community name (e.g. "Whispering Hills")
  // Priority:
  // 1) plan.communityName (if you have it)
  // 2) current community from route param (community overview page)
  const { communityId } = useParams()
  const { communities } = useData()

  const derivedCommunityName = React.useMemo(() => {
    if (typedPlan.communityName) return typedPlan.communityName
    if (!communityId) return ''
    const c = communities.find((x) => x.id === communityId)
    return c?.name ?? ''
  }, [typedPlan.communityName, communityId, communities])

  // Image handling:
  // - Put images in: public/assets/plans/
  // - If plan.image exists, we use that (can be full path or filename).
  // - Otherwise we try: <plan.id>.jpg
  // - If missing, we fallback to: /assets/plans/placeholder.jpg
  const plannedSrc = typedPlan.image
    ? (typedPlan.image.startsWith('/') ? typedPlan.image : `/assets/plans/${typedPlan.image}`)
    : `/assets/plans/${(typedPlan as any).id}.jpg`

  const [imgSrc, setImgSrc] = React.useState(plannedSrc)

  React.useEffect(() => {
    setImgSrc(plannedSrc)
  }, [plannedSrc])

  const onImgError: React.ReactEventHandler<HTMLImageElement> = () => {
    setImgSrc((prev) => (prev === '/assets/plans/placeholder.jpg' ? prev : '/assets/plans/placeholder.jpg'))
  }

  const communityCount = (typedPlan as any).communityCount

  return (
    <div className={styles.card} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className={styles.img}>
        <img
          src={imgSrc}
          alt=""
          className={styles.image}
          draggable={false}
          loading="lazy"
          onError={onImgError}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.name}>{typedPlan.name}</div>

        {communityCount != null && (
          <div className={styles.community}>{communityCount} Communities</div>
        )}
      </div>
    </div>
  )
}
