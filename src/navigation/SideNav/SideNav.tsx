import * as React from 'react'
import { NavLink, matchPath, useLocation } from 'react-router-dom'
import styles from './SideNav.module.css'
import { useData } from '../../app/providers'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

/**
 * ICON FILES (public folder)
 *
 * Put these in: public/assets/icons/
 * - plan-library.svg
 * - specifications.svg
 * - team.svg
 * - community.svg
 *
 * Reference them in code as: /assets/icons/<file>.svg
 */
const ICONS = {
  planLibrary: '/assets/icons/plan-library.svg',
  specifications: '/assets/icons/specifications.svg',
  team: '/assets/icons/team.svg',
  community: '/assets/icons/community.svg',
} as const

function NavIcon({ src }: { src: string }) {
  return <img src={src} alt="" className={styles.navIconImg} draggable={false} />
}

/**
 * Computes a CSS variable that lets the childGroup draw a single vertical trunk
 * line down to ONLY the active child row (instead of connecting to all rows).
 *
 * It measures the active child link (aria-current="page") and sets:
 *  --active-elbow-top: <px>  (top of the elbow block)
 *  --connector-opacity: 0|1  (hide line when no active child)
 */
function useActiveChildConnector(open: boolean, depKey: string) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [vars, setVars] = React.useState<{ elbowTop: number; opacity: number }>({
    elbowTop: 0,
    opacity: 0,
  })

  const compute = React.useCallback(() => {
    const container = ref.current
    if (!container) return

    const active = container.querySelector('a[aria-current="page"]') as HTMLElement | null
    if (!active) {
      setVars({ elbowTop: 0, opacity: 0 })
      return
    }

    const cRect = container.getBoundingClientRect()
    const aRect = active.getBoundingClientRect()

    // Center of the active row relative to container
    const centerY = aRect.top - cRect.top + aRect.height / 2

    // Your elbow pseudo element is 14px tall and is positioned at (centerY - 14).
    const elbowTop = Math.max(0, centerY - 14)

    setVars({ elbowTop, opacity: 1 })
  }, [])

  React.useEffect(() => {
    if (!open) {
      setVars({ elbowTop: 0, opacity: 0 })
      return
    }

    // Wait until layout has settled (helps when opening/collapsing animates)
    let raf1 = requestAnimationFrame(() => {
      compute()
    })

    return () => {
      cancelAnimationFrame(raf1)
    }
  }, [open, depKey, compute])

  React.useEffect(() => {
    if (!open) return

    const onResize = () => compute()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [open, compute])

  const style = {
    ['--active-elbow-top' as any]: `${vars.elbowTop}px`,
    ['--connector-opacity' as any]: vars.opacity,
  } as React.CSSProperties

  return { ref, style }
}

