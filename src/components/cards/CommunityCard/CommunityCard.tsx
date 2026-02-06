import React from 'react'
import { Link } from 'react-router-dom'
import styles from './CommunityCard.module.css'
import type { Community, CommunityStatus } from '../../../app/providers'
import Button from '../../ui/Button'

type CommunityWithOptionalThumb = Community & { thumbnail?: string }

const statusLabels: Record<CommunityStatus, string> = {
  'active-sales': 'Active sales',
  'presale': 'Presale',
  'under-development': 'Under development',
}

export default function CommunityCard({ community }: { community: Community }) {
  const c = community as CommunityWithOptionalThumb
  const statusLabel = statusLabels[community.status] || 'Active sales'

  /**
   * MAP IMAGE SETUP (you will add these files):
   * Folder: public/assets/community/
   *
   * Naming rules:
   * - If `community.thumbnail` exists, we load: /assets/community/{community.thumbnail}
   * - Otherwise we load: /assets/community/{community.id}.png
   *
   * Fallback if missing:
   * - /assets/community/placeholder.png
   */
  const preferredSrc = c.thumbnail
    ? `/assets/community/${c.thumbnail}`
    : `/assets/community/${community.id}.png`

  const [src, setSrc] = React.useState(preferredSrc)

  React.useEffect(() => {
    setSrc(preferredSrc)
  }, [preferredSrc])

  const onImgError: React.ReactEventHandler<HTMLImageElement> = () => {
    setSrc((prev) => (prev === '/assets/community/placeholder.png' ? prev : '/assets/community/placeholder.png'))
  }

  const onMenuClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // In this prototype: do nothing. You can wire a menu later.
  }

  return (
    <Link to={`/communities/${community.id}/overview`} className={styles.card} aria-label={community.name}>
      {/* Map image with status chip overlay */}
      <div className={styles.thumb} aria-hidden="true">
        <img
          src={src}
          alt=""
          className={styles.thumbImg}
          draggable={false}
          loading="lazy"
          onError={onImgError}
        />
        <div className={`${styles.statusChip} ${community.status === 'under-development' ? styles.statusChipDevelopment : ''}`} aria-label={`Status: ${statusLabel}`}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>{statusLabel}</span>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.topRow}>
          <div className={styles.titleBlock}>
            <div className={styles.name}>{community.name}</div>
            <div className={styles.division}>{community.division}</div>
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              iconOnly
              className={styles.menuBtn}
              aria-label="More options"
              onClick={onMenuClick}
            >
              <img
                src="/assets/icons/kebab-vertical.svg"
                alt=""
                className={styles.menuIcon}
                draggable={false}
              />
            </Button>
          </div>
        </div>

        {/* Meta row */}
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <img
              src="/assets/icons/community-plans.svg"
              alt=""
              className={styles.metaIcon}
              draggable={false}
            />
            <span className={styles.metaText}>{community.plans} Plans</span>
          </div>

          <div className={styles.metaItem}>
            <img
              src="/assets/icons/community-specs.svg"
              alt=""
              className={styles.metaIcon}
              draggable={false}
            />
            <span className={styles.metaText}>{community.specs}</span>
          </div>

          <div className={styles.metaItem}>
            <img
              src="/assets/icons/community-lots.svg"
              alt=""
              className={styles.metaIcon}
              draggable={false}
            />
            <span className={styles.metaText}>{community.lots} Lots</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
