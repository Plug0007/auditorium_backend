// backend/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Connection for Faculty (User) data
const facultyDB = new Sequelize(process.env.DATABASE_FACULTY_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Connection for Booking data
const bookingDB = new Sequelize(process.env.DATABASE_BOOKING_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Authenticate both connections
facultyDB.authenticate()
  .then(() => console.log('Faculty database connected'))
  .catch(err => console.error('Faculty DB connection error:', err));

bookingDB.authenticate()
  .then(() => console.log('Booking database connected'))
  .catch(err => console.error('Booking DB connection error:', err));

module.exports = { facultyDB, bookingDB };
