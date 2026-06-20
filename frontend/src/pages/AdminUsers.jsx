import React, { useEffect, useState } from 'react'
import api from '../services/api'
import './AdminUsers.css'

const initialUserForm = {
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'user'
}

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [nameFilter, setNameFilter] = useState('')
    const [emailFilter, setEmailFilter] = useState('')
    const [addressFilter, setAddressFilter] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [sortKey, setSortKey] = useState('name')
    const [dir, setDir] = useState('asc')
    const [selectedUser, setSelectedUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [userForm, setUserForm] = useState(initialUserForm)
    const [creating, setCreating] = useState(false)
    const [formError, setFormError] = useState('')
    const [success, setSuccess] = useState('')
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null')

    useEffect(() => { fetchUsers() }, [])

    function fetchUsers() {
        setLoading(true)
        api.get('/admin/users')
            .then(res => setUsers(res.data))
            .catch(() => setError('Failed to load users'))
            .finally(() => setLoading(false))
    }

    const viewUser = async (id) => {

        try {

            const res = await api.get(`/admin/users/${id}`);

            setSelectedUser(res.data);

        } catch (err) {

            console.error(err);

        }

    };

    const deleteUser = async () => {
        if (!userToDelete) return

        setDeleting(true)

        try {
            await api.delete(`/admin/users/${userToDelete.id}`)
            setUserToDelete(null)
            fetchUsers()
        } catch (error) {
            console.error(error)
            console.log(error.response?.data)
            alert(error.response?.data?.message || 'Failed to delete user')
        } finally {
            setDeleting(false)
        }
    }

    const closeCreateModal = () => {
        if (creating) return
        setShowCreateModal(false)
        setUserForm(initialUserForm)
        setFormError('')
    }

    const handleUserFormChange = (event) => {
        const { name, value } = event.target
        setUserForm(current => ({ ...current, [name]: value }))
    }

    const createUser = async (event) => {
        event.preventDefault()
        setCreating(true)
        setFormError('')
        setSuccess('')

        try {
            const response = await api.post('/admin/users', userForm)
            setShowCreateModal(false)
            setUserForm(initialUserForm)
            setSuccess(response.data?.message || 'User created successfully')
            fetchUsers()
        } catch (error) {
            console.error(error)
            console.log(error.response?.data)
            setFormError(error.response?.data?.message || 'Failed to create user')
        } finally {
            setCreating(false)
        }
    }

    const filtered = users.filter(u => {
        const matchesName = (u.name || '').toLowerCase().includes(nameFilter.toLowerCase())
        const matchesEmail = (u.email || '').toLowerCase().includes(emailFilter.toLowerCase())
        const matchesAddress = (u.address || '').toLowerCase().includes(addressFilter.toLowerCase())
        const matchesRole = roleFilter === 'all' || u.role === roleFilter
        return matchesName && matchesEmail && matchesAddress && matchesRole
    })
    filtered.sort((a, b) => {

        if (sortKey === "id") {
            return dir === "asc"
                ? a.id - b.id
                : b.id - a.id
        }

        const A = (a[sortKey] || '').toString().toLowerCase()
        const B = (b[sortKey] || '').toString().toLowerCase()

        if (A < B) return dir === 'asc' ? -1 : 1
        if (A > B) return dir === 'asc' ? 1 : -1

        return 0
    })

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <h1 className="page-title">Users</h1>
                    <p className="page-description">Search, sort, and review registered platform users.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Add User</button>
            </header>
            {success && <div className="success-message">{success}</div>}
            <div className="filter-card">
                <div className="filter-grid">
                    <div className="form-group filter-group">
                        <label className="form-label" htmlFor="filter-name">Search by Name</label>
                        <input className="input" id="filter-name" type="text" value={nameFilter} onChange={e => setNameFilter(e.target.value)} placeholder="Search by Name" />
                    </div>
                    <div className="form-group filter-group">
                        <label className="form-label" htmlFor="filter-email">Search by Email</label>
                        <input className="input" id="filter-email" type="text" value={emailFilter} onChange={e => setEmailFilter(e.target.value)} placeholder="Search by Email" />
                    </div>
                    <div className="form-group filter-group">
                        <label className="form-label" htmlFor="filter-address">Search by Address</label>
                        <input className="input" id="filter-address" type="text" value={addressFilter} onChange={e => setAddressFilter(e.target.value)} placeholder="Search by Address" />
                    </div>
                    <div className="form-group filter-group">
                        <label className="form-label" htmlFor="filter-role">Filter by Role</label>
                        <select className="select" id="filter-role" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                            <option value="all">All Roles</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="store_owner">Store Owner</option>
                        </select>
                    </div>
                </div>
                <button className="btn btn-secondary filter-reset" type="button" onClick={() => {
                    setNameFilter('')
                    setEmailFilter('')
                    setAddressFilter('')
                    setRoleFilter('all')
                }}>
                    Reset Filters
                </button>
            </div>
            <div className="toolbar">
                <select className="select admin-users-sort" aria-label="Sort users by" value={sortKey} onChange={e => setSortKey(e.target.value)}>
                    <option value="id">ID</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="role">Role</option>
                </select>
                <button className="btn btn-secondary" onClick={() => setDir(dir === 'asc' ? 'desc' : 'asc')}>{dir === 'asc' ? 'Ascending' : 'Descending'}</button>
            </div>

            {loading && <div className="page-state">Loading users...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && <div className="table-wrapper"><table className="table">
                <thead>
                    <tr><th>ID</th><th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Action</th></tr>
                </thead>
                <tbody>
                    {filtered.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td className="user-address">{u.address}</td>
                            <td><span className="badge">{u.role?.replace('_', ' ')}</span></td>
                            <td>
                                <div className="admin-row-actions">
                                    <button className="btn btn-secondary admin-users-action" onClick={() => viewUser(u.id)}>View</button>
                                    <button
                                        className="btn btn-danger admin-users-action"
                                        onClick={() => setUserToDelete(u)}
                                        disabled={Number(u.id) === Number(currentUser?.id)}
                                        title={Number(u.id) === Number(currentUser?.id) ? 'You cannot delete your own account' : 'Delete user'}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {!filtered.length && <tr><td className="empty-state" colSpan="6">No matching records found.</td></tr>}
                </tbody>
            </table></div>}

            {selectedUser && (
                <div className="modal-overlay">

                    <div className="modal user-modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title">

                        <button
                            className="modal-close"
                            onClick={() => setSelectedUser(null)}
                            aria-label="Close user details"
                        >
                            ✖
                        </button>

                        <h2 className="user-modal-title" id="user-modal-title">User Details</h2>

                        <p><strong>ID:</strong> {selectedUser.id}</p>

                        <p><strong>Name:</strong> {selectedUser.name}</p>

                        <p><strong>Email:</strong> {selectedUser.email}</p>

                        <p><strong>Address:</strong> {selectedUser.address}</p>

                        <p><strong>Role:</strong> {selectedUser.role}</p>

                        {selectedUser.role === "store_owner" && (
                            <p>
                                <strong>Store Rating:</strong>{" "}
                                {selectedUser.storeRating}
                            </p>
                        )}

                    </div>

                </div>
            )}

            {userToDelete && (
                <div className="modal-overlay">
                    <div className="modal delete-confirmation-modal" role="dialog" aria-modal="true" aria-labelledby="delete-user-title">
                        <h2 id="delete-user-title">Delete user?</h2>
                        <p>Are you sure you want to delete this user?</p>
                        <p className="delete-target-name">{userToDelete.name}</p>
                        <div className="delete-modal-actions">
                            <button className="btn btn-secondary" onClick={() => setUserToDelete(null)} disabled={deleting}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={deleteUser} disabled={deleting}>
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal create-user-modal" role="dialog" aria-modal="true" aria-labelledby="create-user-title">
                        <button className="modal-close" type="button" onClick={closeCreateModal} aria-label="Close create user modal">Close</button>
                        <h2 id="create-user-title">Create User</h2>
                        <p className="create-modal-description">Add a user and assign their platform role.</p>

                        <form className="admin-create-form" onSubmit={createUser}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="admin-user-name">Name</label>
                                <input className="input" id="admin-user-name" name="name" value={userForm.name} onChange={handleUserFormChange} minLength="3" maxLength="60" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="admin-user-email">Email</label>
                                <input className="input" id="admin-user-email" name="email" type="email" value={userForm.email} onChange={handleUserFormChange} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="admin-user-address">Address</label>
                                <textarea className="input admin-form-textarea" id="admin-user-address" name="address" value={userForm.address} onChange={handleUserFormChange} maxLength="400" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="admin-user-password">Password</label>
                                <input className="input" id="admin-user-password" name="password" type="password" value={userForm.password} onChange={handleUserFormChange} minLength="8" maxLength="16" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="admin-user-role">Role</label>
                                <select className="select" id="admin-user-role" name="role" value={userForm.role} onChange={handleUserFormChange}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="store_owner">Store Owner</option>
                                </select>
                            </div>

                            {formError && <div className="error">{formError}</div>}

                            <div className="create-modal-actions">
                                <button className="btn btn-secondary" type="button" onClick={closeCreateModal} disabled={creating}>Cancel</button>
                                <button className="btn btn-primary" type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create User'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}