export default function SideNav() {
  const { communities = [] } = useData() as any
  const location = useLocation()

  const communityMatch =
    matchPath({ path: '/communities/:communityId/*' }, location.pathname) ||
    matchPath({ path: '/communities/:communityId' }, location.pathname)

  const activeCommunityId = communityMatch?.params?.communityId ?? null

  const isSpecsRoute = !!matchPath({ path: '/specifications/*' }, location.pathname)
  const isTeamRoute = !!matchPath({ path: '/team/*' }, location.pathname)

  const [specsOpen, setSpecsOpen] = React.useState(false)
  const [teamOpen, setTeamOpen] = React.useState(false)

  // Auto-expand groups when deep-linked into them.
  React.useEffect(() => {
    if (isSpecsRoute) setSpecsOpen(true)
  }, [isSpecsRoute])

  React.useEffect(() => {
    if (isTeamRoute) setTeamOpen(true)
  }, [isTeamRoute])

  const onSpecsClick = React.useCallback(() => {
    setSpecsOpen((prev) => {
      if (!prev) return true
      // Only allow collapsing when you are already in the section.
      if (isSpecsRoute) return false
      return prev
    })
  }, [isSpecsRoute])

  const onTeamClick = React.useCallback(() => {
    setTeamOpen((prev) => {
      if (!prev) return true
      if (isTeamRoute) return false
      return prev
    })
  }, [isTeamRoute])

  // Connector measurement hooks (only need one for each expandable group)
  const specsConnector = useActiveChildConnector(specsOpen, location.pathname)
  const teamConnector = useActiveChildConnector(teamOpen, location.pathname)
  const communityConnector = useActiveChildConnector(
    !!activeCommunityId,
    `${activeCommunityId ?? ''}|${location.pathname}`
  )

  return (
    <aside className={styles.side} aria-label="Side navigation">
      <nav aria-label="Primary">
        {/* Global navigation */}
        <div className={styles.section}>
          <NavLink
            to="/plan-library"
            className={({ isActive }) => (isActive ? styles.rowActive : styles.row)}
          >
            <span className={styles.icon} aria-hidden="true">
              <NavIcon src={ICONS.planLibrary} />
            </span>
            <span>Plan Library</span>
          </NavLink>

          <div className={styles.group}>
            <NavLink
              to="/specifications"
              onClick={onSpecsClick}
              aria-expanded={specsOpen}
              className={({ isActive }) => (isActive ? styles.rowActive : styles.row)}
            >
              <span className={styles.icon} aria-hidden="true">
                <NavIcon src={ICONS.specifications} />
              </span>
              <span>Specifications</span>
            </NavLink>

            {/* Smooth expand/collapse wrapper */}
            <div
              className={cx(styles.collapse, specsOpen && styles.collapseOpen)}
              aria-hidden={!specsOpen}
            >
              <div className={styles.collapseInner}>
                <div
                  ref={specsConnector.ref}
                  style={specsConnector.style}
                  className={cx(styles.childGroup, styles.collapseContent)}
                  role="group"
                  aria-label="Specifications"
                >
                  <NavLink
                    to="/specifications/templates"
                    tabIndex={specsOpen ? undefined : -1}
                    className={({ isActive }) =>
                      cx(styles.childRow, isActive && styles.childRowActive)
                    }
                  >
                    Specification Templates
                  </NavLink>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.group}>
            <NavLink
              to="/team"
              onClick={onTeamClick}
              aria-expanded={teamOpen}
              className={({ isActive }) => (isActive ? styles.rowActive : styles.row)}
            >
              <span className={styles.icon} aria-hidden="true">
                <NavIcon src={ICONS.team} />
              </span>
              <span>Team</span>
            </NavLink>

            {/* Smooth expand/collapse wrapper */}
            <div
              className={cx(styles.collapse, teamOpen && styles.collapseOpen)}
              aria-hidden={!teamOpen}
            >
              <div className={styles.collapseInner}>
                <div
                  ref={teamConnector.ref}
                  style={teamConnector.style}
                  className={cx(styles.childGroup, styles.collapseContent)}
                  role="group"
                  aria-label="Team"
                >
                  <NavLink
                    to="/team/organization"
                    tabIndex={teamOpen ? undefined : -1}
                    className={({ isActive }) =>
                      cx(styles.childRow, isActive && styles.childRowActive)
                    }
                  >
                    Organization
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communities */}
        <NavLink
          to="/communities"
          end
          className={({ isActive }) =>
            isActive ? styles.sectionPillActive : styles.sectionTitleLink
          }
        >
          COMMUNITIES
        </NavLink>

        <div className={styles.communityList} aria-label="Communities">
          {communities.map((c: any) => {
            const isActiveCommunity = activeCommunityId === c.id

            return (
              <div key={c.id} className={styles.communityBlock}>
                <NavLink
                  to={`/communities/${c.id}/overview`}
                  className={isActiveCommunity ? styles.rowActive : styles.row}
                >
                  <span className={styles.icon} aria-hidden="true">
                    <NavIcon src={ICONS.community} />
                  </span>
                  <span className={styles.communityName}>{c.name}</span>
                </NavLink>

                {/* Always render the group so we can animate open/close smoothly */}
                <div
                  className={cx(styles.collapse, isActiveCommunity && styles.collapseOpen)}
                  aria-hidden={!isActiveCommunity}
                >
                  <div className={styles.collapseInner}>
                    <div
                      ref={isActiveCommunity ? communityConnector.ref : null}
                      style={isActiveCommunity ? communityConnector.style : undefined}
                      className={cx(styles.childGroup, styles.collapseContent)}
                      role="group"
                      aria-label={`${c.name} pages`}
                    >
                      <NavLink
                        to={`/communities/${c.id}/hoa`}
                        tabIndex={isActiveCommunity ? undefined : -1}
                        className={({ isActive }) =>
                          cx(styles.childRow, isActive && styles.childRowActive)
                        }
                      >
                        HOA Requirements
                      </NavLink>

                      <NavLink
                        to={`/communities/${c.id}/documents`}
                        tabIndex={isActiveCommunity ? undefined : -1}
                        className={({ isActive }) =>
                          cx(styles.childRow, isActive && styles.childRowActive)
                        }
                      >
                        Documents
                      </NavLink>

                      <NavLink
                        to={`/communities/${c.id}/specifications`}
                        tabIndex={isActiveCommunity ? undefined : -1}
                        className={({ isActive }) =>
                          cx(styles.childRow, isActive && styles.childRowActive)
                        }
                      >
                        Specifications
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {communities.length === 0 && <div className={styles.emptyNote}>No communities yet</div>}
        </div>
      </nav>
    </aside>
  )
}
