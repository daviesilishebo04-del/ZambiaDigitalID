// This file directs login requests to the right controller

const express = require('express')
const router = express.Router()
const { login } = require('../controllers/authController')

// When someone sends a POST request to /api/auth/login
// it goes to the login function in authController
router.post('/login', login)

module.exports = router