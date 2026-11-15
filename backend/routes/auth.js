const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../utils/emailService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper to generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Email domain validation
const validateEmailDomain = (email) => {
  const allowedDomains = ['gmail.com', 'yahoo.com', 'bing.com'];
  const isBdEmail = email.toLowerCase().endsWith('.bd');
  const isAllowedDomain = allowedDomains.some(domain => 
    email.toLowerCase().includes(domain)
  );
  
  return isAllowedDomain || isBdEmail;
};

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').trim().isLength({ min: 10 }).withMessage('Please provide a valid phone number'),
  body('address').trim().isLength({ min: 5 }).withMessage('Please provide a valid address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, password, phone, address, userType } = req.body;
    const targetRole = userType || 'pension_holder';

    // Validate email domain
    if (!validateEmailDomain(email)) {
      return res.status(400).json({ 
        message: 'Only @gmail.com, @yahoo.com, @bing.com, and .bd emails are allowed' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // If Pension Holder: Require OTP verification sent to Gmail/email
    if (targetRole === 'pension_holder') {
      const otp = generateOtp();

      // Clear any prior pending registration OTPs for this email
      await Otp.deleteMany({ email, purpose: 'register' });

      // Save pending registration data with OTP (expires in 10 minutes)
      const otpEntry = new Otp({
        email,
        otp,
        purpose: 'register',
        registrationData: {
          name,
          email,
          password: hashedPassword,
          phone,
          address,
          userType: 'pension_holder'
        }
      });
      await otpEntry.save();

      // Dispatch OTP email
      await sendOtpEmail(email, otp, 'register', name);

      return res.status(200).json({
        requireOtp: true,
        email,
        message: 'নিবন্ধন সম্পন্ন করতে আপনার ইমেইলে একটি ৬-ডিজিটের ওটিপি ভেরিফিকেশন কোড পাঠানো হয়েছে।'
      });
    }

    // Direct registration fallback (if other roles ever register directly)
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      userType: targetRole
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        userType: user.userType 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Verify Registration OTP
router.post('/verify-registration-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, otp } = req.body;

    // Find the latest valid OTP entry for registration
    const otpRecord = await Otp.findOne({
      email: email.toLowerCase().trim(),
      otp: otp.trim(),
      purpose: 'register'
    }).sort({ createdAt: -1 });

    if (!otpRecord || !otpRecord.registrationData) {
      return res.status(400).json({
        message: 'ওটিপি কোডটি সঠিক নয় অথবা মেয়াদোত্তীর্ণ হয়ে গেছে। নতুন ওটিপি চেয়ে চেষ্টা করুন।'
      });
    }

    // Ensure user was not created in the interim
    const existingUser = await User.findOne({ email: otpRecord.email });
    if (existingUser) {
      await Otp.deleteMany({ email: otpRecord.email, purpose: 'register' });
      return res.status(400).json({ message: 'এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।' });
    }

    // Create verified user
    const reg = otpRecord.registrationData;
    const user = new User({
      name: reg.name,
      email: reg.email,
      password: reg.password, // already hashed
      phone: reg.phone,
      address: reg.address,
      userType: reg.userType || 'pension_holder'
    });

    await user.save();

    // Clean up OTP entries
    await Otp.deleteMany({ email: otpRecord.email, purpose: 'register' });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        userType: user.userType 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'ইমেইল ভেরিফিকেশন ও নিবন্ধন সফল হয়েছে!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Verify registration OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password, userType } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Account is disabled due to red flags. Please contact administrator.' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check user type for admin login
    if (userType === 'admin' && !['assistant_accountant', 'head_office'].includes(user.userType)) {
      return res.status(403).json({ message: 'Access denied for this user type' });
    }

    // ONLY FOR PENSION HOLDERS: Send 6-digit OTP to Gmail/email for login
    if (user.userType === 'pension_holder') {
      const otp = generateOtp();

      // Clear older login OTPs
      await Otp.deleteMany({ email: user.email, purpose: 'login' });

      // Save new login OTP (expires in 10 minutes)
      const otpEntry = new Otp({
        email: user.email,
        otp,
        purpose: 'login'
      });
      await otpEntry.save();

      // Dispatch OTP email
      await sendOtpEmail(user.email, otp, 'login', user.name);

      return res.json({
        requireOtp: true,
        email: user.email,
        message: 'লগইন সম্পন্ন করতে আপনার ইমেইলে একটি ৬-ডিজিটের ওটিপি ভেরিফিকেশন কোড পাঠানো হয়েছে।'
      });
    }

    // For other roles (assistant_accountant, head_office): login directly without OTP
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        userType: user.userType 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address,
        redFlags: user.redFlags,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify Login OTP (Exclusively for Pension Holders)
router.post('/verify-login-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, otp } = req.body;

    // Find the latest valid OTP entry for login
    const otpRecord = await Otp.findOne({
      email: email.toLowerCase().trim(),
      otp: otp.trim(),
      purpose: 'login'
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        message: 'ওটিপি কোডটি সঠিক নয় অথবা মেয়াদোত্তীর্ণ হয়ে গেছে। নতুন ওটিপি চেয়ে চেষ্টা করুন।'
      });
    }

    // Clean up OTP entries
    await Otp.deleteMany({ email: otpRecord.email, purpose: 'login' });

    // Find user
    const user = await User.findOne({ email: otpRecord.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        userType: user.userType 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'লগইন সফল হয়েছে!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address,
        redFlags: user.redFlags,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// Resend OTP (for both Login and Registration)
router.post('/resend-otp', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('purpose').isIn(['login', 'register']).withMessage('Purpose must be login or register')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, purpose } = req.body;
    const cleanEmail = email.toLowerCase().trim();
    const newOtp = generateOtp();

    if (purpose === 'register') {
      const existingOtp = await Otp.findOne({
        email: cleanEmail,
        purpose: 'register'
      }).sort({ createdAt: -1 });

      if (!existingOtp || !existingOtp.registrationData) {
        return res.status(400).json({
          message: 'কোনো পেন্ডিং নিবন্ধনের তথ্য পাওয়া যায়নি। অনুগ্রহ করে পুনরায় ফর্মটি পূরণ করুন।'
        });
      }

      // Update with new OTP and refreshed createdAt
      existingOtp.otp = newOtp;
      existingOtp.createdAt = new Date();
      await existingOtp.save();

      await sendOtpEmail(cleanEmail, newOtp, 'register', existingOtp.registrationData.name);

      return res.json({
        message: 'আপনার ইমেইলে নতুন ওটিপি কোড পাঠানো হয়েছে।'
      });
    } else {
      // Login OTP resend
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await Otp.deleteMany({ email: cleanEmail, purpose: 'login' });

      const otpEntry = new Otp({
        email: cleanEmail,
        otp: newOtp,
        purpose: 'login'
      });
      await otpEntry.save();

      await sendOtpEmail(cleanEmail, newOtp, 'login', user.name);

      return res.json({
        message: 'আপনার ইমেইলে নতুন ওটিপি কোড পাঠানো হয়েছে।'
      });
    }
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error resending OTP' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address,
        redFlags: user.redFlags,
        isActive: user.isActive,
        designation: user.designation,
        department: user.department,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('phone').optional().trim().isLength({ min: 10 }),
  body('address').optional().trim().isLength({ min: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, phone, address } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

module.exports = router;