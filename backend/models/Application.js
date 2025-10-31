const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  applicationNumber: {
    type: String,
    unique: true
  },
  fullName: { 
    type: String, 
    required: true,
    trim: true
  },
  fatherName: { 
    type: String, 
    required: true,
    trim: true
  },
  motherName: { 
    type: String, 
    required: true,
    trim: true
  },
  dateOfBirth: { 
    type: Date, 
    required: true 
  },
  nidNumber: { 
    type: String, 
    required: true,
    unique: true
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  lastDesignation: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  joiningDate: { 
    type: Date, 
    required: true 
  },
  retirementDate: { 
    type: Date, 
    required: true 
  },
  lastSalary: { 
    type: Number, 
    required: true,
    min: 0
  },
  jobAge: { 
    type: Number, 
    required: true,
    min: 19
  },
  age: { 
    type: Number, 
    required: true 
  },
  pensionAmount: { 
    type: Number, 
    required: true,
    min: 0
  },
  bankName: { 
    type: String, 
    required: true 
  },
  accountNumber: { 
    type: String, 
    required: true 
  },
  branchName: { 
    type: String, 
    required: true 
  },
  nidFile: { 
    type: String 
  },
  jobDocuments: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['pending', 'forwarded', 'approved', 'rejected'], 
    default: 'pending' 
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  history: [{
    status: {
      type: String,
      required: true
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
    message: {
      type: String,
      required: true
    },
    feedback: String,
    updatedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }
  }],
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  approvedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  certificateGenerated: {
    type: Boolean,
    default: false
  },
  certificatePath: {
    type: String
  }
});

// Generate application number before saving
applicationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Application').countDocuments();
    this.applicationNumber = `APP${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for better query performance
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ applicationNumber: 1 });
applicationSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);