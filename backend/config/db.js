// backend/config/db.js
const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const db = mongoose.connection;
    db.on('error', (err) => logger.error({ message: 'MongoDB connection error', error: err.message }));
    db.once('open', () => {
      logger.info({ message: 'MongoDB connected', host: db.host });
    });

    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    logger.error({ message: 'Initial MongoDB connection failed', error: error.message });
    process.exit(1);
  }
};

module.exports = connectDB;
