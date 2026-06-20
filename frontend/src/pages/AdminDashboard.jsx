import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

export default function AdminDashboard(){
  const [data,setData]=useState(null)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)
  const nav = useNavigate()

  useEffect(()=>{
    let mounted=true
    setLoading(true)
    api.get('/admin/dashboard')
      .then(res=>{ if(mounted) setData(res.data) })
      .catch(e=>{ if(mounted) setError('Failed to load dashboard') })
      .finally(()=>{ if(mounted) setLoading(false) })
    return ()=> mounted=false
  },[])

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-description">Monitor users, stores, and ratings across the platform.</p>
        </div>
      </header>
      {loading && <div className="page-state">Loading dashboard...</div>}
      {error && <div className="error">{error}</div>}
      {data && (
        <div className="admin-stats-grid">
          <div className="card stat-card">
            <p className="stat-label">Total Users</p>
            <div className="stat-value">{data.totalUsers ?? '-'}</div>
          </div>
          <div className="card stat-card">
            <p className="stat-label">Total Stores</p>
            <div className="stat-value">{data.totalStores ?? '-'}</div>
          </div>
          <div className="card stat-card">
            <p className="stat-label">Total Ratings</p>
            <div className="stat-value">{data.totalRatings ?? '-'}</div>
          </div>
        </div>
      )}
      <div className="dashboard-actions">
        <button className="btn btn-primary" onClick={()=>nav('/admin/users')}>Manage users</button>
        <button className="btn btn-secondary" onClick={()=>nav('/admin/stores')}>Manage stores</button>
      </div>
    </section>
  )
}
