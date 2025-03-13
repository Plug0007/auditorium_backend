// backend/data.js
const { facultyDB, bookingDB } = require('./db');
const User = require('./models/User');
const Booking = require('./models/Booking');

async function seedData() {
  try {
    // Sync each database separately
    await facultyDB.sync({ alter: true });
    await bookingDB.sync({ alter: true });

    // Pre‑defined faculty user data (admin and faculty)
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'faculty1',
        email: 'faculty1@example.com',
        password: 'faculty123',
        role: 'faculty'
      }
    ];

    for (const userData of users) {
      await User.findOrCreate({
        where: { username: userData.username },
        defaults: userData
      });
    }

    // Optionally seed booking data if needed.
    console.log('Databases seeded successfully.');
  } catch (err) {
    console.error('Error seeding databases:', err);
  } finally {
    process.exit();
  }
}

seedData();
