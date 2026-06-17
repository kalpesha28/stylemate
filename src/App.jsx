import { Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Wardrobe from './pages/Wardrobe'
import Builder from './pages/Builder'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/wardrobe" element={<Wardrobe />} />
      <Route path="/builder" element={<Builder />} />
    </Routes>
  )
}

export default App