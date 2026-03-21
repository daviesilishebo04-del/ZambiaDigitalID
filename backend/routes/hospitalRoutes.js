// Hospital routes - only accessible by hospital staff

const express = require('express')
const router = express.Router()
const { registerBirth, registerDeath, getRecords, syncRecords } = require('../controllers/hospitalController')
const { protect } = require('../middleware/authMiddleware')

// All routes are protected
router.post('/register-birth', protect, registerBirth)
router.post('/register-death', protect, registerDeath)
router.get('/records', protect, getRecords)
router.post('/sync', protect, syncRecords)

module.exports = router