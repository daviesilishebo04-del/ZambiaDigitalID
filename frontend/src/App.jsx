import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import HospitalDashboard from './pages/HospitalDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/hospital' element={<HospitalDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App