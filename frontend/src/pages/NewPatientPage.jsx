import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAppContext } from '../App'
import { addPatient } from '../api'

function NewPatientPage() {
  const navigate = useNavigate()
  const { refreshData } = useAppContext()
  const [form, setForm] = useState({
    name: '', age: '', gender: 'Male', village: '', contact: ''
  })
  const [errors, setErrors] = useState({})

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.age || form.age < 1 || form.age > 120) e.age = 'Enter a valid age'
    if (!form.village.trim()) e.village = 'Village is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const patient = addPatient({ ...form, age: parseInt(form.age) })
    refreshData()
    navigate(`/screening/${patient.id}`)
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

        <div className="form-card">
          <div className="form-header">
            <span className="form-icon">👤</span>
            <h1>Register New Patient</h1>
            <p>Enter patient details to begin screening</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age *</label>
                <input
                  id="age"
                  type="number"
                  placeholder="e.g. 45"
                  value={form.age}
                  onChange={e => update('age', e.target.value)}
                  min="1" max="120"
                  className={errors.age ? 'input-error' : ''}
                />
                {errors.age && <span className="error-text">{errors.age}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" value={form.gender} onChange={e => update('gender', e.target.value)}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="village">Village / Location *</label>
              <input
                id="village"
                type="text"
                placeholder="e.g. Sundarnagar"
                value={form.village}
                onChange={e => update('village', e.target.value)}
                className={errors.village ? 'input-error' : ''}
              />
              {errors.village && <span className="error-text">{errors.village}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number</label>
              <input
                id="contact"
                type="tel"
                placeholder="e.g. 9876543210"
                value={form.contact}
                onChange={e => update('contact', e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block">
              Register & Begin Screening
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewPatientPage
