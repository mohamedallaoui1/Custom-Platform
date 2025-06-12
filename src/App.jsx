import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './components/ui/theme-provider'
import SidebarD from './components/Sidebar'
import NPKVerification from './components/NPKVerification'
import VerificationResults from './components/VerificationResults'
import { useState } from 'react'

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
        <SidebarD isCollapsed={isSidebarCollapsed} onCollapse={setIsSidebarCollapsed} />
        <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'pl-16' : 'pl-64'} p-4`}>
          <Routes>
            <Route path="/" element={<Navigate to="/npk-verification" replace />} />
            <Route path="/npk-verification" element={<NPKVerification />} />
            <Route path="/verification-results" element={<VerificationResults />} />
            <Route path="/formulations" element={<div>Formulations</div>} />
            <Route path="/compounds" element={<div>Compounds Database</div>} />
            <Route path="/reports" element={<div>Reports</div>} />
          </Routes>
        </main>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
