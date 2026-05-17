import { useNavigate, useParams } from 'react-router-dom'
import { useState, useRef } from 'react'
import { useAppContext } from '../App'
import { getPatientById, runScreening } from '../api'

const STEPS = ['Patient Info', 'Skin Patch Photo', 'Clinical Questions', 'AI Analysis']

function ScreeningPage() {
  const { patientId } = useParams()
  const navigate = useNavigate()
  const { setLastResult, refreshData } = useAppContext()
  const patient = getPatientById(patientId)

  const [step, setStep] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [clinical, setClinical] = useState({
    sensationLoss: '',
    duration: '',
    nerveThickening: '',
    patchCount: 1,
    patchColor: ''
  })
  const [processing, setProcessing] = useState(false)
  const fileRef = useRef()

  if (!patient) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <span className="empty-icon">❌</span>
            <p>Patient not found.</p>
            <button className="btn btn-primary" onClick={() => navigate('/patients')}>Go to Patients</button>
          </div>
        </div>
      </div>
    )
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const updateClinical = (field, value) => {
    setClinical(prev => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    if (step === 2) {
      return clinical.sensationLoss && clinical.duration && clinical.nerveThickening && clinical.patchColor
    }
    return true
  }

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1)
    } else if (step === 2) {
      // Start AI analysis
      setStep(3)
      setProcessing(true)
      try {
        const result = await runScreening({
          patientId,
          hasImage: !!imageFile,
          clinicalInputs: clinical
        })
        setLastResult(result)
        refreshData()
        navigate(`/results/${result.id}`)
      } catch (err) {
        console.error(err)
        setProcessing(false)
      }
    }
  }

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

      <div className="container container-sm">
        <button className="btn btn-ghost back-btn" onClick={() => navigate('/patients')}>
          ← Back to Patients
        </button>

        {/* Step Indicator */}
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} key={i}>
              <div className="step-num">{i < step ? '✓' : i + 1}</div>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="screening-card">
          {/* Step 0: Patient Info */}
          {step === 0 && (
            <div className="step-content fade-in">
              <h2>Patient Information</h2>
              <p className="step-desc">Confirm the patient details before proceeding.</p>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{patient.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Age</span>
                  <span className="info-value">{patient.age} years</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gender</span>
                  <span className="info-value">{patient.gender}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Village</span>
                  <span className="info-value">{patient.village}</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Image Upload */}
          {step === 1 && (
            <div className="step-content fade-in">
              <h2>Skin Patch Photo</h2>
              <p className="step-desc">Upload or capture a photo of the skin patch (if present). This is optional but improves accuracy.</p>

              <div
                className={`upload-zone ${imagePreview ? 'has-image' : ''}`}
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
              >
                {imagePreview ? (
                  <div className="upload-preview">
                    <img src={imagePreview} alt="Skin patch" />
                    <button className="btn btn-ghost btn-sm remove-img" onClick={(e) => {
                      e.stopPropagation()
                      setImageFile(null)
                      setImagePreview(null)
                    }}>
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <p>Click or drag to upload a photo</p>
                    <span className="upload-hint">Supports JPG, PNG • Max 10 MB</span>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  hidden
                />
              </div>
            </div>
          )}

          {/* Step 2: Clinical Questions */}
          {step === 2 && (
            <div className="step-content fade-in">
              <h2>Clinical Assessment</h2>
              <p className="step-desc">Answer the following questions based on your examination.</p>

              <div className="question-list">
                {/* Sensation Loss */}
                <div className="question">
                  <label>1. Is there loss of sensation in the patch?</label>
                  <div className="option-group">
                    {[
                      { value: 'yes', label: 'Yes — Complete loss' },
                      { value: 'reduced', label: 'Reduced sensation' },
                      { value: 'no', label: 'No — Normal sensation' }
                    ].map(o => (
                      <button
                        key={o.value}
                        className={`option-btn ${clinical.sensationLoss === o.value ? 'selected' : ''}`}
                        onClick={() => updateClinical('sensationLoss', o.value)}
                        type="button"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="question">
                  <label>2. How long has the patch been present?</label>
                  <div className="duration-input">
                    <input
                      type="number"
                      min="0"
                      max="120"
                      placeholder="0"
                      value={clinical.duration}
                      onChange={e => updateClinical('duration', e.target.value)}
                    />
                    <span>months</span>
                  </div>
                </div>

                {/* Nerve Thickening */}
                <div className="question">
                  <label>3. Is there peripheral nerve thickening?</label>
                  <div className="option-group">
                    {[
                      { value: 'yes', label: 'Yes' },
                      { value: 'no', label: 'No' },
                    ].map(o => (
                      <button
                        key={o.value}
                        className={`option-btn ${clinical.nerveThickening === o.value ? 'selected' : ''}`}
                        onClick={() => updateClinical('nerveThickening', o.value)}
                        type="button"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patch Count */}
                <div className="question">
                  <label>4. Number of skin patches observed:</label>
                  <div className="duration-input">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={clinical.patchCount}
                      onChange={e => updateClinical('patchCount', parseInt(e.target.value) || 1)}
                    />
                    <span>patches</span>
                  </div>
                </div>

                {/* Patch Color */}
                <div className="question">
                  <label>5. What is the color of the patch?</label>
                  <div className="option-group">
                    {[
                      { value: 'hypopigmented', label: 'Lighter than skin' },
                      { value: 'reddish', label: 'Reddish / Copper' },
                      { value: 'normal', label: 'Similar to skin' },
                    ].map(o => (
                      <button
                        key={o.value}
                        className={`option-btn ${clinical.patchColor === o.value ? 'selected' : ''}`}
                        onClick={() => updateClinical('patchColor', o.value)}
                        type="button"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Processing */}
          {step === 3 && (
            <div className="step-content fade-in processing-step">
              <div className="processing-animation">
                <div className="pulse-ring"></div>
                <div className="pulse-ring delay"></div>
                <div className="brain-icon">🧠</div>
              </div>
              <h2>Analyzing...</h2>
              <p className="step-desc">AI is processing the clinical inputs and image data.</p>
              <div className="processing-steps">
                <div className="proc-step done">✓ Clinical data received</div>
                <div className="proc-step done">✓ Image {imageFile ? 'uploaded' : 'skipped'}</div>
                <div className="proc-step active">⟳ Running AI analysis...</div>
                <div className="proc-step">○ Generating recommendations</div>
              </div>
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div className="step-nav">
              {step > 0 && (
                <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
                  ← Back
                </button>
              )}
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                {step === 2 ? 'Run AI Analysis →' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ScreeningPage
