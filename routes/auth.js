// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const data = require('../data');

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // First check in admin users
    let user = data.users.find(u => u.username === username && u.password === password);
    if (!user) {
      // Also check in faculty accounts
      user = data.faculties.find(u => u.username === username && u.password === password);
      if(user) {
          user.role = 'faculty'; // Ensure role is set
      }
    }
    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

module.exports = router;
