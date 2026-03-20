// This file handles all login and authentication logic

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

// LOGIN function
const login = async (req, res) => {
  try {
    // Get username and password from the login form
    const { username, password } = req.body

    // Check if user exists in the database
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1', 
      [username]
    )

    // If user not found
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const user = result.rows[0]

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    // Create a login token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    // Send back the token and user details
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { login }