const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true,
    trim: true
  },
  purpose: {
    type: String,
    enum: ['login', 'register'],
    required: true
  },
  registrationData: {
    type: Object,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // Automatically deleted by MongoDB after 10 minutes (600 seconds)
  }
});

module.exports = mongoose.model('Otp', otpSchema);

