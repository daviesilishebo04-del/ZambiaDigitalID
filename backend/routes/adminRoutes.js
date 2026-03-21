// Admin routes - only accessible by admin users

const express = require('express')
const router = express.Router()
const { getStats, getUsers, getAuditLogs, createUser } = require('../controllers/adminController')
const { protect } = require('../middleware/authMiddleware')

// All routes below are protected - must be logged in
router.get('/stats', protect, getStats)
router.get('/users', protect, getUsers)
router.get('/audit-logs', protect, getAuditLogs)
router.post('/create-user', protect, createUser)

module.exports = router