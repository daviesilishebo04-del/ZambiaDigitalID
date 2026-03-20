// Admin Controller - handles all admin related data

const pool = require('../config/db')

// Get system statistics
const getStats = async (req, res) => {
  try {
    // Count total citizens
    const citizens = await pool.query('SELECT COUNT(*) FROM citizens')
    
    // Count total users
    const users = await pool.query('SELECT COUNT(*) FROM users')
    
    // Count birth records
    const births = await pool.query(
      "SELECT COUNT(*) FROM vital_events WHERE event_type = 'birth'"
    )
    
    // Count death records
    const deaths = await pool.query(
      "SELECT COUNT(*) FROM vital_events WHERE event_type = 'death'"
    )

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

module.exports = { getStats, getUsers, getAuditLogs }