// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// // Create uploads directory if it doesn't exist
// if (!fs.existsSync('uploads')) {
//   fs.mkdirSync('uploads');
// }

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://fackid1971:pensionBd123@cluster0.0pa448c.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // File upload configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|pdf/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
//     }
//   }
// });

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   userType: { 
//     type: String, 
//     enum: ['pension_holder', 'assistant_accountant', 'head_office'], 
//     default: 'pension_holder' 
//   },
//   isActive: { type: Boolean, default: true },
//   redFlags: { type: Number, default: 0 },
//   designation: { type: String },
//   department: { type: String },
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);

// // Application Schema
// const applicationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   applicationNumber: { type: String, unique: true },
//   fullName: { type: String, required: true },
//   fatherName: { type: String, required: true },
//   motherName: { type: String, required: true },
//   dateOfBirth: { type: Date, required: true },
//   nidNumber: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   address: { type: String, required: true },
//   lastDesignation: { type: String, required: true },
//   department: { type: String, required: true },
//   joiningDate: { type: Date, required: true },
//   retirementDate: { type: Date, required: true },
//   lastSalary: { type: Number, required: true },
//   jobAge: { type: Number, required: true },
//   age: { type: Number, required: true },
//   pensionAmount: { type: Number, required: true },
//   bankName: { type: String, required: true },
//   accountNumber: { type: String, required: true },
//   branchName: { type: String, required: true },
//   nidFile: { type: String },
//   jobDocuments: { type: String },
//   status: { 
//     type: String, 
//     enum: ['pending', 'forwarded', 'approved', 'rejected'], 
//     default: 'pending' 
//   },
//   history: [{
//     status: String,
//     timestamp: { type: Date, default: Date.now },
//     message: String,
//     feedback: String,
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
//   }],
//   submittedAt: { type: Date, default: Date.now }
// });

// // Generate application number before saving
// applicationSchema.pre('save', async function(next) {
//   if (this.isNew) {
//     const count = await mongoose.model('Application').countDocuments();
//     this.applicationNumber = `APP${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
//   }
//   next();
// });

// const Application = mongoose.model('Application', applicationSchema);

// // Complaint Schema
// const complaintSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   officerName: { type: String, required: true },
//   subject: { type: String, required: true },
//   description: { type: String, required: true },
//   category: {
//     type: String,
//     enum: ['delay', 'misconduct', 'corruption', 'poor_service', 'other'],
//     default: 'other'
//   },
//   status: { 
//     type: String, 
//     enum: ['pending', 'resolved', 'dismissed'], 
//     default: 'pending' 
//   },
//   redFlagIssued: { type: Boolean, default: false },
//   submittedAt: { type: Date, default: Date.now },
//   resolvedAt: { type: Date }
// });

// const Complaint = mongoose.model('Complaint', complaintSchema);

// // Notification Schema
// const notificationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   type: { 
//     type: String, 
//     enum: ['application_submitted', 'status_updated', 'complaint_submitted', 'red_flag_issued'],
//     required: true 
//   },
//   title: { type: String, required: true },
//   message: { type: String, required: true },
//   applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
//   complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
//   read: { type: Boolean, default: false },
//   timestamp: { type: Date, default: Date.now }
// });

// const Notification = mongoose.model('Notification', notificationSchema);

// // Middleware to verify JWT token
// const authenticateToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Access token required' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
//     // Check if user still exists and is active
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(403).json({ message: 'User not found' });
//     }
    
//     if (!user.isActive) {
//       return res.status(403).json({ message: 'User account is inactive' });
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid token' });
//   }
// };

// // Email domain validation
// const validateEmailDomain = (email) => {
//   const allowedDomains = ['gmail.com', 'yahoo.com', 'bing.com'];
//   const isBdEmail = email.toLowerCase().endsWith('.bd');
//   const isAllowedDomain = allowedDomains.some(domain => 
//     email.toLowerCase().includes(domain)
//   );
  
//   return isAllowedDomain || isBdEmail;
// };

// // Routes

// // User Registration
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { name, email, password, phone, address, userType } = req.body;

//     // Validate email domain
//     if (!validateEmailDomain(email)) {
//       return res.status(400).json({ 
//         message: 'Only @gmail.com, @yahoo.com, @bing.com, and .bd emails are allowed' 
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       address,
//       userType: userType || 'pension_holder'
//     });

//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, userType: user.userType },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '24h' }
//     );

//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         userType: user.userType,
//         phone: user.phone,
//         address: user.address
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // User Login - FIXED ADMIN LOGIN LOGIC
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password, userType } = req.body;

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check if account is active
//     if (!user.isActive) {
//       return res.status(403).json({ message: 'Account is disabled due to red flags' });
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // FIXED: Check user type for admin login - allow both assistant_accountant and head_office
//     if (userType === 'admin') {
//       if (!['assistant_accountant', 'head_office'].includes(user.userType)) {
//         return res.status(403).json({ 
//           message: 'Access denied. This account is not authorized for admin access.' 
//         });
//       }
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, userType: user.userType },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '24h' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         userType: user.userType,
//         phone: user.phone,
//         address: user.address,
//         redFlags: user.redFlags,
//         designation: user.designation,
//         department: user.department
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get current user profile
// app.get('/api/auth/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         userType: user.userType,
//         phone: user.phone,
//         address: user.address,
//         redFlags: user.redFlags,
//         isActive: user.isActive,
//         designation: user.designation,
//         department: user.department,
//         createdAt: user.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ message: 'Server error fetching profile' });
//   }
// });

// // Submit Pension Application
// app.post('/api/applications', authenticateToken, upload.fields([
//   { name: 'nidFile', maxCount: 1 },
//   { name: 'jobDocuments', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     const applicationData = req.body;
    
//     // Add file paths if files were uploaded
//     if (req.files) {
//       if (req.files.nidFile) {
//         applicationData.nidFile = req.files.nidFile[0].path;
//       }
//       if (req.files.jobDocuments) {
//         applicationData.jobDocuments = req.files.jobDocuments[0].path;
//       }
//     }

//     // Validate job age requirement
//     if (parseInt(applicationData.jobAge) < 19) {
//       return res.status(400).json({ message: 'Minimum job age requirement is 19 years' });
//     }

//     const application = new Application({
//       ...applicationData,
//       userId: req.user.userId,
//       history: [{
//         status: 'pending',
//         timestamp: new Date(),
//         message: 'Application submitted successfully'
//       }]
//     });

