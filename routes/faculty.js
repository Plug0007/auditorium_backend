// backend/routes/faculty.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Booking = require('../models/Booking');

// Helper: Convert "HH:MM" string to minutes since midnight
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// Helper: Check if two time intervals overlap
function isTimeOverlap(start1, end1, start2, end2) {
  return Math.max(start1, start2) < Math.min(end1, end2);
}

// Create a new booking request (auto-approved)
router.post('/booking', async (req, res) => {
  try {
    const { 
      facultyId, 
      eventName, 
      coordinator, 
      coordinatorContact,  // NEW
      eventType, 
      date, 
      startTime, 
      endTime, 
      description 
    } = req.body;
    
    if (!facultyId || !eventName || !coordinator || !eventType || !date || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    // Check for overlapping booking on the same date (ignoring Rejected bookings)
    const conflicts = await Booking.findAll({
      where: {
        date,
        status: { [Op.ne]: 'Rejected' }
      }
    });

    const conflict = conflicts.find(b => {
      const existingStart = timeToMinutes(b.startTime);
      const existingEnd = timeToMinutes(b.endTime);
      return isTimeOverlap(newStart, newEnd, existingStart, existingEnd);
    });

    if (conflict) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking conflict: The selected time slot is already taken.' 
      });
    }

    const newBooking = await Booking.create({
      facultyId,
      eventName,
      coordinator,
      coordinatorContact,
      eventType,
      date,
      startTime,
      endTime,
      description,
      status: 'Approved' // Auto-approved on creation
    });

    res.json({ success: true, newBooking });
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get bookings for a specific faculty (via query parameter)
router.get('/bookings', async (req, res) => {
  try {
    const facultyId = parseInt(req.query.facultyId);
    if (!facultyId) {
      return res.status(400).json({ success: false, message: 'facultyId query parameter required' });
    }
    const bookings = await Booking.findAll({ where: { facultyId } });
    res.json({ success: true, bookings });
  } catch (err) {
    console.error('Error fetching faculty bookings:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update a booking (allowed if not Rejected)
router.put('/booking/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.status === 'Rejected') {
      return res.status(400).json({ success: false, message: 'Rejected bookings cannot be updated' });
    }
    // If updating time/date, check for conflict
    const { date, startTime, endTime } = req.body;
    if (date && startTime && endTime) {
      const newStart = timeToMinutes(startTime);
      const newEnd = timeToMinutes(endTime);
      
      const conflicts = await Booking.findAll({
        where: {
          id: { [Op.ne]: bookingId },
          date,
          status: { [Op.ne]: 'Rejected' }
        }
      });

      const conflict = conflicts.find(b => {
        const existingStart = timeToMinutes(b.startTime);
        const existingEnd = timeToMinutes(b.endTime);
        return isTimeOverlap(newStart, newEnd, existingStart, existingEnd);
      });

      if (conflict) {
        return res.status(400).json({ 
          success: false, 
          message: 'Booking conflict: The selected time slot is already taken.' 
        });
      }
    }

    await booking.update(req.body);
    res.json({ success: true, booking });
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
