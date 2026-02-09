import React from 'react'
import styles from './PlanCard.module.css'
import type { Plan } from '../../../app/providers'

type PlanWithOptionalImage = Plan & { image?: string }

function formatRange(base: number | undefined, max: number | undefined, suffix: string) {
  if (base == null) return ''
  if (max != null && max !== base) return `${base}-${max} ${suffix}`
  return `${base} ${suffix}`
}

export default function PlanCard({ plan, onClick }: { plan: Plan; onClick?: () => void }) {
  const typedPlan = plan as PlanWithOptionalImage
  const p = typedPlan as any

  const plannedSrc = typedPlan.image
    ? (typedPlan.image.startsWith('/') ? typedPlan.image : `/assets/plans/${typedPlan.image}`)
    : '/assets/plans/placeholder.jpg'

  const [imgSrc, setImgSrc] = React.useState(plannedSrc)

  React.useEffect(() => {
    setImgSrc(plannedSrc)
  }, [plannedSrc])

  const onImgError: React.ReactEventHandler<HTMLImageElement> = () => {
    setImgSrc((prev) => (prev === '/assets/plans/placeholder.jpg' ? prev : '/assets/plans/placeholder.jpg'))
  }

  const specs = [
    formatRange(p.bedrooms, p.maxBedrooms, 'bd'),
    formatRange(p.bathrooms, p.maxBathrooms, 'ba'),
    p.totalFinishedSqft ? `${p.totalFinishedSqft.toLocaleString()} sqft` : '',
  ].filter(Boolean)

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

        {specs.length > 0 && (
          <div className={styles.meta}>
            {specs.map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className={styles.dot}>·</span>}
                <span>{s}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
