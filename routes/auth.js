// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login route: Check credentials for both admin and faculty
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Note: In production, you should store and compare hashed passwords.
    const user = await User.findOne({ where: { username, password } });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    res.json({ success: true, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