//     await application.save();

//     // Create notification
//     const notification = new Notification({
//       userId: req.user.userId,
//       type: 'application_submitted',
//       title: 'Application Submitted',
//       message: 'Your pension application has been submitted successfully',
//       applicationId: application._id
//     });
//     await notification.save();

//     res.status(201).json({
//       message: 'Application submitted successfully',
//       application
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get Applications
// app.get('/api/applications', authenticateToken, async (req, res) => {
//   try {
//     let query = {};
    
//     // Filter by user type
//     if (req.user.userType === 'pension_holder') {
//       query.userId = req.user.userId;
//     }

//     const applications = await Application.find(query)
//       .populate('userId', 'name email')
//       .sort({ submittedAt: -1 });

//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Update Application Status
// app.put('/api/applications/:id/status', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, feedback } = req.body;

//     // Check permissions
//     if (!['assistant_accountant', 'head_office'].includes(req.user.userType)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const application = await Application.findById(id);
//     if (!application) {
//       return res.status(404).json({ message: 'Application not found' });
//     }

//     // Update application
//     application.status = status;
//     application.history.push({
//       status,
//       timestamp: new Date(),
//       message: feedback || `Application ${status}`,
//       feedback,
//       updatedBy: req.user.userId
//     });

//     await application.save();

//     // Create notification for applicant
//     const notification = new Notification({
//       userId: application.userId,
//       type: 'status_updated',
//       title: 'Application Status Updated',
//       message: `Your application status has been updated to: ${status}`,
//       applicationId: application._id
//     });
//     await notification.save();

//     res.json({
//       message: 'Application status updated successfully',
//       application
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Submit Complaint
// app.post('/api/complaints', authenticateToken, async (req, res) => {
//   try {
//     const { officerId, officerName, subject, description, category } = req.body;

//     const complaint = new Complaint({
//       userId: req.user.userId,
//       officerId,
//       officerName,
//       subject,
//       description,
//       category: category || 'other'
//     });

//     await complaint.save();

//     // Create notification
//     const notification = new Notification({
//       userId: req.user.userId,
//       type: 'complaint_submitted',
//       title: 'Complaint Submitted',
//       message: 'Your complaint has been submitted successfully',
//       complaintId: complaint._id
//     });
//     await notification.save();

//     res.status(201).json({
//       message: 'Complaint submitted successfully',
//       complaint
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get Complaints
// app.get('/api/complaints', authenticateToken, async (req, res) => {
//   try {
//     let query = {};
    
//     // Filter by user type
//     if (req.user.userType === 'pension_holder') {
//       query.userId = req.user.userId;
//     }

//     const complaints = await Complaint.find(query)
//       .populate('userId', 'name email')
//       .populate('officerId', 'name email designation')
//       .sort({ submittedAt: -1 });

//     res.json(complaints);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Issue Red Flag
// app.post('/api/complaints/:id/red-flag', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check permissions
//     if (req.user.userType !== 'head_office') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const complaint = await Complaint.findById(id);
//     if (!complaint) {
//       return res.status(404).json({ message: 'Complaint not found' });
//     }

//     // Update complaint
//     complaint.redFlagIssued = true;
//     complaint.status = 'resolved';
//     complaint.resolvedAt = new Date();
//     await complaint.save();

//     // Update officer red flags
//     const officer = await User.findById(complaint.officerId);
//     if (officer) {
//       officer.redFlags += 1;
      
//       // Disable account if 3 red flags
//       if (officer.redFlags >= 3) {
//         officer.isActive = false;
//       }
      
//       await officer.save();

//       // Create notification for officer
//       const notification = new Notification({
//         userId: officer._id,
//         type: 'red_flag_issued',
//         title: 'Red Flag Issued',
//         message: `Red flag issued. Total red flags: ${officer.redFlags}/3`,
//         complaintId: complaint._id
//       });
//       await notification.save();
//     }

//     res.json({
//       message: 'Red flag issued successfully',
//       complaint
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get Officers
// app.get('/api/officers', authenticateToken, async (req, res) => {
//   try {
//     // Check permissions
//     if (req.user.userType !== 'head_office') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const officers = await User.find({
//       userType: { $in: ['assistant_accountant', 'head_office'] }
//     }).select('-password');

//     res.json(officers);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Add Officer
// app.post('/api/officers', authenticateToken, async (req, res) => {
//   try {
//     // Check permissions
//     if (req.user.userType !== 'head_office') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const { name, email, designation, department, userType } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Generate default password
//     const defaultPassword = 'password123';
//     const hashedPassword = await bcrypt.hash(defaultPassword, 10);

//     const officer = new User({
//       name,
//       email,
//       password: hashedPassword,
//       phone: '000-000-0000', // Default phone
//       address: 'Government Office', // Default address
//       userType: userType || 'assistant_accountant',
//       designation,
//       department
//     });

//     await officer.save();

//     res.status(201).json({
//       message: 'Officer added successfully',
//       officer: {
//         id: officer._id,
//         name: officer.name,
//         email: officer.email,
//         userType: officer.userType,
//         designation: officer.designation,
//         department: officer.department
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get Notifications
// app.get('/api/notifications', authenticateToken, async (req, res) => {
//   try {
//     const notifications = await Notification.find({ userId: req.user.userId })
//       .sort({ timestamp: -1 })
//       .limit(50);

//     res.json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Mark Notification as Read
// app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const notification = await Notification.findOneAndUpdate(
//       { _id: id, userId: req.user.userId },
//       { read: true },
//       { new: true }
//     );

//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     res.json({
//       message: 'Notification marked as read',
//       notification
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get Dashboard Stats
// app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
//   try {
//     let stats = {};

//     if (req.user.userType === 'pension_holder') {
//       const userApplications = await Application.countDocuments({ userId: req.user.userId });
//       const pendingApplications = await Application.countDocuments({ 
//         userId: req.user.userId, 
//         status: 'pending' 
//       });
//       const approvedApplications = await Application.countDocuments({ 
//         userId: req.user.userId, 
//         status: 'approved' 
//       });
//       const userComplaints = await Complaint.countDocuments({ userId: req.user.userId });

//       stats = {
//         totalApplications: userApplications,
//         pendingApplications,
//         approvedApplications,
//         totalComplaints: userComplaints
//       };
//     } else if (req.user.userType === 'assistant_accountant') {
//       const pendingApplications = await Application.countDocuments({ status: 'pending' });
//       const totalApplications = await Application.countDocuments();
//       const reviewedToday = await Application.countDocuments({
//         'history.timestamp': {
//           $gte: new Date(new Date().setHours(0, 0, 0, 0)),
//           $lt: new Date(new Date().setHours(23, 59, 59, 999))
//         }
//       });

//       stats = {
//         pendingApplications,
//         totalApplications,
//         reviewedToday,
//         rejectedApplications: await Application.countDocuments({ status: 'rejected' })
//       };
//     } else if (req.user.userType === 'head_office') {
//       const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
//       const activeOfficers = await User.countDocuments({ 
//         userType: { $in: ['assistant_accountant', 'head_office'] },
//         isActive: true 
//       });
//       const disabledOfficers = await User.countDocuments({ 
//         userType: { $in: ['assistant_accountant', 'head_office'] },
//         isActive: false 
//       });
//       const totalApplications = await Application.countDocuments();

//       stats = {
//         pendingComplaints,
//         activeOfficers,
//         disabledOfficers,
//         totalApplications
//       };
//     }

//     res.json(stats);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Create default admin users if they don't exist
// const createDefaultAdmins = async () => {
//   try {
//     // Check if admin users exist
//     const adminCount = await User.countDocuments({
//       userType: { $in: ['assistant_accountant', 'head_office'] }
//     });

//     if (adminCount === 0) {
//       console.log('Creating default admin users...');
      
//       const hashedPassword = await bcrypt.hash('admin123', 10);
      
//       // Create Assistant Accountant
//       const assistantAccountant = new User({
//         name: 'Assistant Accountant',
//         email: 'assistant@pensionprobd.gov.bd',
//         password: hashedPassword,
//         phone: '01700000001',
//         address: 'Bangladesh Secretariat, Dhaka',
//         userType: 'assistant_accountant',
//         designation: 'Assistant Accountant General',
//         department: 'Pension Department'
//       });
      
//       // Create Head Office
//       const headOffice = new User({
//         name: 'Head of Office',
//         email: 'head@pensionprobd.gov.bd',
//         password: hashedPassword,
//         phone: '01700000002',
//         address: 'Bangladesh Secretariat, Dhaka',
//         userType: 'head_office',
//         designation: 'Director General',
//         department: 'Pension Department'
//       });
      
//       await assistantAccountant.save();
//       await headOffice.save();
      
//       console.log('Default admin users created:');
//       console.log('Assistant Accountant: assistant@pensionprobd.gov.bd / admin123');
//       console.log('Head Office: head@pensionprobd.gov.bd / admin123');
//     }
//   } catch (error) {
//     console.error('Error creating default admin users:', error);
//   }
// };

// // Error handling middleware
// app.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
//     }
//   }
//   res.status(500).json({ message: 'Something went wrong!', error: error.message });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, async () => {
//   console.log(`Server running on port ${PORT}`);
  
//   // Create default admin users
//   await createDefaultAdmins();
  
//   console.log('\n=== PensionProBD Backend Server Started ===');
//   console.log('MongoDB Connected');
//   console.log('API Endpoints Available:');
//   console.log('- POST /api/auth/register - User Registration');
//   console.log('- POST /api/auth/login - User Login');
//   console.log('- GET /api/auth/profile - Get User Profile');
//   console.log('- POST /api/applications - Submit Application');
//   console.log('- GET /api/applications - Get Applications');
//   console.log('- PUT /api/applications/:id/status - Update Application Status');
//   console.log('- POST /api/complaints - Submit Complaint');
//   console.log('- GET /api/complaints - Get Complaints');
//   console.log('- POST /api/complaints/:id/red-flag - Issue Red Flag');
//   console.log('- GET /api/officers - Get Officers');
//   console.log('- POST /api/officers - Add Officer');
//   console.log('- GET /api/notifications - Get Notifications');
//   console.log('- PUT /api/notifications/:id/read - Mark Notification as Read');
//   console.log('- GET /api/dashboard/stats - Get Dashboard Statistics');
//   console.log('\n=== Default Admin Accounts ===');
//   console.log('Assistant Accountant: assistant@pensionprobd.gov.bd / admin123');
//   console.log('Head Office: head@pensionprobd.gov.bd / admin123');
//   console.log('==========================================\n');
// });

// module.exports = app;

// Second Updated 
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static('uploads'));

// // Create uploads directory if it doesn't exist
// if (!fs.existsSync('uploads')) {
//   fs.mkdirSync('uploads');
// }

// // MongoDB connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://fackid1971:pensionBd123@cluster0.0pa448c.mongodb.net/', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// // File upload configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024 // 10MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|pdf/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
    
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
//     }
//   }
// });

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   userType: { 
//     type: String, 
//     enum: ['pension_holder', 'assistant_accountant', 'head_office'], 
//     default: 'pension_holder' 
//   },
//   isActive: { type: Boolean, default: true },
//   redFlags: { type: Number, default: 0 },
//   designation: { type: String },
//   department: { type: String },
//   lastLogin: { type: Date },
//   createdAt: { type: Date, default: Date.now }
// });

// const User = mongoose.model('User', userSchema);

// // Application Schema
// const applicationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   applicationNumber: { type: String, unique: true },
//   fullName: { type: String, required: true },
//   fatherName: { type: String, required: true },
//   motherName: { type: String, required: true },
//   dateOfBirth: { type: Date, required: true },
//   nidNumber: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   address: { type: String, required: true },
//   lastDesignation: { type: String, required: true },
//   department: { type: String, required: true },
//   joiningDate: { type: Date, required: true },
//   retirementDate: { type: Date, required: true },
//   lastSalary: { type: Number, required: true },
//   jobAge: { type: Number, required: true },
//   age: { type: Number, required: true },
//   pensionAmount: { type: Number, required: true },
//   bankName: { type: String, required: true },
//   accountNumber: { type: String, required: true },
//   branchName: { type: String, required: true },
//   nidFile: { type: String },
//   jobDocuments: { type: String },
//   status: { 
//     type: String, 
//     enum: ['pending', 'forwarded', 'approved', 'rejected'], 
//     default: 'pending' 
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high'],
//     default: 'medium'
//   },
//   history: [{
//     status: String,
//     timestamp: { type: Date, default: Date.now },
//     message: String,
//     feedback: String,
//     updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
//   }],
//   submittedAt: { type: Date, default: Date.now },
//   approvedAt: { type: Date },
//   rejectedAt: { type: Date }
// });

// // Generate application number before saving
// applicationSchema.pre('save', async function(next) {
//   if (this.isNew) {
//     const count = await mongoose.model('Application').countDocuments();
//     this.applicationNumber = `APP${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
//   }
//   next();
// });

// const Application = mongoose.model('Application', applicationSchema);

// // Complaint Schema
// const complaintSchema = new mongoose.Schema({
//   complaintNumber: { type: String, unique: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   officerName: { type: String, required: true },
//   subject: { type: String, required: true },
//   description: { type: String, required: true },
//   category: {
//     type: String,
//     enum: ['delay', 'misconduct', 'corruption', 'poor_service', 'other'],
//     default: 'other'
//   },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high', 'urgent'],
//     default: 'medium'
//   },
//   status: { 
//     type: String, 
//     enum: ['pending', 'investigating', 'resolved', 'dismissed'], 
//     default: 'pending' 
//   },
//   redFlagIssued: { type: Boolean, default: false },
//   evidence: [{
//     filename: String,
//     path: String,
//     uploadedAt: { type: Date, default: Date.now }
//   }],
//   resolution: { type: String },
//   submittedAt: { type: Date, default: Date.now },
//   resolvedAt: { type: Date },
//   resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// });

// // Generate complaint number before saving
// complaintSchema.pre('save', async function(next) {
//   if (this.isNew) {
//     const count = await mongoose.model('Complaint').countDocuments();
//     this.complaintNumber = `CMP${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
//   }
//   next();
// });

// const Complaint = mongoose.model('Complaint', complaintSchema);

// // Notification Schema
// const notificationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   type: { 
//     type: String, 
//     enum: [
//       'application_submitted', 
//       'status_updated', 
//       'complaint_submitted', 
//       'red_flag_issued',
//       'account_disabled',
//       'document_required',
//       'payment_processed',
//       'system_maintenance'
//     ],
//     required: true 
//   },
//   title: { type: String, required: true },
//   message: { type: String, required: true },
//   applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
//   complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' },
//   read: { type: Boolean, default: false },
//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high'],
//     default: 'medium'
//   },
//   actionRequired: { type: Boolean, default: false },
//   actionUrl: { type: String },
//   expiresAt: { type: Date },
//   timestamp: { type: Date, default: Date.now }
// });

// const Notification = mongoose.model('Notification', notificationSchema);

// // Middleware to verify JWT token
// const authenticateToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ message: 'Access token required' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
//     // Check if user still exists and is active
//     const user = await User.findById(decoded.userId);
//     if (!user) {
//       return res.status(403).json({ message: 'User not found' });
//     }
    
//     if (!user.isActive) {
//       return res.status(403).json({ message: 'User account is inactive' });
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: 'Invalid token' });
//   }
// };

// // Email domain validation
// const validateEmailDomain = (email) => {
//   const allowedDomains = ['gmail.com', 'yahoo.com', 'bing.com'];
//   const isBdEmail = email.toLowerCase().endsWith('.bd');
//   const isAllowedDomain = allowedDomains.some(domain => 
//     email.toLowerCase().includes(domain)
//   );
  
//   return isAllowedDomain || isBdEmail;
// };

// // Routes

// // User Registration
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { name, email, password, phone, address, userType } = req.body;

//     // Validate email domain
//     if (!validateEmailDomain(email)) {
//       return res.status(400).json({ 
//         message: 'Only @gmail.com, @yahoo.com, @bing.com, and .bd emails are allowed' 
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//       address,
//       userType: userType || 'pension_holder'
//     });

//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, userType: user.userType },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '24h' }
//     );

//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         userType: user.userType,
//         phone: user.phone,
//         address: user.address
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // User Login - FIXED ADMIN LOGIN LOGIC
// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password, userType } = req.body;

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check if account is active
//     if (!user.isActive) {
//       return res.status(403).json({ message: 'Account is disabled due to red flags' });
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // FIXED: Check user type for admin login - allow both assistant_accountant and head_office
//     if (userType === 'admin') {
//       if (!['assistant_accountant', 'head_office'].includes(user.userType)) {
//         return res.status(403).json({ 
//           message: 'Access denied. This account is not authorized for admin access.' 
//         });
//       }
//     }

//     // Update last login
//     user.lastLogin = new Date();
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user._id, email: user.email, userType: user.userType },
//       process.env.JWT_SECRET || 'your-secret-key',
//       { expiresIn: '24h' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         userType: user.userType,
//         phone: user.phone,
//         address: user.address,
//         redFlags: user.redFlags,
//         designation: user.designation,
//         department: user.department,
//         lastLogin: user.lastLogin
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get current user profile
// app.get('/api/auth/profile', authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.userId).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         userType: user.userType,
//         phone: user.phone,
//         address: user.address,
//         redFlags: user.redFlags,
//         isActive: user.isActive,
//         designation: user.designation,
//         department: user.department,
//         createdAt: user.createdAt,
//         lastLogin: user.lastLogin
//       }
//     });
//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ message: 'Server error fetching profile' });
//   }
// });

// // Submit Pension Application
// app.post('/api/applications', authenticateToken, upload.fields([
//   { name: 'nidFile', maxCount: 1 },
//   { name: 'jobDocuments', maxCount: 1 }
// ]), async (req, res) => {
//   try {
//     const applicationData = req.body;
    
//     // Add file paths if files were uploaded
//     if (req.files) {
//       if (req.files.nidFile) {
//         applicationData.nidFile = req.files.nidFile[0].path;
//       }
//       if (req.files.jobDocuments) {
//         applicationData.jobDocuments = req.files.jobDocuments[0].path;
//       }
//     }

//     // Validate job age requirement
//     if (parseInt(applicationData.jobAge) < 19) {
//       return res.status(400).json({ message: 'Minimum job age requirement is 19 years' });
//     }

//     const application = new Application({
//       ...applicationData,
//       userId: req.user.userId,
//       history: [{
//         status: 'pending',
//         timestamp: new Date(),
//         message: 'Application submitted successfully'
//       }]
//     });

//     await application.save();

