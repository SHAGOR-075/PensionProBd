const express = require('express');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Submit Complaint
router.post('/', authenticateToken, [
  body('officerId').notEmpty().withMessage('Officer ID is required'),
  body('officerName').trim().isLength({ min: 2 }).withMessage('Officer name is required'),
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').optional().isIn(['delay', 'misconduct', 'corruption', 'poor_service', 'other']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { officerId, officerName, subject, description, category } = req.body;

    // Verify officer exists
    const officer = await User.findById(officerId);
    if (!officer || officer.userType === 'pension_holder') {
      return res.status(400).json({ message: 'Invalid officer selected' });
    }

    const complaint = new Complaint({
      userId: req.user.userId,
      officerId,
      officerName,
      subject,
      description,
      category: category || 'other'
    });

    await complaint.save();

    // Create notification for user
    const notification = new Notification({
      userId: req.user.userId,
      type: 'complaint_submitted',
      title: 'Complaint Submitted',
      message: `Your complaint "${subject}" has been submitted successfully`,
      complaintId: complaint._id
    });
    await notification.save();

    // Create notification for head office
    const headOfficeUsers = await User.find({ userType: 'head_office', isActive: true });
    for (const headUser of headOfficeUsers) {
      const headNotification = new Notification({
        userId: headUser._id,
        type: 'complaint_submitted',
        title: 'New Complaint Received',
        message: `New complaint against ${officerName}: ${subject}`,
        complaintId: complaint._id,
        priority: 'high'
      });
      await headNotification.save();
    }

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });
  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ message: 'Server error submitting complaint' });
  }
});

// Get Complaints
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {};
    
    // Filter by user type
    if (req.user.userType === 'pension_holder') {
      query.userId = req.user.userId;
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email')
      .populate('officerId', 'name email designation department')
      .sort({ submittedAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Fetch complaints error:', error);
    res.status(500).json({ message: 'Server error fetching complaints' });
  }
});

// Get Single Complaint
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findById(id)
      .populate('userId', 'name email')
      .populate('officerId', 'name email designation department')
      .populate('resolvedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check permissions
    if (req.user.userType === 'pension_holder' && complaint.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Fetch complaint error:', error);
    res.status(500).json({ message: 'Server error fetching complaint' });
  }
});

// Issue Red Flag
router.post('/:id/red-flag', authenticateToken, authorizeRoles('head_office'), async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.redFlagIssued) {
      return res.status(400).json({ message: 'Red flag already issued for this complaint' });
    }

    // Update complaint
    complaint.redFlagIssued = true;
    complaint.status = 'resolved';
    complaint.resolvedAt = new Date();
    complaint.resolvedBy = req.user.userId;
    complaint.resolution = resolution || 'Red flag issued due to valid complaint';
    await complaint.save();

    // Update officer red flags
    const officer = await User.findById(complaint.officerId);
    if (officer) {
      officer.redFlags = (officer.redFlags || 0) + 1;
      
      // Disable account if 3 red flags
      if (officer.redFlags >= 3) {
        officer.isActive = false;
      }
      
      await officer.save();

      // Create notification for officer
      const notification = new Notification({
        userId: officer._id,
        type: 'red_flag_issued',
        title: 'Red Flag Warning Issued',
        message: `Red flag issued for complaint: ${complaint.subject}. Total red flags: ${officer.redFlags}/3`,
        complaintId: complaint._id,
        priority: officer.redFlags >= 3 ? 'high' : 'medium'
      });
      await notification.save();

      // If account disabled, create additional notification
      if (officer.redFlags >= 3) {
        const disableNotification = new Notification({
          userId: officer._id,
          type: 'account_disabled',
          title: 'Account Disabled',
          message: 'Your account has been disabled due to 3 red flag warnings. Please contact administration.',
          priority: 'high'
        });
        await disableNotification.save();
      }
    }

    // Create notification for complainant
    const complainantNotification = new Notification({
      userId: complaint.userId,
      type: 'complaint_submitted',
      title: 'Complaint Resolved',
      message: `Your complaint "${complaint.subject}" has been resolved with a red flag issued`,
      complaintId: complaint._id
    });
    await complainantNotification.save();

    res.json({
      message: 'Red flag issued successfully',
      complaint,
      officer: {
        redFlags: officer?.redFlags,
        isActive: officer?.isActive
      }
    });
  } catch (error) {
    console.error('Issue red flag error:', error);
    res.status(500).json({ message: 'Server error issuing red flag' });
  }
});

// Update Complaint Status
router.put('/:id/status', authenticateToken, authorizeRoles('head_office'), [
  body('status').isIn(['pending', 'investigating', 'resolved', 'dismissed']).withMessage('Invalid status'),
  body('resolution').optional().trim().isLength({ min: 5 }).withMessage('Resolution must be at least 5 characters')
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
    const { status, resolution } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    if (resolution) {
      complaint.resolution = resolution;
    }

    if (status === 'resolved' || status === 'dismissed') {
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = req.user.userId;
    }

    await complaint.save();

    // Create notification for complainant
    const notification = new Notification({
      userId: complaint.userId,
      type: 'complaint_submitted',
      title: 'Complaint Status Updated',
      message: `Your complaint status has been updated to: ${status}`,
      complaintId: complaint._id
    });
    await notification.save();

    res.json({
      message: 'Complaint status updated successfully',
      complaint
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error updating complaint status' });
  }
});

module.exports = router;