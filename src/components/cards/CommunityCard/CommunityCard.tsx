import React from 'react'
import { Link } from 'react-router-dom'
import styles from './CommunityCard.module.css'
import type { Community } from '../../../app/providers'

type CommunityWithOptionalThumb = Community & { thumbnail?: string }

export default function CommunityCard({ community }: { community: Community }) {
  const c = community as CommunityWithOptionalThumb

  /**
   * MAP IMAGE SETUP (you will add these files):
   * Folder: public/assets/maps/
   *
   * Naming rules:
   * - If `community.thumbnail` exists, we load: /assets/maps/{community.thumbnail}
   * - Otherwise we load: /assets/maps/{community.id}.png
   *
   * Fallback if missing:
   * - /assets/maps/placeholder.png
   */
  const preferredSrc = c.thumbnail
    ? `/assets/maps/${c.thumbnail}`
    : `/assets/maps/${community.id}.png`

  const [src, setSrc] = React.useState(preferredSrc)

  React.useEffect(() => {
    setSrc(preferredSrc)
  }, [preferredSrc])

  const onImgError: React.ReactEventHandler<HTMLImageElement> = () => {
    setSrc((prev) => (prev === '/assets/maps/placeholder.png' ? prev : '/assets/maps/placeholder.png'))
  }

  const onMenuClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // In this prototype: do nothing. You can wire a menu later.
  }

  return (
    <Link to={`/communities/${community.id}/overview`} className={styles.card} aria-label={community.name}>
      {/* Map image */}
      <div className={styles.thumb} aria-hidden="true">
        <img
          src={src}
          alt=""
          className={styles.thumbImg}
          draggable={false}
          loading="lazy"
          onError={onImgError}
        />
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.topRow}>
          <div className={styles.titleBlock}>
            <div className={styles.name}>{community.name}</div>
            <div className={styles.division}>{community.division}</div>
          </div>

          <div className={styles.actions}>
            <div className={styles.statusPill} aria-label="Status: Active">
              <span className={styles.statusDot} />
              <span className={styles.statusText}>Active</span>
            </div>

            <button
              type="button"
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
            </button>
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
            <span className={styles.metaText}>{community.specs} Specs</span>
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
