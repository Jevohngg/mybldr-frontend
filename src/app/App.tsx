import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { DataProvider } from './providers'
import AppLayout from '../layouts/AppLayout/AppLayout'
import CommunitiesPage from '../pages/Communities/CommunitiesPage'
import PlanLibraryPage from '../pages/PlanLibrary/PlanLibraryPage'
import GlobalSpecifications from '../pages/Specifications/GlobalSpecifications'
import CommunityLayout from '../layouts/CommunityLayout/CommunityLayout'
import CommunityOverview from '../pages/CommunityDetail/CommunityOverview'
import HOARequirements from '../pages/CommunityDetail/HOARequirements'
import Documents from '../pages/CommunityDetail/Documents'
import Specifications from '../pages/CommunityDetail/Specifications'
import ReservedLotDetailPage from '../pages/ReservedLotDetail/ReservedLotDetailPage'

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
            <Route path="/" element={<Navigate to="/communities" replace />} />

            <Route path="/plan-library" element={<Page><PlanLibraryPage /></Page>} />

            <Route path="/specifications" element={<Page><GlobalSpecifications /></Page>} />

            <Route path="/communities" element={<Page><CommunitiesPage /></Page>} />

            <Route path="/communities/:communityId" element={<CommunityLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<Page><CommunityOverview /></Page>} />
              <Route path="hoa" element={<Page><HOARequirements /></Page>} />
              <Route path="documents" element={<Page><Documents /></Page>} />
              <Route path="specifications" element={<Page><Specifications /></Page>} />
            </Route>

            <Route path="/communities/:communityId/lots/:lotNumber" element={<ReservedLotDetailPage />} />

            <Route path="*" element={<Navigate to="/communities" replace />} />
          </Routes>
        </AnimatePresence>
  )
}

export default function App() {
  return (
    <DataProvider>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </DataProvider>
  )
}
