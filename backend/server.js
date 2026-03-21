// Main server file - this starts our backend

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

// Load secret keys from .env file
dotenv.config()

// Import routes
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const hospitalRoutes = require('./routes/hospitalRoutes')

// Create our server
const app = express()

// Allow frontend to talk to backend
app.use(cors())

// Allow server to read JSON data
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Zambia Digital ID System is running!' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/hospital', hospitalRoutes)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})