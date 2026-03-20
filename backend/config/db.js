// This file connects our backend to the PostgreSQL database

const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

// Create a connection pool to the database
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432
})

// Test the connection
pool.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err)
  } else {
    console.log('Connected to PostgreSQL database!')
  }
})

module.exports = pool