const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  phone: { 
    type: String, 
    required: true,
    trim: true
  },
  address: { 
    type: String, 
    required: true,
    trim: true
  },
  userType: { 
    type: String, 
    enum: ['pension_holder', 'assistant_accountant', 'head_office'], 
    default: 'pension_holder' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  redFlags: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 3
  },
  designation: { 
    type: String,
    trim: true
  },
  department: { 
    type: String,
    trim: true
  },
  lastLogin: {
    type: Date
  },
  profileImage: {
    type: String
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ userType: 1, isActive: 1 });

module.exports = mongoose.model('User', userSchema);