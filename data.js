// backend/data.js
// This file is now used to seed initial data into the SQLite database using Sequelize.
// Run this file with: node data.js

const sequelize = require('./db');
const User = require('./models/User');

// If you decide to create additional models for faculties and bookings, import them here.
// Example:
// const Faculty = require('./models/Faculty');
// const Booking = require('./models/Booking');

async function seedData() {
  try {
    // Sync models: this will create the tables if they do not already exist.
    await sequelize.sync({ alter: true });

    // Pre‑defined user data (admin and faculty)
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com', // Added email field since our User model requires it.
        password: 'admin123',       // Remember: in production, hash passwords!
        role: 'admin'
      },
      {
        username: 'faculty1',
        email: 'faculty1@example.com',
        password: 'faculty123',
        role: 'faculty'
      }
    ];

    // Insert or find existing users to prevent duplicates
    for (const userData of users) {
      await User.findOrCreate({
        where: { username: userData.username },
        defaults: userData
      });
    }

    // If you have Faculty or Booking models, add your seeding logic here.
    // For example, to seed a faculty record:
    // await Faculty.findOrCreate({ where: { username: 'faculty1' }, defaults: { name: 'John Doe', department: 'BSc CS', position: 'Teacher', ... } });

    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    process.exit();
  }
}

seedData();
