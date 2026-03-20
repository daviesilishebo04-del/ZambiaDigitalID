// Admin Dashboard - Full system control panel

import { useState, useEffect } from 'react'
import axios from 'axios'
import './AdminDashboard.css'

function AdminDashboard() {
  // Store data
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalCitizens: 0,
    totalUsers: 0,
    totalBirths: 0,
    totalDeaths: 0
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [auditLogs, setAuditLogs] = useState([])

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  // Load data when page opens
  useEffect(() => {
    fetchStats()
    fetchUsers()
  }, [])

  // Get system statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Get all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <div className='admin-container'>

      {/* Sidebar */}
      <div className='sidebar'>
        <div className='sidebar-header'>
          <img src='/coat-of-arms.png' alt='Zambia Coat of Arms' className='sidebar-logo' />
          <h2>ZambiaDigital ID</h2>
          <p>Admin Panel</p>
        </div>

        <nav className='sidebar-nav'>
          <button
            className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={activeTab === 'users' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('users')}
          >
            👥 Manage Users
          </button>
          <button
            className={activeTab === 'audit' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('audit')}
          >
            📋 Audit Logs
          </button>
          <button
            className={activeTab === 'reports' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('reports')}
          >
            📈 Reports
          </button>
        </nav>

        <button className='logout-btn' onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className='main-content'>

        {/* Top Bar */}
        <div className='topbar'>
          <h1>
            {activeTab === 'dashboard' && 'System Dashboard'}
            {activeTab === 'users' && 'Manage Users'}
            {activeTab === 'audit' && 'Audit Logs'}
            {activeTab === 'reports' && 'Reports'}
          </h1>
          <div className='admin-info'>
            <span>👑 {user.full_name || 'Administrator'}</span>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className='tab-content'>
            <div className='stats-grid'>
              <div className='stat-card green'>
                <h3>{stats.totalCitizens}</h3>
                <p>Total Citizens</p>
              </div>
              <div className='stat-card orange'>
                <h3>{stats.totalUsers}</h3>
                <p>System Users</p>
              </div>
              <div className='stat-card black'>
                <h3>{stats.totalBirths}</h3>
                <p>Birth Records</p>
              </div>
              <div className='stat-card green'>
                <h3>{stats.totalDeaths}</h3>
                <p>Death Records</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className='tab-content'>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.full_name}</td>
                    <td>{u.username}</td>
                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                    <td>{u.email}</td>
                    <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className='tab-content'>
            <p className='coming-soon'>📋 Audit logs will appear here</p>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className='tab-content'>
            <p className='coming-soon'>📈 Reports will appear here</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard