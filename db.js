// backend/db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

sequelize.authenticate()
  .then(() => console.log('PostgreSQL database connected'))
  .catch(err => console.error('Database connection error:', err));

module.exports = sequelize;
