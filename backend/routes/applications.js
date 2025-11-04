const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
    }
  }
});

// Submit Pension Application
router.post('/', authenticateToken, upload.fields([
  { name: 'nidFile', maxCount: 1 },
  { name: 'jobDocuments', maxCount: 1 }
]), [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
  body('fatherName').trim().isLength({ min: 2, max: 100 }).withMessage('Father name must be between 2 and 100 characters'),
  body('motherName').trim().isLength({ min: 2, max: 100 }).withMessage('Mother name must be between 2 and 100 characters'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('nidNumber').trim().isLength({ min: 10, max: 20 }).withMessage('Valid NID number is required'),
  body('phoneNumber').trim().isLength({ min: 10 }).withMessage('Valid phone number is required'),
  body('address').trim().isLength({ min: 5 }).withMessage('Address is required'),
  body('lastDesignation').trim().isLength({ min: 2 }).withMessage('Last designation is required'),
  body('department').trim().isLength({ min: 2 }).withMessage('Department is required'),
  body('joiningDate').isISO8601().withMessage('Valid joining date is required'),
  body('retirementDate').isISO8601().withMessage('Valid retirement date is required'),
  body('lastSalary').isNumeric().withMessage('Valid last salary is required'),
  body('bankName').trim().isLength({ min: 2 }).withMessage('Bank name is required'),
  body('accountNumber').trim().isLength({ min: 5 }).withMessage('Account number is required'),
  body('branchName').trim().isLength({ min: 2 }).withMessage('Branch name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const applicationData = req.body;
    
    // Add file paths if files were uploaded
    if (req.files) {
      if (req.files.nidFile) {
        applicationData.nidFile = req.files.nidFile[0].path;
      }
      if (req.files.jobDocuments) {
        applicationData.jobDocuments = req.files.jobDocuments[0].path;
      }
    }

    // Validate dates
    const dateOfBirth = new Date(applicationData.dateOfBirth);
    const joiningDate = new Date(applicationData.joiningDate);
    const retirementDate = new Date(applicationData.retirementDate);
    const today = new Date();

    // Validate date order: dateOfBirth < joiningDate < retirementDate
    if (joiningDate <= dateOfBirth) {
      return res.status(400).json({ 
        message: 'Joining date must be after date of birth' 
      });
    }

    if (retirementDate <= joiningDate) {
      return res.status(400).json({ 
        message: 'Retirement date must be after joining date' 
      });
    }

    // Calculate job age (accurate calculation considering months and days)
    let jobAge = retirementDate.getFullYear() - joiningDate.getFullYear();
    const monthDiff = retirementDate.getMonth() - joiningDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && retirementDate.getDate() < joiningDate.getDate())) {
      jobAge--;
    }
    
    if (jobAge < 19) {
      return res.status(400).json({ message: 'Minimum job age requirement is 19 years' });
    }

    // Calculate age (accurate calculation considering months and days)
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const ageMonthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (ageMonthDiff < 0 || (ageMonthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    // Calculate pension amount (50% of last salary)
    const pensionAmount = Math.floor(parseFloat(applicationData.lastSalary) * 0.5);

    const application = new Application({
      ...applicationData,
      userId: req.user.userId,
      jobAge,
      age,
      pensionAmount,
      history: [{
        status: 'pending',
        timestamp: new Date(),
        message: 'Application submitted successfully'
      }]
    });

    await application.save();

    // Create notification for user
    const notification = new Notification({
      userId: req.user.userId,
      type: 'application_submitted',
      title: 'Application Submitted',
      message: `Your pension application #${application.applicationNumber} has been submitted successfully`,
      applicationId: application._id
    });
    await notification.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Server error submitting application' });
  }
});

// Get Applications
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // Filter by user type
    if (req.user.userType === 'pension_holder') {
      query.userId = req.user.userId;
    }

    const applications = await Application.find(query)
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Fetch applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

// Get Single Application
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('userId', 'name email')
      .populate('history.updatedBy', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check permissions
    if (req.user.userType === 'pension_holder' && application.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    console.error('Fetch application error:', error);
    res.status(500).json({ message: 'Server error fetching application' });
  }
});

// Update Application Status
router.put('/:id/status', authenticateToken, authorizeRoles('assistant_accountant', 'head_office'), [
  body('status').isIn(['pending', 'forwarded', 'approved', 'rejected']).withMessage('Invalid status'),
  body('feedback').optional().trim().isLength({ min: 5 }).withMessage('Feedback must be at least 5 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { status, feedback } = req.body;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check permissions based on current status and user type
    if (req.user.userType === 'assistant_accountant') {
      if (application.status !== 'pending') {
        return res.status(403).json({ message: 'Can only update pending applications' });
      }
      if (!['forwarded', 'rejected'].includes(status)) {
        return res.status(403).json({ message: 'Assistant Accountant can only forward or reject applications' });
      }
    }

    if (req.user.userType === 'head_office') {
      if (application.status !== 'forwarded') {
        return res.status(403).json({ message: 'Can only update forwarded applications' });
      }
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(403).json({ message: 'Head Office can only approve or reject applications' });
      }
    }

    // Update application
    application.status = status;
    application.history.push({
      status,
      timestamp: new Date(),
      message: feedback || `Application ${status}`,
      feedback,
      updatedBy: req.user.userId
    });

    // Set approval/rejection dates
    if (status === 'approved') {
      application.approvedAt = new Date();
    } else if (status === 'rejected') {
      application.rejectedAt = new Date();
    }

    await application.save();

    // Create notification for applicant
    const notification = new Notification({
      userId: application.userId,
      type: 'status_updated',
      title: 'Application Status Updated',
      message: `Your application #${application.applicationNumber} status has been updated to: ${status}`,
      applicationId: application._id,
      priority: status === 'approved' ? 'high' : 'medium'
    });
    await notification.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error updating application status' });
  }
});

module.exports = router;