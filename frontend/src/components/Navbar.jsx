import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import ChangePasswordModal from './ChangePasswordModal'
import './Navbar.css'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  function handleOpenChangePassword() {
    setSuccessMessage('')
    setShowChangePassword(true)
  }

  function handleCloseChangePassword() {
    setShowChangePassword(false)
  }

  function handlePasswordUpdateSuccess(message) {
    setSuccessMessage(message)
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link className="navbar-brand" to="/">
          <span className="navbar-brand-mark">SR</span>
          <span className="navbar-brand-text">StoreRating</span>
        </Link>
        <div className="navbar-links">
        {!user && (
          <>
            <Link className="navbar-link" to="/login">Login</Link>
            <Link className="navbar-link" to="/signup">Signup</Link>
          </>
        )}

        {user && (
          <>
            <span className="navbar-role">{user.role.replace('_', ' ')}</span>
            {user.role === 'admin' && <Link className="navbar-link" to="/admin">Dashboard</Link>}
            {user.role === 'user' && <Link className="navbar-link" to="/stores">Stores</Link>}
            {user.role === 'store_owner' && <Link className="navbar-link" to="/owner">Dashboard</Link>}
            <button className="navbar-change-password" type="button" onClick={handleOpenChangePassword}>Change Password</button>
            <button className="btn btn-plain navbar-logout" onClick={handleLogout}>Logout</button>
          </>
        )}
        </div>
      </div>
      {successMessage && <div className="navbar-success">{successMessage}</div>}
      {showChangePassword && (
        <ChangePasswordModal
          onClose={handleCloseChangePassword}
          onSuccess={handlePasswordUpdateSuccess}
        />
      )}
    </nav>
  )
}
