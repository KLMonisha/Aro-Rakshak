import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAppContext } from '../App'
import { getScreeningsForPatient } from '../api'

function PatientListPage() {
  const navigate = useNavigate()
  const { patients, refreshData } = useAppContext()
  const [search, setSearch] = useState('')

  useEffect(() => { refreshData() }, [])

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.village.toLowerCase().includes(search.toLowerCase())
  )

  const getLastScreening = (patientId) => {
    const screenings = getScreeningsForPatient(patientId)
    if (screenings.length === 0) return null
    return screenings.sort((a, b) => b.date - a.date)[0]
  }

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="nav-logo">◈</span> LeproSight
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="nav-link active">Patients</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <div>
            <h1>Patients</h1>
            <p className="subtitle">{patients.length} registered patients</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/patients/new')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Patient
          </button>
        </div>

        {/* Search */}
        <div className="search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by name or village..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Patient List */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">👥</span>
            <p>{search ? 'No patients match your search.' : 'No patients registered yet.'}</p>
            {!search && (
              <button className="btn btn-primary" onClick={() => navigate('/patients/new')}>
                Add First Patient
              </button>
            )}
          </div>
        ) : (
          <div className="patient-grid">
            {filtered.map(p => {
              const lastScreening = getLastScreening(p.id)
              return (
                <div className="patient-card" key={p.id}>
                  <div className="patient-avatar">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="patient-details">
                    <h3>{p.name}</h3>
                    <div className="patient-meta">
                      <span>{p.age} yrs • {p.gender}</span>
                      <span>📍 {p.village}</span>
                    </div>
                    {lastScreening && (
                      <span className={`risk-badge risk-${lastScreening.riskLevel.toLowerCase()}`}>
                        Last: {lastScreening.riskLevel}
                      </span>
                    )}
                  </div>
                  <div className="patient-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/screening/${p.id}`)}
                    >
                      Screen
                    </button>
                    {lastScreening && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/results/${lastScreening.id}`)}
                      >
                        View Last
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientListPage
