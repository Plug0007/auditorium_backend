// backend/routes/faculty.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Route to create a new booking
router.post('/booking', async (req, res) => {
  // Destructure booking details from the request body
  const { facultyId, eventName, coordinator, eventType, date, startTime, endTime, description } = req.body;
  try {
    // Create a new booking instance using the Booking model
    const newBooking = new Booking({
      facultyId,
      eventName,
      coordinator,
      eventType,
      date,
      startTime,
      endTime,
      description
    });
    // Save the new booking to the database
    await newBooking.save();
    // Respond with success and the newly created booking object
    res.json({ success: true, newBooking });
  } catch (err) {
    // If an error occurs, respond with a 500 status and error message
    res.status(500).json({ success: false, message: err.message });
  }
});

// Route to get bookings for a specific faculty member
router.get('/bookings', async (req, res) => {
  // Extract facultyId from the query parameters
  const { facultyId } = req.query;
  try {
    // Find bookings that match the given facultyId
    const bookings = await Booking.find({ facultyId });
    // Respond with success and the list of bookings
    res.json({ success: true, bookings });
  } catch (err) {
    // If an error occurs, respond with a 500 status and error message
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