//     // Create notification
//     const notification = new Notification({
//       userId: req.user.userId,
//       type: 'application_submitted',
//       title: 'Application Submitted',
//       message: 'Your pension application has been submitted successfully',
//       applicationId: application._id
//     });
//     await notification.save();

//     res.status(201).json({
//       message: 'Application submitted successfully',
//       application
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get Applications
// app.get('/api/applications', authenticateToken, async (req, res) => {
//   try {
//     let query = {};
    
//     // Filter by user type
//     if (req.user.userType === 'pension_holder') {
//       query.userId = req.user.userId;
//     }

//     const applications = await Application.find(query)
//       .populate('userId', 'name email')
//       .sort({ submittedAt: -1 });

//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Update Application Status
// app.put('/api/applications/:id/status', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status, feedback } = req.body;

//     // Check permissions
//     if (!['assistant_accountant', 'head_office'].includes(req.user.userType)) {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const application = await Application.findById(id);
//     if (!application) {
//       return res.status(404).json({ message: 'Application not found' });
//     }

//     // Update application
//     application.status = status;
//     application.history.push({
//       status,
//       timestamp: new Date(),
//       message: feedback || `Application ${status}`,
//       feedback,
//       updatedBy: req.user.userId
//     });

//     // Set approval/rejection dates
//     if (status === 'approved') {
//       application.approvedAt = new Date();
//     } else if (status === 'rejected') {
//       application.rejectedAt = new Date();
//     }

//     await application.save();

//     // Create notification for applicant
//     const notification = new Notification({
//       userId: application.userId,
//       type: 'status_updated',
//       title: 'Application Status Updated',
//       message: `Your application status has been updated to: ${status}`,
//       applicationId: application._id
//     });
//     await notification.save();

//     res.json({
//       message: 'Application status updated successfully',
//       application
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Submit Complaint
// app.post('/api/complaints', authenticateToken, async (req, res) => {
//   try {
//     const { officerId, officerName, subject, description, category } = req.body;

//     const complaint = new Complaint({
//       userId: req.user.userId,
//       officerId,
//       officerName,
//       subject,
//       description,
//       category: category || 'other'
//     });

//     await complaint.save();

//     // Create notification
//     const notification = new Notification({
//       userId: req.user.userId,
//       type: 'complaint_submitted',
//       title: 'Complaint Submitted',
//       message: 'Your complaint has been submitted successfully',
//       complaintId: complaint._id
//     });
//     await notification.save();

//     res.status(201).json({
//       message: 'Complaint submitted successfully',
//       complaint
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get Complaints
// app.get('/api/complaints', authenticateToken, async (req, res) => {
//   try {
//     let query = {};
    
//     // Filter by user type
//     if (req.user.userType === 'pension_holder') {
//       query.userId = req.user.userId;
//     }

//     const complaints = await Complaint.find(query)
//       .populate('userId', 'name email')
//       .populate('officerId', 'name email designation')
//       .sort({ submittedAt: -1 });

//     res.json(complaints);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Issue Red Flag
// app.post('/api/complaints/:id/red-flag', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Check permissions
//     if (req.user.userType !== 'head_office') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const complaint = await Complaint.findById(id);
//     if (!complaint) {
//       return res.status(404).json({ message: 'Complaint not found' });
//     }

//     // Update complaint
//     complaint.redFlagIssued = true;
//     complaint.status = 'resolved';
//     complaint.resolvedAt = new Date();
//     complaint.resolvedBy = req.user.userId;
//     await complaint.save();

//     // Update officer red flags
//     const officer = await User.findById(complaint.officerId);
//     if (officer) {
//       officer.redFlags += 1;
      
//       // Disable account if 3 red flags
//       if (officer.redFlags >= 3) {
//         officer.isActive = false;
//       }
      
//       await officer.save();

//       // Create notification for officer
//       const notification = new Notification({
//         userId: officer._id,
//         type: 'red_flag_issued',
//         title: 'Red Flag Issued',
//         message: `Red flag issued. Total red flags: ${officer.redFlags}/3`,
//         complaintId: complaint._id,
//         priority: officer.redFlags >= 3 ? 'high' : 'medium'
//       });
//       await notification.save();
//     }

//     res.json({
//       message: 'Red flag issued successfully',
//       complaint
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get Officers
// app.get('/api/officers', authenticateToken, async (req, res) => {
//   try {
//     // Check permissions
//     if (req.user.userType !== 'head_office') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const officers = await User.find({
//       userType: { $in: ['assistant_accountant', 'head_office'] }
//     }).select('-password').sort({ createdAt: -1 });

//     res.json(officers);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Add Officer
// app.post('/api/officers', authenticateToken, async (req, res) => {
//   try {
//     // Check permissions
//     if (req.user.userType !== 'head_office') {
//       return res.status(403).json({ message: 'Access denied' });
//     }

//     const { name, email, designation, department, userType } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists with this email' });
//     }

//     // Generate default password
//     const defaultPassword = 'admin123';
//     const hashedPassword = await bcrypt.hash(defaultPassword, 10);

//     const officer = new User({
//       name,
//       email,
//       password: hashedPassword,
//       phone: '000-000-0000', // Default phone
//       address: 'Government Office', // Default address
//       userType: userType || 'assistant_accountant',
//       designation,
//       department
//     });

//     await officer.save();

//     res.status(201).json({
//       message: 'Officer added successfully',
//       officer: {
//         id: officer._id,
//         name: officer.name,
//         email: officer.email,
//         userType: officer.userType,
//         designation: officer.designation,
//         department: officer.department,
//         isActive: officer.isActive,
//         redFlags: officer.redFlags
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Get Notifications
// app.get('/api/notifications', authenticateToken, async (req, res) => {
//   try {
//     const notifications = await Notification.find({ userId: req.user.userId })
//       .sort({ timestamp: -1 })
//       .limit(50);

//     res.json(notifications);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Mark Notification as Read
// app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     const notification = await Notification.findOneAndUpdate(
//       { _id: id, userId: req.user.userId },
//       { read: true },
//       { new: true }
//     );

//     if (!notification) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     res.json({
//       message: 'Notification marked as read',
//       notification
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Enhanced Dashboard Stats with Real-time Data
// app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
//   try {
//     let stats = {};

