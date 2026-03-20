// This is the security guard that checks if you're logged in
// before allowing access to protected pages

const jwt = require('jsonwebtoken')

const protect = (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.headers.authorization?.split(' ')[1]

    // If no token found
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    // Verify the token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to the request
    req.user = decoded

    // Allow the request to continue
    next()

  } catch (error) {
    res.status(401).json({ message: 'Not authorized, invalid token' })
  }
}

module.exports = { protect }