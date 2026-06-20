import React, { useEffect, useState } from 'react'
import api from '../services/api'
import './AdminStores.css'

const initialStoreForm = {
  name: '',
  email: '',
  address: '',
  owner_id: ''
}

export default function AdminStores(){
  const [stores,setStores]=useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)
  const [storeNameFilter,setStoreNameFilter]=useState('')
  const [storeEmailFilter,setStoreEmailFilter]=useState('')
  const [storeAddressFilter,setStoreAddressFilter]=useState('')
  const [sortKey,setSortKey]=useState('name')
  const [dir,setDir]=useState('asc')
  const [storeToDelete,setStoreToDelete]=useState(null)
  const [deleting,setDeleting]=useState(false)
  const [showCreateModal,setShowCreateModal]=useState(false)
  const [storeForm,setStoreForm]=useState(initialStoreForm)
  const [creating,setCreating]=useState(false)
  const [formError,setFormError]=useState('')
  const [success,setSuccess]=useState('')
  const [selectedStore,setSelectedStore]=useState(null)
  const [viewing,setViewing]=useState(false)

  useEffect(()=>{ load() },[])
  function load(){
    setLoading(true)
    api.get('/admin/stores')
      .then(res=> setStores(res.data))
      .catch(()=> setError('Failed to load stores'))
      .finally(()=> setLoading(false))
  }

  async function deleteStore(){
    if(!storeToDelete) return

    setDeleting(true)

    try{
      await api.delete(`/admin/stores/${storeToDelete.id}`)
      setStoreToDelete(null)
      load()
    }catch(error){
      console.error(error)
      console.log(error.response?.data)
      alert(error.response?.data?.message || 'Failed to delete store')
    }finally{
      setDeleting(false)
    }
  }

  async function viewStore(id){
    setViewing(true)
    try{
      const response = await api.get(`/admin/stores/${id}`)
      setSelectedStore(response.data)
    }catch(error){
      console.error(error)
      alert(error.response?.data?.message || 'Failed to load store details')
    }finally{
      setViewing(false)
    }
  }

  function closeSelectedStore(){
    setSelectedStore(null)
  }

  function closeCreateModal(){
    if(creating) return
    setShowCreateModal(false)
    setStoreForm(initialStoreForm)
    setFormError('')
  }

  function handleStoreFormChange(event){
    const { name, value } = event.target
    setStoreForm(current => ({ ...current, [name]: value }))
  }

  async function createStore(event){
    event.preventDefault()
    setCreating(true)
    setFormError('')
    setSuccess('')

    try{
      const response = await api.post('/stores', {
        ...storeForm,
        owner_id: Number(storeForm.owner_id)
      })
      setShowCreateModal(false)
      setStoreForm(initialStoreForm)
      setSuccess(response.data?.message || 'Store created successfully')
      load()
    }catch(error){
      console.error(error)
      console.log(error.response?.data)
      setFormError(error.response?.data?.message || 'Failed to create store')
    }finally{
      setCreating(false)
    }
  }

  const filtered = stores.filter(s => {
    const matchesName = (s.name || '').toLowerCase().includes(storeNameFilter.toLowerCase())
    const matchesEmail = (s.email || '').toLowerCase().includes(storeEmailFilter.toLowerCase())
    const matchesAddress = (s.address || '').toLowerCase().includes(storeAddressFilter.toLowerCase())
    return matchesName && matchesEmail && matchesAddress
  })
  const sorted = [...filtered].sort((a,b)=>{
    const A = (a[sortKey]||'').toString().toLowerCase()
    const B = (b[sortKey]||'').toString().toLowerCase()
    if(A<B) return dir==='asc'?-1:1
    if(A>B) return dir==='asc'?1:-1
    return 0
  })

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Stores</h1>
          <p className="page-description">Browse and organize every store registered on the platform.</p>
        </div>
        <button className="btn btn-primary" onClick={()=>setShowCreateModal(true)}>Add Store</button>
      </header>
      {success && <div className="success-message">{success}</div>}
      <div className="filter-card">
        <div className="filter-grid">
          <div className="form-group filter-group">
            <label className="form-label" htmlFor="filter-store-name">Search by Store Name</label>
            <input className="input" id="filter-store-name" type="text" value={storeNameFilter} onChange={e => setStoreNameFilter(e.target.value)} placeholder="Search by Store Name" />
          </div>
          <div className="form-group filter-group">
            <label className="form-label" htmlFor="filter-store-email">Search by Store Email</label>
            <input className="input" id="filter-store-email" type="text" value={storeEmailFilter} onChange={e => setStoreEmailFilter(e.target.value)} placeholder="Search by Store Email" />
          </div>
          <div className="form-group filter-group">
            <label className="form-label" htmlFor="filter-store-address">Search by Store Address</label>
            <input className="input" id="filter-store-address" type="text" value={storeAddressFilter} onChange={e => setStoreAddressFilter(e.target.value)} placeholder="Search by Store Address" />
          </div>
        </div>
        <button className="btn btn-secondary filter-reset" type="button" onClick={() => {
          setStoreNameFilter('')
          setStoreEmailFilter('')
          setStoreAddressFilter('')
        }}>
          Reset Filters
        </button>
      </div>
      <div className="toolbar">
        <select className="select admin-stores-sort" aria-label="Sort stores by" value={sortKey} onChange={e=>setSortKey(e.target.value)}>
          <option value="id">Id</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="overall_rating">Rating</option>
        </select>
        <button className="btn btn-secondary" onClick={()=>setDir(dir==='asc'?'desc':'asc')}>{dir === 'asc' ? 'Ascending' : 'Descending'}</button>
      </div>

      {loading && <div className="page-state">Loading stores...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && <div className="table-wrapper"><table className="table">
        <thead>
          <tr><th>Id</th><th>Name</th><th>Email</th><th>Address</th><th>Rating</th><th>Action</th></tr>
        </thead>
        <tbody>
          {sorted.map(s=> (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td className="store-email">{s.email}</td>
              <td className="store-address-cell">{s.address}</td>
              <td><span className="rating-value">{s.overall_rating ?? s.rating ?? '-'}</span></td>
              <td className="store-actions-cell">
                <button className="btn btn-secondary admin-store-view" onClick={()=>viewStore(s.id)} disabled={viewing}>View</button>
                <button className="btn btn-danger admin-store-delete" onClick={()=>setStoreToDelete(s)}>Delete</button>
              </td>
            </tr>
          ))}
          {!sorted.length && <tr><td className="empty-state" colSpan="6">No matching records found.</td></tr>}
        </tbody>
      </table></div>}

      {storeToDelete && (
        <div className="modal-overlay">
          <div className="modal store-delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-store-title">
            <h2 id="delete-store-title">Delete store?</h2>
            <p>Are you sure you want to delete this store?</p>
            <p className="delete-target-name">{storeToDelete.name}</p>
            <div className="store-delete-actions">
              <button className="btn btn-secondary" onClick={()=>setStoreToDelete(null)} disabled={deleting}>Cancel</button>
              <button className="btn btn-danger" onClick={deleteStore} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal create-store-modal" role="dialog" aria-modal="true" aria-labelledby="create-store-title">
            <button className="store-modal-close" type="button" onClick={closeCreateModal} aria-label="Close create store modal">&times;</button>
            <h2 id="create-store-title">Create Store</h2>
            <p className="create-store-description">Add a store and connect it to a store owner.</p>

            <form className="store-create-form" onSubmit={createStore}>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-store-name">Store Name</label>
                <input className="input" id="admin-store-name" name="name" value={storeForm.name} onChange={handleStoreFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-store-email">Store Email</label>
                <input className="input" id="admin-store-email" name="email" type="email" value={storeForm.email} onChange={handleStoreFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-store-address">Store Address</label>
                <textarea className="input store-form-textarea" id="admin-store-address" name="address" value={storeForm.address} onChange={handleStoreFormChange} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="admin-store-owner">Owner ID</label>
                <input className="input" id="admin-store-owner" name="owner_id" type="number" min="1" value={storeForm.owner_id} onChange={handleStoreFormChange} required />
                <span className="form-help">Enter the ID of a user with the Store Owner role.</span>
              </div>

              {formError && <div className="error">{formError}</div>}

              <div className="store-create-actions">
                <button className="btn btn-secondary" type="button" onClick={closeCreateModal} disabled={creating}>Cancel</button>
                <button className="btn btn-primary" type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create Store'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedStore && (
        <div className="modal-overlay">
          <div className="modal store-details-modal" role="dialog" aria-modal="true" aria-labelledby="store-details-title">
            <button className="store-modal-close" type="button" onClick={closeSelectedStore} aria-label="Close store details modal">&times;</button>
            <h2 id="store-details-title">Store Details</h2>
            <div className="store-details-grid">
              <div className="store-details-row"><span>Store ID</span><span>{selectedStore.id}</span></div>
              <div className="store-details-row"><span>Store Name</span><span>{selectedStore.name}</span></div>
              <div className="store-details-row"><span>Store Email</span><span>{selectedStore.email}</span></div>
              <div className="store-details-row"><span>Store Address</span><span>{selectedStore.address}</span></div>
              <div className="store-details-row"><span>Average Rating</span><span>{selectedStore.rating}</span></div>
              <div className="store-details-row"><span>Owner ID</span><span>{selectedStore.owner_id}</span></div>
              {selectedStore.owner && (
                <>
                  <div className="store-details-row"><span>Owner Name</span><span>{selectedStore.owner.name}</span></div>
                  <div className="store-details-row"><span>Owner Email</span><span>{selectedStore.owner.email}</span></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
