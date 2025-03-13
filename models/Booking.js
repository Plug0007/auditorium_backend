// backend/models/Booking.js
const { DataTypes } = require('sequelize');
const { bookingDB } = require('../db'); // Use bookingDB

const Booking = bookingDB.define('Booking', {
  facultyId: { type: DataTypes.INTEGER, allowNull: false },
  eventName: { type: DataTypes.STRING, allowNull: false },
  coordinator: { type: DataTypes.STRING, allowNull: false },
  coordinatorContact: { type: DataTypes.INTEGER, allowNull: true },
  eventType: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.STRING, allowNull: false },
  startTime: { type: DataTypes.STRING, allowNull: false },
  endTime: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM('Approved', 'Rejected', 'Pending'), allowNull: false, defaultValue: 'Approved' }
}, {
  timestamps: true
});

module.exports = Booking;