//     if (req.user.userType === 'pension_holder') {
//       const userApplications = await Application.countDocuments({ userId: req.user.userId });
//       const pendingApplications = await Application.countDocuments({ 
//         userId: req.user.userId, 
//         status: 'pending' 
//       });
//       const approvedApplications = await Application.countDocuments({ 
//         userId: req.user.userId, 
//         status: 'approved' 
//       });
//       const userComplaints = await Complaint.countDocuments({ userId: req.user.userId });

//       stats = {
//         totalApplications: userApplications,
//         pendingApplications,
//         approvedApplications,
//         totalComplaints: userComplaints
//       };
//     } else if (req.user.userType === 'assistant_accountant') {
//       const pendingApplications = await Application.countDocuments({ status: 'pending' });
//       const totalApplications = await Application.countDocuments();
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const tomorrow = new Date(today);
//       tomorrow.setDate(tomorrow.getDate() + 1);
      
//       const reviewedToday = await Application.countDocuments({
//         'history.timestamp': {
//           $gte: today,
//           $lt: tomorrow
//         }
//       });

//       stats = {
//         pendingApplications,
//         totalApplications,
//         reviewedToday,
//         rejectedApplications: await Application.countDocuments({ status: 'rejected' })
//       };
//     } else if (req.user.userType === 'head_office') {
//       const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
//       const activeOfficers = await User.countDocuments({ 
//         userType: { $in: ['assistant_accountant', 'head_office'] },
//         isActive: true 
//       });
//       const disabledOfficers = await User.countDocuments({ 
//         userType: { $in: ['assistant_accountant', 'head_office'] },
//         isActive: false 
//       });
//       const totalApplications = await Application.countDocuments();
//       const criticalOfficers = await User.countDocuments({
//         userType: { $in: ['assistant_accountant', 'head_office'] },
//         redFlags: { $gte: 2 }
//       });

//       // Additional analytics
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const tomorrow = new Date(today);
//       tomorrow.setDate(tomorrow.getDate() + 1);

//       const todayComplaints = await Complaint.countDocuments({
//         submittedAt: { $gte: today, $lt: tomorrow }
//       });

//       const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
//       const totalComplaints = await Complaint.countDocuments();

//       stats = {
//         pendingComplaints,
//         activeOfficers,
//         disabledOfficers,
//         totalApplications,
//         criticalOfficers,
//         todayComplaints,
//         resolvedComplaints,
//         totalComplaints,
//         resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0
//       };
//     }

//     res.json(stats);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // System Health Check
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'healthy',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime(),
//     database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
//   });
// });

// // Create default admin users if they don't exist
// const createDefaultAdmins = async () => {
//   try {
//     // Check if admin users exist
//     const adminCount = await User.countDocuments({
//       userType: { $in: ['assistant_accountant', 'head_office'] }
//     });

//     if (adminCount === 0) {
//       console.log('Creating default admin users...');
      
//       const hashedPassword = await bcrypt.hash('admin123', 10);
      
//       // Create Assistant Accountant
//       const assistantAccountant = new User({
//         name: 'Assistant Accountant',
//         email: 'assistant@pensionprobd.gov.bd',
//         password: hashedPassword,
//         phone: '01700000001',
//         address: 'Bangladesh Secretariat, Dhaka',
//         userType: 'assistant_accountant',
//         designation: 'Assistant Accountant General',
//         department: 'Pension Department'
//       });
      
//       // Create Head Office
//       const headOffice = new User({
//         name: 'Head of Office',
//         email: 'head@pensionprobd.gov.bd',
//         password: hashedPassword,
//         phone: '01700000002',
//         address: 'Bangladesh Secretariat, Dhaka',
//         userType: 'head_office',
//         designation: 'Director General',
//         department: 'Pension Department'
//       });
      
//       await assistantAccountant.save();
//       await headOffice.save();
      
//       console.log('Default admin users created:');
//       console.log('Assistant Accountant: assistant@pensionprobd.gov.bd / admin123');
//       console.log('Head Office: head@pensionprobd.gov.bd / admin123');
//     }
//   } catch (error) {
//     console.error('Error creating default admin users:', error);
//   }
// };

// // Error handling middleware
// app.use((error, req, res, next) => {
//   if (error instanceof multer.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
//     }
//   }
//   res.status(500).json({ message: 'Something went wrong!', error: error.message });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, async () => {
//   console.log(`Server running on port ${PORT}`);
  
//   // Create default admin users
//   await createDefaultAdmins();
  
//   console.log('\n=== PensionProBD Backend Server Started ===');
//   console.log('MongoDB Connected');
//   console.log('API Endpoints Available:');
//   console.log('- POST /api/auth/register - User Registration');
//   console.log('- POST /api/auth/login - User Login');
//   console.log('- GET /api/auth/profile - Get User Profile');
//   console.log('- POST /api/applications - Submit Application');
//   console.log('- GET /api/applications - Get Applications');
//   console.log('- PUT /api/applications/:id/status - Update Application Status');
//   console.log('- POST /api/complaints - Submit Complaint');
//   console.log('- GET /api/complaints - Get Complaints');
//   console.log('- POST /api/complaints/:id/red-flag - Issue Red Flag');
//   console.log('- GET /api/officers - Get Officers');
//   console.log('- POST /api/officers - Add Officer');
//   console.log('- GET /api/notifications - Get Notifications');
//   console.log('- PUT /api/notifications/:id/read - Mark Notification as Read');
//   console.log('- GET /api/dashboard/stats - Get Dashboard Statistics');
//   console.log('- GET /api/health - System Health Check');
//   console.log('\n=== Default Admin Accounts ===');
//   console.log('Assistant Accountant: assistant@pensionprobd.gov.bd / admin123');
//   console.log('Head Office: head@pensionprobd.gov.bd / admin123');
//   console.log('==========================================\n');
// });

// module.exports = app;

// Third Update
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const complaintRoutes = require('./routes/complaints');

// Import models
const User = require('./models/User');
const Application = require('./models/Application');
const Complaint = require('./models/Complaint');
const Notification = require('./models/Notification');

// Import middleware
const { authenticateToken, authorizeRoles } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pensionprobd', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/complaints', complaintRoutes);

