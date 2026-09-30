import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Welcome from './pages/Welcome.jsx'
import Dishes from './pages/Dishes.jsx'
import DishDetail from './pages/DishDetail.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/gerichte" element={<Dishes />} />
        <Route path="/gerichte/:id" element={<DishDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
