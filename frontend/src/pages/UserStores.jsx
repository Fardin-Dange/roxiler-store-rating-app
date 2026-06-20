import React, { useEffect, useState } from 'react'
import api from '../services/api'
import './UserStores.css'

export default function UserStores(){
  const [stores,setStores]=useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)
  const [query,setQuery]=useState('')
  const [sortKey,setSortKey]=useState('name')
  const [dir,setDir]=useState('asc')

  async function load(){
    setLoading(true)
    setError(null)

    try {
      const response = await api.get('/stores')
      setStores(response.data)
    } catch (error) {
      console.error(error)
      console.log(error.response?.data)

      const message = error.response?.data?.message || 'Operation failed'
      setError(message)
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    let mounted = true

    api.get('/stores')
      .then(response => {
        if (mounted) setStores(response.data)
      })
      .catch(error => {
        console.error(error)
        console.log(error.response?.data)

        const message = error.response?.data?.message || 'Operation failed'
        if (mounted) setError(message)
        alert(message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  },[])

  async function submitRating(storeId, value, isUpdate){
    try {
      if (isUpdate) {
        await api.put(`/ratings/${storeId}`, { rating: value })
      } else {
        await api.post('/ratings', {
          store_id: storeId,
          rating: value
        })
      }

      await load()
    } catch (error) {
      console.error(error)
      console.log(error.response?.data)

      alert(
        error.response?.data?.message ||
        'Operation failed'
      )
    }
  }

  const filtered = stores.filter(s=> (s.name||'').toLowerCase().includes(query.toLowerCase()) || (s.address||'').toLowerCase().includes(query.toLowerCase()))
  filtered.sort((a,b)=>{
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
          <h1 className="page-title">Explore Stores</h1>
          <p className="page-description">Discover stores and share your rating.</p>
        </div>
      </header>
      <div className="toolbar">
        <input className="input user-stores-search" aria-label="Search stores" placeholder="Search by name or address" value={query} onChange={e=>setQuery(e.target.value)} />
        <select className="select user-stores-sort" aria-label="Sort stores by" value={sortKey} onChange={e=>setSortKey(e.target.value)}>
          <option value="name">Name</option>
          <option value="address">Address</option>
        </select>
        <button className="btn btn-secondary" onClick={()=>setDir(dir==='asc'?'desc':'asc')}>{dir === 'asc' ? 'Ascending' : 'Descending'}</button>
      </div>

      {loading && <div className="page-state">Loading stores...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && <div className="stores-grid">
        {filtered.map(s=> (
          <article className="card store-card" key={s.id}>
            <div className="store-card-header">
              <h2 className="store-card-name">{s.name}</h2>
              <p className="store-card-address">{s.address}</p>
            </div>
            <div className="store-rating-summary">
              <div className="rating-summary-item"><span className="rating-summary-label">Average rating</span><span className="rating-summary-value">{s.overall_rating ?? '-'}</span></div>
              <div className="rating-summary-item"><span className="rating-summary-label">Your rating</span><span className="rating-summary-value">{s.user_rating ?? '-'}</span></div>
            </div>
            <RatingControl key={`${s.id}-${s.user_rating}`} store={s} onSubmit={submitRating} />
          </article>
        ))}
        {!filtered.length && <div className="card empty-state">No stores match your search.</div>}
      </div>}
    </section>
  )
}

function RatingControl({ store, onSubmit }){
  const [value,setValue]=useState(store.user_rating ?? 0)
  const [busy,setBusy]=useState(false)

  async function submit(){
    if(!value) return alert('Select rating 1-5')
    setBusy(true)
    try{
      const isUpdate = store.user_rating !== null && store.user_rating !== undefined
      await onSubmit(store.id, value, isUpdate)
    }finally{setBusy(false)}
  }

  return (
    <div className="rating-control">
      <select className="select" aria-label={`Rating for ${store.name}`} value={value} onChange={e=>setValue(Number(e.target.value))}>
        <option value={0}>Rate</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>
      <button className="btn btn-primary" onClick={submit} disabled={busy}>{busy? 'Saving...' : (store.user_rating != null ? 'Update' : 'Submit')}</button>
    </div>
  )
}