// Get Officers (Available to Head Office and Pension Holders)
app.get('/api/officers', authenticateToken, async (req, res) => {
  try {
    // Allow both head_office and pension_holder to fetch officers
    // Head office needs it for management, pension holders need it for complaint submission
    if (req.user.userType !== 'head_office' && req.user.userType !== 'pension_holder') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // For pension holders, only show active officers
    // For head office, show all officers
    const query = {
      userType: { $in: ['assistant_accountant', 'head_office'] }
    };
    
    if (req.user.userType === 'pension_holder') {
      query.isActive = true; // Only show active officers to pension holders
    }

    const officers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(officers);
  } catch (error) {
    console.error('Fetch officers error:', error);
    res.status(500).json({ message: 'Server error fetching officers' });
  }
});

// Add Officer
app.post('/api/officers', authenticateToken, authorizeRoles('head_office'), async (req, res) => {
  try {
    const { name, email, designation, department, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate default password
    const defaultPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const officer = new User({
      name,
      email,
      password: hashedPassword,
      phone: '000-000-0000', // Default phone
      address: 'Government Office', // Default address
      userType: userType || 'assistant_accountant',
      designation,
      department
    });

    await officer.save();

    res.status(201).json({
      message: 'Officer added successfully',
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        userType: officer.userType,
        designation: officer.designation,
        department: officer.department,
        isActive: officer.isActive,
        redFlags: officer.redFlags
      }
    });
  } catch (error) {
    console.error('Add officer error:', error);
    res.status(500).json({ message: 'Server error adding officer' });
  }
});

// Toggle Officer Status (Activate/Deactivate)
app.put('/api/officers/:id/toggle-status', authenticateToken, authorizeRoles('head_office'), async (req, res) => {
  try {
    const { id } = req.params;

    const officer = await User.findById(id);
    if (!officer) {
      return res.status(404).json({ message: 'Officer not found' });
    }

    // Prevent deactivating head office users
    if (officer.userType === 'head_office' && officer._id.toString() === req.user.userId) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    // Toggle status
    officer.isActive = !officer.isActive;
    await officer.save();

    // Create notification for officer
    const Notification = require('./models/Notification');
    const notification = new Notification({
      userId: officer._id,
      type: officer.isActive ? 'account_activated' : 'account_deactivated',
      title: officer.isActive ? 'Account Activated' : 'Account Deactivated',
      message: officer.isActive 
        ? 'Your account has been activated by the head office.' 
        : 'Your account has been deactivated by the head office. Please contact administration.',
      priority: officer.isActive ? 'medium' : 'high'
    });
    await notification.save();

    res.json({
      message: officer.isActive ? 'Officer activated successfully' : 'Officer deactivated successfully',
      officer: {
        id: officer._id,
        name: officer.name,
        email: officer.email,
        isActive: officer.isActive,
        redFlags: officer.redFlags
      }
    });
  } catch (error) {
    console.error('Toggle officer status error:', error);
    res.status(500).json({ message: 'Server error toggling officer status' });
  }
});

// Get Notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
});

// Mark Notification as Read
app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error marking notification as read' });
  }
});

// Enhanced Dashboard Stats with Real-time Data
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    let stats = {};

    if (req.user.userType === 'pension_holder') {
      const userApplications = await Application.countDocuments({ userId: req.user.userId });
      const pendingApplications = await Application.countDocuments({ 
        userId: req.user.userId, 
        status: 'pending' 
      });
      const approvedApplications = await Application.countDocuments({ 
        userId: req.user.userId, 
        status: 'approved' 
      });
      const userComplaints = await Complaint.countDocuments({ userId: req.user.userId });

      stats = {
        totalApplications: userApplications,
        pendingApplications,
        approvedApplications,
        totalComplaints: userComplaints
      };
    } else if (req.user.userType === 'assistant_accountant') {
      const pendingApplications = await Application.countDocuments({ status: 'pending' });
      const totalApplications = await Application.countDocuments();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const reviewedToday = await Application.countDocuments({
        'history.timestamp': {
          $gte: today,
          $lt: tomorrow
        }
      });

      stats = {
        pendingApplications,
        totalApplications,
        reviewedToday,
        rejectedApplications: await Application.countDocuments({ status: 'rejected' })
      };
    } else if (req.user.userType === 'head_office') {
      const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
      const activeOfficers = await User.countDocuments({ 
        userType: { $in: ['assistant_accountant', 'head_office'] },
        isActive: true 
      });
      const disabledOfficers = await User.countDocuments({ 
        userType: { $in: ['assistant_accountant', 'head_office'] },
        isActive: false 
      });
      const totalApplications = await Application.countDocuments();
      const criticalOfficers = await User.countDocuments({
        userType: { $in: ['assistant_accountant', 'head_office'] },
        redFlags: { $gte: 2 }
      });

      // Additional analytics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayComplaints = await Complaint.countDocuments({
        submittedAt: { $gte: today, $lt: tomorrow }
      });

      const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
      const totalComplaints = await Complaint.countDocuments();

      stats = {
        pendingComplaints,
        activeOfficers,
        disabledOfficers,
        totalApplications,
        criticalOfficers,
        todayComplaints,
        resolvedComplaints,
        totalComplaints,
        resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0
      };
    }

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
});

