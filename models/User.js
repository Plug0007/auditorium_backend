// backend/models/User.js
const { DataTypes } = require('sequelize');
const { facultyDB } = require('../db');  // Use facultyDB

const User = facultyDB.define('User', {
  name: { type: DataTypes.STRING, allowNull: true },
  department: { type: DataTypes.STRING, allowNull: true },
  position: { type: DataTypes.STRING, allowNull: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'faculty'), allowNull: false, defaultValue: 'faculty' }
}, {
  timestamps: true
});

module.exports = User;
