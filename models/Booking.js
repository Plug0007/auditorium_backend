// backend/models/Booking.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Booking = sequelize.define('Booking', {
  facultyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordinator: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordinatorContact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING, // Alternatively, use DataTypes.DATE if desired
    allowNull: false,
  },
  startTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Approved', 'Rejected', 'Pending'),
    allowNull: false,
    defaultValue: 'Approved'
  }
}, {
  timestamps: true
});

module.exports = Booking;
