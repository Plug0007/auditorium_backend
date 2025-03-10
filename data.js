// backend/data.js
module.exports = {
  // Pre‑defined admin and faculty login data
  users: [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'faculty1', password: 'faculty123', role: 'faculty' }
  ],
  // Faculty accounts (admin‑created)
  faculties: [
    { id: 1, name: 'John Doe', department: 'BSc CS', position: 'Teacher', username: 'faculty1', password: 'faculty123' }
  ],
  // Booking requests (created by faculty)
  bookings: []
};
