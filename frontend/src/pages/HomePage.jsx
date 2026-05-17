import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      {/* Animated background particles */}
      <div className="home-bg">
        <div className="particle p1"></div>
        <div className="particle p2"></div>
        <div className="particle p3"></div>
        <div className="particle p4"></div>
        <div className="particle p5"></div>
      </div>

      <div className="home-content">
        {/* Logo / Brand */}
        <div className="home-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 48 48" fill="none">
              <path d="M24 4L6 14v12c0 11 8 18 18 20 10-2 18-9 18-20V14L24 4z" fill="url(#lg)" opacity="0.15"/>
              <path d="M24 4L6 14v12c0 11 8 18 18 20 10-2 18-9 18-20V14L24 4z" stroke="url(#lg)" strokeWidth="2" fill="none"/>
              <circle cx="24" cy="22" r="6" stroke="#00d4aa" strokeWidth="2" fill="none"/>
              <path d="M24 16v-3M24 28v3M18 22h-3M30 22h3" stroke="#00d4aa" strokeWidth="1.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="lg" x1="6" y1="4" x2="42" y2="48">
                  <stop stopColor="#00d4aa"/>
                  <stop offset="1" stopColor="#00b4d8"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="logo-text">
            Lepro<span className="accent">Sight</span>
          </h1>
          <p className="logo-sub">by Arorakshak</p>
        </div>

        {/* Tagline */}
        <p className="home-tagline">
          AI-Powered Leprosy Screening Assistant
        </p>
        <p className="home-desc">
          Guiding community health workers through fast, accurate, and compassionate 
          screening — right at the doorstep.
        </p>

        {/* CTA */}
        <button className="btn btn-primary btn-lg home-cta" onClick={() => navigate('/dashboard')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Start Screening
        </button>

        {/* Feature cards */}
        <div className="feature-grid">
          {[
            { icon: '🔬', title: 'AI Analysis', desc: 'Analyzes skin patch images using trained models' },
            { icon: '📋', title: 'Step-by-Step', desc: 'Guided clinical questionnaire in under 5 minutes' },
            { icon: '🧠', title: 'Smart Rules', desc: 'Combines AI with clinical decision rules' },
            { icon: '📄', title: 'Referral Ready', desc: 'Generates actionable referral reports instantly' },
            { icon: '💚', title: 'Anti-Stigma', desc: 'Includes compassionate counseling guidance' },
            { icon: '⚡', title: 'Works Offline', desc: 'Designed for low-connectivity field conditions' },
          ].map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="disclaimer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p>
            <strong>LeproSight is a screening tool, not a diagnostic system.</strong> 
            Final diagnosis is always made by a qualified medical professional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
