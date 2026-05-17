import { useNavigate, useParams } from 'react-router-dom'
import { getScreeningById, getPatientById } from '../api'

function ResultsPage() {
  const { screeningId } = useParams()
  const navigate = useNavigate()
  const screening = getScreeningById(screeningId)
  const patient = screening ? getPatientById(screening.patientId) : null

  if (!screening || !patient) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <span className="empty-icon">❌</span>
            <p>Screening result not found.</p>
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  const riskClass = screening.riskLevel.toLowerCase()

  return (
    <div className="page">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/')}>
          <span className="nav-logo">◈</span> LeproSight
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate('/patients')}>Patients</button>
        </div>
      </nav>

      <div className="container container-md">
        <button className="btn btn-ghost back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>

        {/* Risk Banner */}
        <div className={`result-banner risk-bg-${riskClass}`}>
          <div className="result-risk-circle" style={{ borderColor: screening.riskColor }}>
            <span className="risk-level-text">{screening.riskLevel}</span>
            <span className="risk-label">RISK</span>
          </div>
          <div className="result-banner-info">
            <h1>Screening Complete</h1>
            <p>{patient.name} • {patient.age} yrs • {patient.village}</p>
            <p className="result-date">
              {new Date(screening.date).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <div className="confidence-badge">
            <span className="conf-value">{screening.confidence}%</span>
            <span className="conf-label">Confidence</span>
          </div>
        </div>

        {/* Findings */}
        <div className="result-section">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
            Clinical Findings
          </h2>
          <ul className="findings-list">
            {screening.findings.map((f, i) => (
              <li key={i}>
                <span className="finding-bullet">•</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Actions */}
        <div className="result-section">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00b4d8" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
            Recommended Actions
          </h2>
          <div className="actions-list">
            {screening.actions.map((a, i) => (
              <div className="action-item" key={i}>
                <span className="action-num">{i + 1}</span>
                <p>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Anti-Stigma Counseling */}
        <div className="result-section counseling-section">
          <h2>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            What to Tell the Patient
          </h2>
          <div className="counseling-list">
            {screening.counseling.map((c, i) => (
              <div className="counseling-item" key={i}>
                <span className="counseling-icon">💚</span>
                <p>{c}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-actions">
          {screening.riskLevel === 'HIGH' && (
            <button className="btn btn-danger btn-lg" onClick={() => {
              alert('Referral document generated! In a production app, this would create a PDF referral letter for the nearest PHC.')
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/>
              </svg>
              Generate Referral
            </button>
          )}
          <button className="btn btn-primary btn-lg" onClick={() => navigate(`/screening/${screening.patientId}`)}>
            New Screening for This Patient
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer result-disclaimer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p>
            This is a screening result generated by AI and clinical rules. 
            <strong> Final diagnosis must be made by a qualified medical professional.</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
