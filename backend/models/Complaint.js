const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaintNumber: {
    type: String,
    unique: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  officerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  officerName: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['delay', 'misconduct', 'corruption', 'poor_service', 'other'],
    default: 'other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['pending', 'investigating', 'resolved', 'dismissed'], 
    default: 'pending' 
  },
  redFlagIssued: { 
    type: Boolean, 
    default: false 
  },
  evidence: [{
    filename: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    type: String,
    trim: true
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  resolvedAt: { 
    type: Date 
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Generate complaint number before saving
complaintSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Complaint').countDocuments();
    this.complaintNumber = `CMP${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for better query performance
complaintSchema.index({ userId: 1, status: 1 });
complaintSchema.index({ officerId: 1 });
complaintSchema.index({ complaintNumber: 1 });
complaintSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);