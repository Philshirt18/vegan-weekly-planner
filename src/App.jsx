import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Welcome from './pages/Welcome.jsx'
import Dishes from './pages/Dishes.jsx'
import DishDetail from './pages/DishDetail.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import PlanDays from './pages/PlanDays.jsx'
import WeekPlan from './pages/WeekPlan.jsx'
import Shopping from './pages/Shopping.jsx'
import RequireAuth from './components/RequireAuth.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profil" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/gerichte" element={<RequireAuth><Dishes /></RequireAuth>} />
        <Route path="/gerichte/:id" element={<RequireAuth><DishDetail /></RequireAuth>} />
        <Route path="/woche/tage" element={<RequireAuth><PlanDays /></RequireAuth>} />
        <Route path="/woche" element={<RequireAuth><WeekPlan /></RequireAuth>} />
        <Route path="/einkauf" element={<RequireAuth><Shopping /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
