import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/AppLayout.css'

import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminStores from './pages/AdminStores'
import UserStores from './pages/UserStores'
import OwnerDashboard from './pages/OwnerDashboard'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/admin"
            element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>}
          />
          <Route
            path="/admin/stores"
            element={<ProtectedRoute allowedRoles={["admin"]}><AdminStores /></ProtectedRoute>}
          />

          <Route
            path="/stores"
            element={<ProtectedRoute allowedRoles={["user"]}><UserStores /></ProtectedRoute>}
          />

          <Route
            path="/owner"
            element={<ProtectedRoute allowedRoles={["store_owner"]}><OwnerDashboard /></ProtectedRoute>}
          />

          <Route path="*" element={<div className="not-found">Page not found</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
