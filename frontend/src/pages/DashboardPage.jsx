import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAppContext } from '../App'
import { getDashboardStats, getScreenings, getPatientById } from '../api'

function DashboardPage() {
  const navigate = useNavigate()
  const { refreshData } = useAppContext()

  useEffect(() => { refreshData() }, [])

  const stats = getDashboardStats()
  const recentScreenings = getScreenings()
    .sort((a, b) => b.date - a.date)
    .slice(0, 5)

  const statCards = [
    { label: 'Total Patients', value: stats.totalPatients, icon: '👥', color: '#00d4aa' },
    { label: 'Screenings Today', value: stats.screeningsToday, icon: '📋', color: '#00b4d8' },
    { label: 'Total Screenings', value: stats.totalScreenings, icon: '🔬', color: '#8b5cf6' },
    { label: 'High Risk Cases', value: stats.highRiskCases, icon: '⚠️', color: '#ef4444' },
  ]

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="nav-logo">◈</span> LeproSight
        </div>
        <div className="nav-links">
          <button className="nav-link active">Dashboard</button>
          <button className="nav-link" onClick={() => navigate('/patients')}>Patients</button>
        </div>
      </nav>

      <div className="container">
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p className="subtitle">Welcome back, Health Worker. Here's your overview.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/patients')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Screening
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {statCards.map((s, i) => (
            <div className="stat-card" key={i} style={{ '--accent': s.color }}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-card" onClick={() => navigate('/patients/new')}>
              <span className="action-icon">➕</span>
              <span>Add New Patient</span>
            </button>
            <button className="action-card" onClick={() => navigate('/patients')}>
              <span className="action-icon">🔍</span>
              <span>Search Patients</span>
            </button>
            <button className="action-card" onClick={() => navigate('/patients')}>
              <span className="action-icon">📊</span>
              <span>Start Screening</span>
            </button>
          </div>
        </div>

        {/* Recent Screenings */}
        <div className="section">
          <h2 className="section-title">Recent Screenings</h2>
          {recentScreenings.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📋</span>
              <p>No screenings yet. Start your first screening to see results here.</p>
            </div>
          ) : (
            <div className="screening-list">
              {recentScreenings.map(s => {
                const patient = getPatientById(s.patientId)
                return (
                  <div className="screening-item" key={s.id} onClick={() => navigate(`/results/${s.id}`)}>
                    <div className="screening-info">
                      <span className="screening-name">{patient?.name || 'Unknown'}</span>
                      <span className="screening-date">
                        {new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <span className={`risk-badge risk-${s.riskLevel.toLowerCase()}`}>
                      {s.riskLevel}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
