import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, createContext, useContext, useEffect } from 'react'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import PatientListPage from './pages/PatientListPage'
import NewPatientPage from './pages/NewPatientPage'
import ScreeningPage from './pages/ScreeningPage'
import ResultsPage from './pages/ResultsPage'
import { getPatients, getScreenings } from './api'

export const AppContext = createContext()

export function useAppContext() {
  return useContext(AppContext)
}

function App() {
  const [patients, setPatients] = useState([])
  const [screenings, setScreenings] = useState([])
  const [currentPatient, setCurrentPatient] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  useEffect(() => {
    setPatients(getPatients())
    setScreenings(getScreenings())
  }, [])

  const refreshData = () => {
    setPatients(getPatients())
    setScreenings(getScreenings())
  }

  return (
    <AppContext.Provider value={{
      patients, setPatients,
      screenings, setScreenings,
      currentPatient, setCurrentPatient,
      lastResult, setLastResult,
      refreshData
    }}>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/patients" element={<PatientListPage />} />
          <Route path="/patients/new" element={<NewPatientPage />} />
          <Route path="/screening/:patientId" element={<ScreeningPage />} />
          <Route path="/results/:screeningId" element={<ResultsPage />} />
        </Routes>
      </div>
    </AppContext.Provider>
  )
}

export default App
