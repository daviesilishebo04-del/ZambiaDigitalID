// Admin Controller - handles all admin related data

const pool = require('../config/db')
const bcrypt = require('bcrypt')

// Get system statistics
const getStats = async (req, res) => {
  try {
    const citizens = await pool.query('SELECT COUNT(*) FROM citizens')
    const users = await pool.query('SELECT COUNT(*) FROM users')
    const births = await pool.query("SELECT COUNT(*) FROM vital_events WHERE event_type = 'birth'")
    const deaths = await pool.query("SELECT COUNT(*) FROM vital_events WHERE event_type = 'death'")

    res.json({
      totalCitizens: parseInt(citizens.rows[0].count),
      totalUsers: parseInt(users.rows[0].count),
      totalBirths: parseInt(births.rows[0].count),
      totalDeaths: parseInt(deaths.rows[0].count)
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get all users
const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, role, full_name, email, created_at FROM users ORDER BY created_at DESC'
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Get audit logs
const getAuditLogs = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100'
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// Create new user
const createUser = async (req, res) => {
  try {
    const { full_name, username, email, password, role } = req.body

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save to database
    const result = await pool.query(
      'INSERT INTO users (full_name, username, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [full_name, username, email, hashedPassword, role]
    )

    res.json({ message: 'User created successfully', user: result.rows[0] })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getStats, getUsers, getAuditLogs, createUser }