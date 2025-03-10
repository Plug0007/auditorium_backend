// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const data = require('../data');

// ---------- Faculty Management ----------

// Create new faculty account
router.post('/faculty', (req, res) => {
    const { name, department, position, username, password } = req.body;
    // Check if username exists
    const exists = data.faculties.find(f => f.username === username);
    if (exists) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    const id = data.faculties.length + 1;
    const newFaculty = { id, name, department, position, username, password };
    data.faculties.push(newFaculty);
    res.json({ success: true, newFaculty });
});

// Get all faculty accounts
router.get('/faculty', (req, res) => {
    res.json({ success: true, faculties: data.faculties });
});

// Update a faculty account
router.put('/faculty/:id', (req, res) => {
    const facultyId = parseInt(req.params.id);
    const faculty = data.faculties.find(f => f.id === facultyId);
    if (faculty) {
        Object.assign(faculty, req.body);
        res.json({ success: true, faculty });
    } else {
        res.status(404).json({ success: false, message: 'Faculty not found' });
    }
});

// Delete a faculty account
router.delete('/faculty/:id', (req, res) => {
    const facultyId = parseInt(req.params.id);
    const index = data.faculties.findIndex(f => f.id === facultyId);
    if (index !== -1) {
        data.faculties.splice(index, 1);
        res.json({ success: true, message: 'Faculty deleted' });
    } else {
        res.status(404).json({ success: false, message: 'Faculty not found' });
    }
});

// ---------- Booking Management for Admin ----------

// Get all bookings
router.get('/bookings', (req, res) => {
    res.json({ success: true, bookings: data.bookings });
});

// Update booking status (approve or reject)
router.put('/booking/:id/status', (req, res) => {
    const bookingId = parseInt(req.params.id);
    const { status } = req.body; // Expected: "Approved" or "Rejected"
    const booking = data.bookings.find(b => b.id === bookingId);
    if (booking) {
        if (status !== "Approved" && status !== "Rejected") {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        booking.status = status;
        res.json({ success: true, booking });
    } else {
        res.status(404).json({ success: false, message: 'Booking not found' });
    }
});

module.exports = router;
