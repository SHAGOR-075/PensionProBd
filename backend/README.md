# PensionProBD Backend API

A comprehensive backend API for the PensionProBD - Digital Bangladesh Pension Management System.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Pension Holders, Assistant Accountant General, Head of Office)
  - Email domain validation
  - Password encryption with bcrypt

- **Pension Application Management**
  - Multi-step application submission
  - Document upload (NID, Job Documents)
  - Application status tracking
  - History logging

- **Complaint Management**
  - Complaint submission against officers
  - Red flag warning system
  - Automatic account suspension after 3 red flags

- **Officer Management**
  - Add/Edit/Disable officer accounts
  - Red flag tracking
  - Role-based permissions

- **Notification System**
  - Real-time notifications
  - Email notifications (optional)
  - Push notifications support

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pensionprobd-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pensionprobd
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Applications
- `POST /api/applications` - Submit pension application
- `GET /api/applications` - Get applications (filtered by user role)
- `PUT /api/applications/:id/status` - Update application status
- `GET /api/applications/:id` - Get specific application

### Complaints
- `POST /api/complaints` - Submit complaint
- `GET /api/complaints` - Get complaints (filtered by user role)
- `POST /api/complaints/:id/red-flag` - Issue red flag

### Officers (Head Office only)
- `GET /api/officers` - Get all officers
- `POST /api/officers` - Add new officer
- `PUT /api/officers/:id` - Update officer
- `DELETE /api/officers/:id` - Disable officer

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## User Roles

### Pension Holder
- Submit pension applications
- Track application status
- Submit complaints
- View personal documents

### Assistant Accountant General
- Review pension applications
- Forward applications to Head Office
- Provide feedback on applications
- Reject incomplete applications

### Head of Office
- Manage complaints
- Issue red flag warnings
- Add/manage officer accounts
- View system-wide statistics

## File Upload

The API supports file uploads for:
- NID documents (PDF, JPG, JPEG, PNG)
- Job documents (PDF, JPG, JPEG, PNG)
- Maximum file size: 10MB

Files are stored in the `uploads/` directory and served statically.

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable salt rounds
- **Email Validation**: Domain-specific email validation
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers for Express apps
- **Input Validation**: Comprehensive input validation and sanitization

## Database Schema

### User
- Personal information (name, email, phone, address)
- Authentication data (password hash)
- Role and permissions (userType)
- Account status (isActive, redFlags)

### Application
- Complete pension application data
- Document file paths
- Status tracking and history
- Approval workflow

### Complaint
- Complaint details and evidence
- Officer references
- Resolution tracking
- Red flag management

### Notification
- User-specific notifications
- Type-based categorization
- Read/unread status
- Expiration handling

## Error Handling

The API includes comprehensive error handling:
- Validation errors with detailed messages
- Authentication and authorization errors
- File upload errors
- Database operation errors
- Generic server errors

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── models/          # Mongoose schemas
├── routes/          # Express route handlers
├── middleware/      # Custom middleware
├── uploads/         # File upload directory
├── server.js        # Main application file
└── package.json     # Dependencies and scripts
```

### Adding New Features

1. Create model schemas in `models/`
2. Implement route handlers in `routes/`
3. Add middleware if needed in `middleware/`
4. Update the main server file to include new routes

## Deployment

### Environment Variables
Ensure all required environment variables are set:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)

### Production Considerations
- Use a production MongoDB instance
- Set strong JWT secret
- Configure proper CORS origins
- Set up SSL/TLS certificates
- Configure reverse proxy (nginx)
- Set up monitoring and logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.