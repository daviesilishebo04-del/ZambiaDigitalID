// Login page - the first page users see

import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login() {
  // Store what the user types
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle login when button is clicked
  const handleLogin = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      })

      // Save the token and user info
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirect based on role
      const role = response.data.user.role
      if (role === 'admin') window.location.href = '/admin'
      else if (role === 'officer') window.location.href = '/officer'
      else if (role === 'hospital') window.location.href = '/hospital'
      else window.location.href = '/citizen'

    } catch (err) {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login-container'>
      <div className='login-box'>

        {/* Zambia Coat of Arms */}
        <img 
          src='/coat-of-arms.jpeg'
          alt='Zambia Coat of Arms' 
          className='coat-of-arms'
        />

        <h1 className='system-title'>ZAMBIA DIGITAL ID SYSTEM</h1>
        <p className='system-subtitle'>Ministry of Home Affairs</p>

        <div className='login-form'>
          <p className='login-heading'>STAFF AND CITIZEN LOGIN</p>
          <p className='login-subheading'>
            Please use your NRC number or username and password to log in
          </p>

          {/* Show error if login fails */}
          {error && <p className='error-message'>{error}</p>}

          <div className='input-group'>
            <label>Username / NRC Number</label>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter username or NRC number'
            />
          </div>

          <div className='input-group'>
            <label>Password</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter password'
            />
          </div>

          <button 
            className='login-button'
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>

          <p className='forgot-password'>Forgot your password? Contact your administrator</p>
        </div>

      </div>
    </div>
  )
}

export default Login