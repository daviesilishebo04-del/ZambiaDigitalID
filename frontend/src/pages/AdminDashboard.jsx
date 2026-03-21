// Admin Dashboard - Full system control panel

import { useState, useEffect } from 'react'
import axios from 'axios'
import './AdminDashboard.css'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalCitizens: 0,
    totalUsers: 0,
    totalBirths: 0,
    totalDeaths: 0
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [newUser, setNewUser] = useState({
    full_name: '',
    username: '',
    email: '',
    password: '',
    role: 'officer'
  })

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchStats()
    fetchUsers()
    fetchAuditLogs()
  }, [])

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
  // Get audit logs
const fetchAuditLogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAuditLogs(response.data)
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    }
  }

  const handleCreateUser = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/create-user', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('User created successfully!')
      setNewUser({ full_name: '', username: '', email: '', password: '', role: 'officer' })
      fetchUsers()
    } catch (error) {
      alert('Error creating user!')
    }
  }

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

            {/* Create User Form */}
            <div className='create-user-form'>
              <h3>Create New User</h3>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>Full Name</label>
                  <input
                    type='text'
                    placeholder='Enter full name'
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Username</label>
                  <input
                    type='text'
                    placeholder='Enter username'
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Email</label>
                  <input
                    type='email'
                    placeholder='Enter email'
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Password</label>
                  <input
                    type='password'
                    placeholder='Enter password'
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value='officer'>National Registration Officer</option>
                    <option value='hospital'>Hospital Staff</option>

                    <option value='admin'>Admin</option>
                  </select>
                </div>
              </div>
              <button className='create-btn' onClick={handleCreateUser}>
                ➕ Create User
              </button>
            </div>

            {/* Users Table */}
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
    <h3 className='section-title'>System Audit Logs</h3>
    <table className='data-table'>
      <thead>
        <tr>
          <th>ID</th>
          <th>User</th>
          <th>Action</th>
          <th>Table</th>
          <th>Details</th>
          <th>Date & Time</th>
        </tr>
      </thead>
      <tbody>
        {auditLogs.length === 0 ? (
          <tr>
            <td colSpan='6' style={{textAlign: 'center', padding: '30px', color: '#888'}}>
              No audit logs yet
            </td>
          </tr>
        ) : (
          auditLogs.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.user_id}</td>
              <td>{log.action}</td>
              <td>{log.table_name}</td>
              <td>{log.details}</td>
              <td>{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}

        {/* Reports Tab */}
{activeTab === 'reports' && (
  <div className='tab-content'>
    <h3 className='section-title'>System Reports</h3>
    <div className='reports-grid'>
      <div className='report-card'>
        <h4>👥 Total Citizens Registered</h4>
        <p className='report-number green'>{stats.totalCitizens}</p>
      </div>
      <div className='report-card'>
        <h4>🏛️ Total System Users</h4>
        <p className='report-number orange'>{stats.totalUsers}</p>
      </div>
      <div className='report-card'>
        <h4>🍼 Total Birth Records</h4>
        <p className='report-number black'>{stats.totalBirths}</p>
      </div>
      <div className='report-card'>
        <h4>💀 Total Death Records</h4>
        <p className='report-number green'>{stats.totalDeaths}</p>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  )
}

export default AdminDashboard