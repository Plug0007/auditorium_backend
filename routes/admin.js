// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const User = require('../models/User');
const Booking = require('../models/Booking');

// ---------- Faculty Management ----------

// Create new faculty account
router.post('/faculty', async (req, res) => {
  try {
    const { name, department, position, username, password } = req.body;
    
    // Check if username exists
    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    
    // Create a new faculty user.
    const newFaculty = await User.create({
      name,
      department,
      position,
      username,
      email: `${username}@example.com`,
      password,
      role: 'faculty'
    });
    
    res.json({ success: true, newFaculty });
  } catch (err) {
    console.error('Error creating faculty:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all faculty accounts
router.get('/faculty', async (req, res) => {
  try {
    const faculties = await User.findAll({ where: { role: 'faculty' } });
    res.json({ success: true, faculties });
  } catch (err) {
    console.error('Error fetching faculties:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a faculty account
router.put('/faculty/:id', async (req, res) => {
  try {
    const facultyId = req.params.id;
    const [updated] = await User.update(req.body, { where: { id: facultyId, role: 'faculty' } });
    if (updated) {
      const updatedFaculty = await User.findByPk(facultyId);
      res.json({ success: true, faculty: updatedFaculty });
    } else {
      res.status(404).json({ success: false, message: 'Faculty not found' });
    }
  } catch (err) {
    console.error('Error updating faculty:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a faculty account
router.delete('/faculty/:id', async (req, res) => {
  try {
    const facultyId = req.params.id;
    const deleted = await User.destroy({ where: { id: facultyId, role: 'faculty' } });
    if (deleted) {
      res.json({ success: true, message: 'Faculty deleted' });
    } else {
      res.status(404).json({ success: false, message: 'Faculty not found' });
    }
  } catch (err) {
    console.error('Error deleting faculty:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// ---------- Booking Management for Admin ----------

// Get bookings with optional filtering by status, date, and startTime
router.get('/bookings', async (req, res) => {
  try {
    const { status, date, startTime } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (date) filter.date = date;
    if (startTime) filter.startTime = startTime;
    const bookings = await Booking.findAll({ where: filter });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update booking status (approve or reject)
router.put('/booking/:id/status', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body; // Expected: "Approved" or "Rejected"
    if (status !== "Approved" && status !== "Rejected") {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const booking = await Booking.findByPk(bookingId);
    if (booking) {
      booking.status = status;
      await booking.save();
      res.json({ success: true, booking });
    } else {
      res.status(404).json({ success: false, message: 'Booking not found' });
    }
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
