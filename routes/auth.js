// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login route: Check credentials for both admin and faculty
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find user by username and password (plaintext; hash in production)
    const user = await User.findOne({ where: { username, password } });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
