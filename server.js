// backend/server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { facultyDB, bookingDB } = require('./db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const facultyRoutes = require('./routes/faculty');

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/faculty', facultyRoutes);

const PORT = process.env.PORT || 5000;

// Sync both databases before starting the server
Promise.all([
  facultyDB.sync({ alter: true }),
  bookingDB.sync({ alter: true })
])
  .then(() => {
    console.log('Models synchronized with both PostgreSQL databases.');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Error syncing models:', err));
