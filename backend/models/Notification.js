const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: [
      'application_submitted', 
      'status_updated', 
      'complaint_submitted', 
      'red_flag_issued',
      'account_disabled',
      'account_activated',
      'account_deactivated',
      'document_required',
      'payment_processed',
      'system_maintenance'
    ],
    required: true 
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: { 
    type: String, 
    required: true,
    trim: true
  },
  applicationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Application' 
  },
  complaintId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Complaint' 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String
  },
  expiresAt: {
    type: Date
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for better query performance
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ timestamp: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Notification', notificationSchema);