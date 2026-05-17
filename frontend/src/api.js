/* ─────────────────────────────────────────────
   api.js — Mock data layer & AI screening logic
   Patient & screening data persisted in localStorage
   ───────────────────────────────────────────── */

const PATIENTS_KEY = 'leprosight_patients'
const SCREENINGS_KEY = 'leprosight_screenings'

// ── Seed data (first-time use) ──
const seedPatients = [
  { id: 'p1', name: 'Ramesh Kumar', age: 45, gender: 'Male', village: 'Sundarnagar', contact: '9876543210', createdAt: Date.now() - 86400000 * 5 },
  { id: 'p2', name: 'Sunita Devi', age: 32, gender: 'Female', village: 'Bastipur', contact: '9123456780', createdAt: Date.now() - 86400000 * 3 },
  { id: 'p3', name: 'Arjun Singh', age: 58, gender: 'Male', village: 'Rampur', contact: '9988776655', createdAt: Date.now() - 86400000 * 1 },
]

function initStorage() {
  if (!localStorage.getItem(PATIENTS_KEY)) {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(seedPatients))
  }
  if (!localStorage.getItem(SCREENINGS_KEY)) {
    localStorage.setItem(SCREENINGS_KEY, JSON.stringify([]))
  }
}
initStorage()

// ── Patient CRUD ──
export function getPatients() {
  return JSON.parse(localStorage.getItem(PATIENTS_KEY) || '[]')
}

export function getPatientById(id) {
  return getPatients().find(p => p.id === id) || null
}

export function addPatient(patient) {
  const patients = getPatients()
  const newPatient = {
    ...patient,
    id: 'p' + Date.now(),
    createdAt: Date.now()
  }
  patients.push(newPatient)
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
  return newPatient
}

// ── Screening CRUD ──
export function getScreenings() {
  return JSON.parse(localStorage.getItem(SCREENINGS_KEY) || '[]')
}

export function getScreeningById(id) {
  return getScreenings().find(s => s.id === id) || null
}

export function getScreeningsForPatient(patientId) {
  return getScreenings().filter(s => s.patientId === patientId)
}

function saveScreening(screening) {
  const screenings = getScreenings()
  screenings.push(screening)
  localStorage.setItem(SCREENINGS_KEY, JSON.stringify(screenings))
  return screening
}

// ── AI Screening Engine (rule-based simulation) ──
export async function runScreening({ patientId, hasImage, clinicalInputs }) {
  // Simulate AI processing delay (1.5 – 3 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500))

  const { sensationLoss, duration, nerveThickening, patchCount, patchColor } = clinicalInputs

  // ── Scoring ──
  let score = 0
  const findings = []
  const actions = []

  // Sensation loss (strongest indicator)
  if (sensationLoss === 'yes') {
    score += 35
    findings.push('Loss of sensation detected in the affected patch — this is a key clinical sign.')
  } else if (sensationLoss === 'reduced') {
    score += 20
    findings.push('Reduced sensation noted in the patch area — warrants further evaluation.')
  } else {
    findings.push('Sensation appears normal in the affected area.')
  }

  // Duration
  const durationMonths = parseInt(duration) || 0
  if (durationMonths >= 6) {
    score += 20
    findings.push(`Patch has persisted for ${durationMonths} months — prolonged duration increases concern.`)
  } else if (durationMonths >= 3) {
    score += 10
    findings.push(`Patch has been present for ${durationMonths} months.`)
  } else {
    findings.push(`Recent onset (${durationMonths} months) — monitor for changes.`)
  }

  // Nerve thickening
  if (nerveThickening === 'yes') {
    score += 30
    findings.push('Peripheral nerve thickening palpated — a strong indicator for referral.')
  } else {
    findings.push('No nerve thickening detected on palpation.')
  }

  // Patch count
  if (patchCount >= 5) {
    score += 15
    findings.push(`Multiple patches observed (${patchCount}) — multibacillary presentation possible.`)
  } else if (patchCount >= 2) {
    score += 8
    findings.push(`${patchCount} patches observed.`)
  } else {
    findings.push('Single patch observed.')
  }

  // Patch color
  if (patchColor === 'hypopigmented') {
    score += 5
    findings.push('Hypopigmented (lighter) patch noted — consistent with leprosy presentation.')
  } else if (patchColor === 'reddish') {
    score += 8
    findings.push('Reddish/copper-colored patch — may indicate active disease.')
  }

  // Image analysis simulation
  if (hasImage) {
    score += 5
    findings.push('Skin patch image captured for specialist review.')
  }

  // ── Risk level ──
  let riskLevel, riskColor
  if (score >= 50) {
    riskLevel = 'HIGH'
    riskColor = '#ef4444'
    actions.push('Immediately refer to the nearest PHC/leprosy referral center.')
    actions.push('Inform the patient about the importance of early treatment.')
    actions.push('Document all findings and include the photograph in the referral.')
    actions.push('Schedule a follow-up within 1 week to confirm referral completion.')
  } else if (score >= 25) {
    riskLevel = 'MEDIUM'
    riskColor = '#f59e0b'
    actions.push('Schedule a follow-up visit within 2 weeks for reassessment.')
    actions.push('Consider referral to PHC for expert opinion.')
    actions.push('Monitor for any changes in patch size, sensation, or new patches.')
    actions.push('Educate the patient on signs to watch for.')
  } else {
    riskLevel = 'LOW'
    riskColor = '#10b981'
    actions.push('Continue routine monitoring during home visits.')
    actions.push('Reassess during the next scheduled visit.')
    actions.push('Educate the patient to report any changes in skin patches.')
  }

  // ── Counseling messages ──
  const counseling = [
    'Leprosy is completely curable with Multi-Drug Therapy (MDT), which is available free of cost.',
    'Early detection and treatment prevent disability — there is nothing to fear.',
    'Leprosy is NOT caused by sin or curse. It is a bacterial infection like any other.',
    'A person on treatment is NOT infectious — they can live, work, and eat with family normally.',
    'Encourage the patient and family to ask questions. Address any stigma with compassion.'
  ]

  const confidence = Math.min(95, 60 + (hasImage ? 15 : 0) + (score > 30 ? 10 : 0) + Math.floor(Math.random() * 10))

  const screening = {
    id: 's' + Date.now(),
    patientId,
    date: Date.now(),
    score,
    riskLevel,
    riskColor,
    confidence,
    findings,
    actions,
    counseling,
    clinicalInputs,
    hasImage
  }

  saveScreening(screening)
  return screening
}

// ── Dashboard Stats ──
export function getDashboardStats() {
  const patients = getPatients()
  const screenings = getScreenings()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const screeningsToday = screenings.filter(s => s.date >= today.getTime())
  const highRisk = screenings.filter(s => s.riskLevel === 'HIGH')
  const referralsMade = highRisk.length

  return {
    totalPatients: patients.length,
    screeningsToday: screeningsToday.length,
    totalScreenings: screenings.length,
    highRiskCases: highRisk.length,
    referralsMade
  }
}
