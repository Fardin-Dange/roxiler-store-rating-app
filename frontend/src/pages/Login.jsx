import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (user.role === 'admin') navigate('/admin')
      else if (user.role === 'store_owner') navigate('/owner')
      else navigate('/stores')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <section className="card login-card">
      <h1 className="login-heading">Welcome back</h1>
      <p className="login-subtitle">Sign in to manage your store rating account.</p>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email address</label>
          <input className="input" id="login-email" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input className="input" id="login-password" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Enter your password" required />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="btn btn-primary login-submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p className="login-footer">Don't have an account? <Link to="/signup">Create one</Link></p>
      </section>
    </div>
  )
}
