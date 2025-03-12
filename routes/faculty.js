const express = require('express');
const router = express.Router();
const data = require('../data');

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
router.post('/booking', (req, res) => {
  const { 
    facultyId, 
    eventName, 
    coordinator, 
    coordinatorContact,  // <-- NEW
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

  // Check for overlapping booking on same date (ignoring Rejected bookings)
  const conflict = data.bookings.find(b => {
    if (b.date === date && b.status !== 'Rejected') {
      const existingStart = timeToMinutes(b.startTime);
      const existingEnd = timeToMinutes(b.endTime);
      return isTimeOverlap(newStart, newEnd, existingStart, existingEnd);
    }
    return false;
  });

  if (conflict) {
    return res.status(400).json({ 
      success: false, 
      message: 'Booking conflict: The selected time slot is already taken.' 
    });
  }

  const id = data.bookings.length + 1;
  const newBooking = {
    id,
    facultyId,
    eventName,
    coordinator,
    coordinatorContact, // NEW field in booking
    eventType,
    date,
    startTime,
    endTime,
    description,
    status: 'Approved' // Auto-approved on creation
  };
  data.bookings.push(newBooking);
  res.json({ success: true, newBooking });
});

// Get bookings for a specific faculty (via query parameter)
router.get('/bookings', (req, res) => {
  const facultyId = parseInt(req.query.facultyId);
  if (!facultyId) {
    return res.status(400).json({ success: false, message: 'facultyId query parameter required' });
  }
  const facultyBookings = data.bookings.filter(b => b.facultyId === facultyId);
  res.json({ success: true, bookings: facultyBookings });
});

// Update a booking (allowed if not Rejected)
router.put('/booking/:id', (req, res) => {
  const bookingId = parseInt(req.params.id);
  const booking = data.bookings.find(b => b.id === bookingId);
  if (booking) {
    // Disallow updates if the booking is Rejected
    if (booking.status === 'Rejected') {
      return res.status(400).json({ success: false, message: 'Rejected bookings cannot be updated' });
    }
    // If updating time/date, check for conflict
    const { date, startTime, endTime } = req.body;
    if (date && startTime && endTime) {
      const newStart = timeToMinutes(startTime);
      const newEnd = timeToMinutes(endTime);
      const conflict = data.bookings.find(b => {
        if (b.id !== bookingId && b.date === date && b.status !== 'Rejected') {
          const existingStart = timeToMinutes(b.startTime);
          const existingEnd = timeToMinutes(b.endTime);
          return isTimeOverlap(newStart, newEnd, existingStart, existingEnd);
        }
        return false;
      });
      if (conflict) {
        return res.status(400).json({ 
          success: false, 
          message: 'Booking conflict: The selected time slot is already taken.' 
        });
      }
    }
    Object.assign(booking, req.body);
    res.json({ success: true, booking });
  } else {
    res.status(404).json({ success: false, message: 'Booking not found' });
  }
});

module.exports = router;
