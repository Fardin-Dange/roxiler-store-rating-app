import React, { useEffect, useState } from 'react'
import api from '../services/api'
import './OwnerDashboard.css'

export default function OwnerDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.get('/owner/dashboard')
            .then(res => setData(res.data))
            .catch(() => setError('Failed to load'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Owner Dashboard</h1>
                    <p className="page-description">Track your store performance and customer feedback.</p>
                </div>
            </header>
            {loading && <div className="page-state">Loading dashboard...</div>}
            {error && <div className="error">{error}</div>}
            {data && (
                <>
                    <div className="owner-summary">
                        <div className="card owner-rating-card">
                            <p className="owner-store-label">Your Store</p>
                            <h2 className="owner-store-name">{data.storeName}</h2>
                            <div className="owner-rating-value">
                                <span className="owner-rating-number">{data.averageRating ?? 0}</span>
                                <span className="owner-rating-scale">/ 5 average rating</span>
                            </div>
                        </div>
                        <div className="card owner-insight-card">
                            <h3>Customer feedback</h3>
                            <p>{data.ratedUsers?.length ?? 0} users have rated your store.</p>
                        </div>
                    </div>

                    <h2 className="owner-table-heading">Rated Users</h2>
                    <div className="table-wrapper"><table className="table">
                        <thead><tr><th>Name</th><th>Email</th><th>Rating</th></tr></thead>
                        <tbody>
                            {data.ratedUsers?.map(u => (
                                <tr key={u.email}><td>{u.name}</td><td className="owner-user-email">{u.email}</td><td><span className="rating-value">{u.ratings}</span></td></tr>
                            ))}
                            {!data.ratedUsers?.length && <tr><td className="empty-state" colSpan="3">No ratings have been submitted yet.</td></tr>}
                        </tbody>
                    </table></div>
                </>
            )}
        </section>
    )
}
