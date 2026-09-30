import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Welcome from './pages/Welcome.jsx'
import Dishes from './pages/Dishes.jsx'
import DishDetail from './pages/DishDetail.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
