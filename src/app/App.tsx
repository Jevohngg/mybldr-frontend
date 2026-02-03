import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { DataProvider } from './providers'
import { MobileNavProvider } from '../contexts/MobileNavContext'
import AppLayout from '../layouts/AppLayout/AppLayout'
import TopNav from '../navigation/TopNav/TopNav'
import CommunitiesPage from '../pages/Communities/CommunitiesPage'
import PlanLibraryPage from '../pages/PlanLibrary/PlanLibraryPage'
import GlobalSpecifications from '../pages/Specifications/GlobalSpecifications'
import Templates from '../pages/Specifications/Templates'
import CommunityLayout from '../layouts/CommunityLayout/CommunityLayout'
import CommunityOverview from '../pages/CommunityDetail/CommunityOverview'
import HOARequirements from '../pages/CommunityDetail/HOARequirements'
import Documents from '../pages/CommunityDetail/Documents'
import Specifications from '../pages/CommunityDetail/Specifications'
import ReservedLotDetailPage from '../pages/ReservedLotDetail/ReservedLotDetailPage'
import LotConfigurationPage from '../pages/LotConfiguration/LotConfigurationPage'
import SelectionsPage from '../pages/Selections/SelectionsPage'
import BuilderStudioPage from '../pages/BuilderStudio/BuilderStudioPage'

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/plan-library" replace />} />

            <Route path="/plan-library" element={<Page><PlanLibraryPage /></Page>} />

            <Route path="/specifications" element={<Page><GlobalSpecifications /></Page>} />
            <Route path="/specifications/templates" element={<Page><Templates /></Page>} />

            <Route path="/communities" element={<Page><CommunitiesPage /></Page>} />

            <Route path="/communities/:communityId" element={<CommunityLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<Page><CommunityOverview /></Page>} />
              <Route path="hoa" element={<Page><HOARequirements /></Page>} />
              <Route path="documents" element={<Page><Documents /></Page>} />
              <Route path="specifications" element={<Page><Specifications /></Page>} />
            </Route>

            <Route path="/communities/:communityId/lots/:lotNumber" element={<ReservedLotDetailPage />} />
            <Route path="/communities/:communityId/lots/:lotNumber/configure" element={<LotConfigurationPage />} />

            <Route path="*" element={<Navigate to="/communities" replace />} />
          </Routes>
        </AnimatePresence>
  )
}

// Full-screen layout with only TopNav (no SideNav)
function FullScreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopNav />
      {children}
    </div>
  )
}

function FullScreenRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/selections" element={<Page><SelectionsPage /></Page>} />
        <Route path="/builder-studio" element={<Page><BuilderStudioPage /></Page>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const location = useLocation()
  const isFullScreenPage = location.pathname === '/selections' || location.pathname === '/builder-studio'

  return (
    <DataProvider>
      <MobileNavProvider>
        {isFullScreenPage ? (
          <FullScreenLayout>
            <FullScreenRoutes />
          </FullScreenLayout>
        ) : (
          <AppLayout>
            <AppRoutes />
          </AppLayout>
        )}
      </MobileNavProvider>
    </DataProvider>
  )
}