// Get Comprehensive Reports (Head Office Only)
app.get('/api/reports', authenticateToken, authorizeRoles('head_office'), async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const Application = require('./models/Application');
    const Complaint = require('./models/Complaint');

    let reports = {};

    // Application Reports
    if (!type || type === 'applications') {
      const applicationQuery = {};
      if (startDate && endDate) {
        applicationQuery.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const totalApplications = await Application.countDocuments(applicationQuery);
      const pendingApplications = await Application.countDocuments({ ...applicationQuery, status: 'pending' });
      const approvedApplications = await Application.countDocuments({ ...applicationQuery, status: 'approved' });
      const rejectedApplications = await Application.countDocuments({ ...applicationQuery, status: 'rejected' });
      const forwardedApplications = await Application.countDocuments({ ...applicationQuery, status: 'forwarded' });

      // Applications by month
      const applicationsByMonth = await Application.aggregate([
        { $match: applicationQuery },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      reports.applications = {
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications,
        forwarded: forwardedApplications,
        byMonth: applicationsByMonth
      };
    }

    // Complaint Reports
    if (!type || type === 'complaints') {
      const complaintQuery = {};
      if (startDate && endDate) {
        complaintQuery.submittedAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      const totalComplaints = await Complaint.countDocuments(complaintQuery);
      const pendingComplaints = await Complaint.countDocuments({ ...complaintQuery, status: 'pending' });
      const resolvedComplaints = await Complaint.countDocuments({ ...complaintQuery, status: 'resolved' });
      const dismissedComplaints = await Complaint.countDocuments({ ...complaintQuery, status: 'dismissed' });
      const redFlagComplaints = await Complaint.countDocuments({ ...complaintQuery, redFlagIssued: true });

      // Complaints by category
      const complaintsByCategory = await Complaint.aggregate([
        { $match: complaintQuery },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        }
      ]);

      // Complaints by month
      const complaintsByMonth = await Complaint.aggregate([
        { $match: complaintQuery },
        {
          $group: {
            _id: {
              year: { $year: '$submittedAt' },
              month: { $month: '$submittedAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      reports.complaints = {
        total: totalComplaints,
        pending: pendingComplaints,
        resolved: resolvedComplaints,
        dismissed: dismissedComplaints,
        redFlagIssued: redFlagComplaints,
        byCategory: complaintsByCategory,
        byMonth: complaintsByMonth
      };
    }

    // Officer Reports
    if (!type || type === 'officers') {
      const totalOfficers = await User.countDocuments({
        userType: { $in: ['assistant_accountant', 'head_office'] }
      });
      const activeOfficers = await User.countDocuments({
        userType: { $in: ['assistant_accountant', 'head_office'] },
        isActive: true
      });
      const disabledOfficers = await User.countDocuments({
        userType: { $in: ['assistant_accountant', 'head_office'] },
        isActive: false
      });
      const officersWithRedFlags = await User.countDocuments({
        userType: { $in: ['assistant_accountant', 'head_office'] },
        redFlags: { $gt: 0 }
      });
      const criticalOfficers = await User.countDocuments({
        userType: { $in: ['assistant_accountant', 'head_office'] },
        redFlags: { $gte: 2 }
      });

      // Officers by red flag count
      const officersByRedFlags = await User.aggregate([
        {
          $match: {
            userType: { $in: ['assistant_accountant', 'head_office'] }
          }
        },
        {
          $group: {
            _id: '$redFlags',
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      // Get top officers with most complaints
      const topOfficersWithComplaints = await Complaint.aggregate([
        {
          $group: {
            _id: '$officerId',
            complaintCount: { $sum: 1 },
            redFlagCount: {
              $sum: { $cond: ['$redFlagIssued', 1, 0] }
            }
          }
        },
        { $sort: { complaintCount: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'officer'
          }
        },
        { $unwind: '$officer' },
        {
          $project: {
            officerName: '$officer.name',
            officerEmail: '$officer.email',
            officerDesignation: '$officer.designation',
            officerDepartment: '$officer.department',
            complaintCount: 1,
            redFlagCount: 1
          }
        }
      ]);

      reports.officers = {
        total: totalOfficers,
        active: activeOfficers,
        disabled: disabledOfficers,
        withRedFlags: officersWithRedFlags,
        critical: criticalOfficers,
        byRedFlags: officersByRedFlags,
        topComplaints: topOfficersWithComplaints
      };
    }

    // Overall Statistics
    if (!type || type === 'overall') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayApplications = await Application.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow }
      });
      const todayComplaints = await Complaint.countDocuments({
        submittedAt: { $gte: today, $lt: tomorrow }
      });

      reports.overall = {
        todayApplications,
        todayComplaints,
        totalUsers: await User.countDocuments(),
        totalPensionHolders: await User.countDocuments({ userType: 'pension_holder' })
      };
    }

    res.json({
      message: 'Reports generated successfully',
      reports,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Generate reports error:', error);
    res.status(500).json({ message: 'Server error generating reports' });
  }
});

// System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Create default admin users if they don't exist
const createDefaultAdmins = async () => {
  try {
    // Check if admin users exist
    const adminCount = await User.countDocuments({
      userType: { $in: ['assistant_accountant', 'head_office'] }
    });

    if (adminCount === 0) {
      console.log('Creating default admin users...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      // Create Assistant Accountant
      const assistantAccountant = new User({
        name: 'Assistant Accountant',
        email: 'assistant@pensionprobd.gov.bd',
        password: hashedPassword,
        phone: '01700000001',
        address: 'Bangladesh Secretariat, Dhaka',
        userType: 'assistant_accountant',
        designation: 'Assistant Accountant General',
        department: 'Pension Department'
      });
      
      // Create Head Office
      const headOffice = new User({
        name: 'Head of Office',
        email: 'head@pensionprobd.gov.bd',
        password: hashedPassword,
        phone: '01700000002',
        address: 'Bangladesh Secretariat, Dhaka',
        userType: 'head_office',
        designation: 'Director General',
        department: 'Pension Department'
      });
      
      await assistantAccountant.save();
      await headOffice.save();
      
      console.log('Default admin users created:');
      console.log('Assistant Accountant: assistant@pensionprobd.gov.bd / admin123');
      console.log('Head Office: head@pensionprobd.gov.bd / admin123');
    }
  } catch (error) {
    console.error('Error creating default admin users:', error);
  }
};

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }
  }
  res.status(500).json({ message: 'Something went wrong!', error: error.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Create default admin users
  await createDefaultAdmins();
  
  console.log('\n=== PensionProBD Backend Server Started ===');
  console.log('MongoDB Connected');
  console.log('API Endpoints Available:');
  console.log('- POST /api/auth/register - User Registration');
  console.log('- POST /api/auth/login - User Login');
  console.log('- GET /api/auth/profile - Get User Profile');
  console.log('- POST /api/applications - Submit Application');
  console.log('- GET /api/applications - Get Applications');
  console.log('- PUT /api/applications/:id/status - Update Application Status');
  console.log('- POST /api/complaints - Submit Complaint');
  console.log('- GET /api/complaints - Get Complaints');
  console.log('- POST /api/complaints/:id/red-flag - Issue Red Flag');
  console.log('- GET /api/officers - Get Officers');
  console.log('- POST /api/officers - Add Officer');
  console.log('- GET /api/notifications - Get Notifications');
  console.log('- PUT /api/notifications/:id/read - Mark Notification as Read');
  console.log('- GET /api/dashboard/stats - Get Dashboard Statistics');
  console.log('- GET /api/health - System Health Check');
  console.log('\n=== Default Admin Accounts ===');
  console.log('Assistant Accountant: assistant@pensionprobd.gov.bd / admin123');
  console.log('Head Office: head@pensionprobd.gov.bd / admin123');
  console.log('==========================================\n');
});

module.exports = app;



