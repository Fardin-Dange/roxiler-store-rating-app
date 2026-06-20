import React, { useState } from 'react'
import api from '../services/api'
import './ChangePasswordModal.css'

export default function ChangePasswordModal({ onClose, onSuccess }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation must match')
      return
    }

    if (!passwordRegex.test(newPassword)) {
      setError('Password must be 8-16 chars with one uppercase letter and one special character')
      return
    }

    setSubmitting(true)

    try {
      const response = await api.put('/change-password', {
        currentPassword,
        newPassword
      })
      onSuccess(response.data?.message || 'Password updated successfully')
      onClose()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Failed to update password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal change-password-modal" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close change password modal">&times;</button>
        <h2 id="change-password-title">Change Password</h2>
        <p className="change-password-description">Update your account password securely.</p>

        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="current-password">Current Password</label>
            <input
              className="input"
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="new-password">New Password</label>
            <input
              className="input"
              id="new-password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">Confirm New Password</label>
            <input
              className="input"
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="error change-password-error">{error}</div>}

          <div className="change-password-actions">
            <button className="btn btn-secondary" type="button" onClick={onClose} disabled={submitting}>Cancel</button>
            <button className="btn btn-primary" type="submit" disabled={submitting}>{submitting ? 'Updating...' : 'Update Password'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
