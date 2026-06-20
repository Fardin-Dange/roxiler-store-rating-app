import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import './Signup.css'

export default function Signup(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [address,setAddress]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const [errors,setErrors]=useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    setErrors(null)
    try{
      await api.post('/signup',{ name, email, address, password })
      navigate('/login')
    }catch(err){
      setErrors(err.response?.data || { message: 'Signup failed' })
    }finally{setLoading(false)}
  }

  return (
    <div className="signup-page">
      <section className="card signup-card">
      <h1 className="signup-heading">Create your account</h1>
      <p className="signup-subtitle">Join the platform and start rating stores.</p>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label className="form-label" htmlFor="signup-name">Full name</label>
          <input className="input" id="signup-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-email">Email address</label>
          <input className="input" id="signup-email" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-address">Address</label>
          <input className="input" id="signup-address" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Your address" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-password">Password</label>
          <input className="input" id="signup-password" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Create a password" required />
        </div>
        {errors && <div className="error">{errors.message || JSON.stringify(errors)}</div>}
        <button className="btn btn-primary signup-submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p className="signup-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </section>
    </div>
  )
}
