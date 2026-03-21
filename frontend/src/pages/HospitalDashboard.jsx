// Hospital Dashboard - Birth and Death Registration

import { useState, useEffect } from 'react'
import axios from 'axios'
import './HospitalDashboard.css'

function HospitalDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [records, setRecords] = useState([])
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineRecords, setOfflineRecords] = useState([])
  const [birthForm, setBirthForm] = useState({
    first_name: '', last_name: '', date_of_event: '',
    place_of_event: '', district: '', province: '',
    father_name: '', mother_name: ''
  })
  const [deathForm, setDeathForm] = useState({
    first_name: '', last_name: '', date_of_event: '',
    place_of_event: '', district: '', province: '',
    cause_of_death: ''
  })

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  // Provinces of Zambia
  const provinces = [
    'Central', 'Copperbelt', 'Eastern', 'Luapula',
    'Lusaka', 'Muchinga', 'Northern', 'North-Western',
    'Southern', 'Western'
  ]

  // Detect online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncOfflineRecords()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load offline records from localStorage
    const saved = localStorage.getItem('offlineRecords')
    if (saved) setOfflineRecords(JSON.parse(saved))

    fetchRecords()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Fetch records from database
  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hospital/records', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRecords(response.data)
    } catch (error) {
      console.error('Error fetching records:', error)
    }
  }

  // Save offline records to localStorage
  const saveOfflineRecord = (record) => {
    const updated = [...offlineRecords, record]
    setOfflineRecords(updated)
    localStorage.setItem('offlineRecords', JSON.stringify(updated))
    alert('No internet! Record saved offline and will sync when connected.')
  }

  // Sync offline records when back online
  const syncOfflineRecords = async () => {
    const saved = localStorage.getItem('offlineRecords')
    if (!saved) return
    const records = JSON.parse(saved)
    if (records.length === 0) return

    try {
      await axios.post('http://localhost:5000/api/hospital/sync',
        { records },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      localStorage.removeItem('offlineRecords')
      setOfflineRecords([])
      fetchRecords()
      alert('Offline records synced successfully!')
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

  // Register birth
  const handleRegisterBirth = async () => {
    if (!birthForm.first_name || !birthForm.last_name || !birthForm.date_of_event) {
      alert('Please fill in all required fields!')
      return
    }

    if (!isOnline) {
      saveOfflineRecord({ ...birthForm, event_type: 'birth' })
      setBirthForm({
        first_name: '', last_name: '', date_of_event: '',
        place_of_event: '', district: '', province: '',
        father_name: '', mother_name: ''
      })
      return
    }

    try {
      await axios.post('http://localhost:5000/api/hospital/register-birth',
        birthForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Birth registered successfully!')
      setBirthForm({
        first_name: '', last_name: '', date_of_event: '',
        place_of_event: '', district: '', province: '',
        father_name: '', mother_name: ''
      })
      fetchRecords()
    } catch (error) {
      alert('Error registering birth!')
    }
  }

  // Register death
  const handleRegisterDeath = async () => {
    if (!deathForm.first_name || !deathForm.last_name || !deathForm.date_of_event) {
      alert('Please fill in all required fields!')
      return
    }

    if (!isOnline) {
      saveOfflineRecord({ ...deathForm, event_type: 'death' })
      setDeathForm({
        first_name: '', last_name: '', date_of_event: '',
        place_of_event: '', district: '', province: '',
        cause_of_death: ''
      })
      return
    }

    try {
      await axios.post('http://localhost:5000/api/hospital/register-death',
        deathForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Death registered successfully!')
      setDeathForm({
        first_name: '', last_name: '', date_of_event: '',
        place_of_event: '', district: '', province: '',
        cause_of_death: ''
      })
      fetchRecords()
    } catch (error) {
      alert('Error registering death!')
    }
  }

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <div className='hospital-container'>

      {/* Sidebar */}
      <div className='hospital-sidebar'>
        <div className='sidebar-header'>
          <img src='/coat-of-arms.png' alt='Zambia Coat of Arms' className='sidebar-logo' />
          <h2>ZambiaDigital ID</h2>
          <p>Hospital Portal</p>
        </div>

        {/* Online/Offline Indicator */}
        <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
          {isOnline ? '🟢 Online' : '🔴 Offline'}
          {offlineRecords.length > 0 && (
            <span className='pending-badge'>{offlineRecords.length} pending</span>
          )}
        </div>

        <nav className='sidebar-nav'>
          <button
            className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={activeTab === 'birth' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('birth')}
          >
            🍼 Register Birth
          </button>
          <button
            className={activeTab === 'death' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('death')}
          >
            💀 Register Death
          </button>
          <button
            className={activeTab === 'records' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('records')}
          >
            📋 Records
          </button>
        </nav>

        <button className='logout-btn' onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className='hospital-main'>

        {/* Top Bar */}
        <div className='topbar'>
          <h1>
            {activeTab === 'dashboard' && 'Hospital Dashboard'}
            {activeTab === 'birth' && 'Register Birth'}
            {activeTab === 'death' && 'Register Death'}
            {activeTab === 'records' && 'All Records'}
          </h1>
          <div className='staff-info'>
            🏥 {user.full_name || 'Hospital Staff'}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className='tab-content'>
            <div className='stats-grid'>
              <div className='stat-card green'>
                <h3>{records.filter(r => r.event_type === 'birth').length}</h3>
                <p>Births Registered</p>
              </div>
              <div className='stat-card black'>
                <h3>{records.filter(r => r.event_type === 'death').length}</h3>
                <p>Deaths Registered</p>
              </div>
              <div className='stat-card orange'>
                <h3>{offlineRecords.length}</h3>
                <p>Pending Sync</p>
              </div>
              <div className='stat-card green'>
                <h3>{records.length}</h3>
                <p>Total Records</p>
              </div>
            </div>

            {/* Sync button if offline records exist */}
            {offlineRecords.length > 0 && isOnline && (
              <button className='sync-btn' onClick={syncOfflineRecords}>
                🔄 Sync {offlineRecords.length} Offline Records
              </button>
            )}
          </div>
        )}

        {/* Birth Registration Tab */}
        {activeTab === 'birth' && (
          <div className='tab-content'>
            <div className='registration-form'>
              <h3 className='form-title'>🍼 Birth Registration Form</h3>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>Baby's First Name *</label>
                  <input type='text' placeholder='Enter first name'
                    value={birthForm.first_name}
                    onChange={(e) => setBirthForm({...birthForm, first_name: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Baby's Last Name *</label>
                  <input type='text' placeholder='Enter last name'
                    value={birthForm.last_name}
                    onChange={(e) => setBirthForm({...birthForm, last_name: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Date of Birth *</label>
                  <input type='date'
                    value={birthForm.date_of_event}
                    onChange={(e) => setBirthForm({...birthForm, date_of_event: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Place of Birth</label>
                  <input type='text' placeholder='e.g. UTH, Lusaka'
                    value={birthForm.place_of_event}
                    onChange={(e) => setBirthForm({...birthForm, place_of_event: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>District</label>
                  <input type='text' placeholder='Enter district'
                    value={birthForm.district}
                    onChange={(e) => setBirthForm({...birthForm, district: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Province</label>
                  <select value={birthForm.province}
                    onChange={(e) => setBirthForm({...birthForm, province: e.target.value})}
                  >
                    <option value=''>Select Province</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className='form-group'>
                  <label>Father's Name</label>
                  <input type='text' placeholder="Enter father's name"
                    value={birthForm.father_name}
                    onChange={(e) => setBirthForm({...birthForm, father_name: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Mother's Name</label>
                  <input type='text' placeholder="Enter mother's name"
                    value={birthForm.mother_name}
                    onChange={(e) => setBirthForm({...birthForm, mother_name: e.target.value})}
                  />
                </div>
              </div>
              <button className='submit-btn' onClick={handleRegisterBirth}>
                🍼 Register Birth
              </button>
            </div>
          </div>
        )}

        {/* Death Registration Tab */}
        {activeTab === 'death' && (
          <div className='tab-content'>
            <div className='registration-form'>
              <h3 className='form-title'>💀 Death Registration Form</h3>
              <div className='form-grid'>
                <div className='form-group'>
                  <label>First Name *</label>
                  <input type='text' placeholder='Enter first name'
                    value={deathForm.first_name}
                    onChange={(e) => setDeathForm({...deathForm, first_name: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Last Name *</label>
                  <input type='text' placeholder='Enter last name'
                    value={deathForm.last_name}
                    onChange={(e) => setDeathForm({...deathForm, last_name: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Date of Death *</label>
                  <input type='date'
                    value={deathForm.date_of_event}
                    onChange={(e) => setDeathForm({...deathForm, date_of_event: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Place of Death</label>
                  <input type='text' placeholder='e.g. UTH, Lusaka'
                    value={deathForm.place_of_event}
                    onChange={(e) => setDeathForm({...deathForm, place_of_event: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>District</label>
                  <input type='text' placeholder='Enter district'
                    value={deathForm.district}
                    onChange={(e) => setDeathForm({...deathForm, district: e.target.value})}
                  />
                </div>
                <div className='form-group'>
                  <label>Province</label>
                  <select value={deathForm.province}
                    onChange={(e) => setDeathForm({...deathForm, province: e.target.value})}
                  >
                    <option value=''>Select Province</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className='form-group'>
                  <label>Cause of Death</label>
                  <input type='text' placeholder='Enter cause of death'
                    value={deathForm.cause_of_death}
                    onChange={(e) => setDeathForm({...deathForm, cause_of_death: e.target.value})}
                  />
                </div>
              </div>
              <button className='submit-btn death' onClick={handleRegisterDeath}>
                💀 Register Death
              </button>
            </div>
          </div>
        )}

        {/* Records Tab */}
        {activeTab === 'records' && (
          <div className='tab-content'>
            <h3 className='section-title'>All Registrations</h3>
            <table className='data-table'>
              <thead>
                <tr>
                  <th>Certificate No.</th>
                  <th>Type</th>
                  <th>Full Name</th>
                  <th>Date</th>
                  <th>District</th>
                  <th>Province</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan='7' style={{textAlign: 'center', padding: '30px', color: '#888'}}>
                      No records yet
                    </td>
                  </tr>
                ) : (
                  records.map(r => (
                    <tr key={r.id}>
                      <td>{r.certificate_number}</td>
                      <td>
                        <span className={`event-badge ${r.event_type}`}>
                          {r.event_type === 'birth' ? '🍼 Birth' : '💀 Death'}
                        </span>
                      </td>
                      <td>{r.first_name} {r.last_name}</td>
                      <td>{new Date(r.date_of_event).toLocaleDateString()}</td>
                      <td>{r.district}</td>
                      <td>{r.province}</td>
                      <td><span className='status-badge'>{r.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}

export default HospitalDashboard