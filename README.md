# 🏛️ PensionProBD — ডিজিটাল বাংলাদেশ পেনশন ম্যানেজমেন্ট সিস্টেম


## 📋 প্রজেক্ট সারসংক্ষেপ (Project Abstract)

**PensionProBD** হলো বাংলাদেশ সরকারি কর্মচারীদের জন্য একটি সম্পূর্ণ ডিজিটাল পেনশন ব্যবস্থাপনা সিস্টেম। এই সিস্টেমটি পেনশন আবেদন প্রক্রিয়াকে ডিজিটাইজড করে, কাগজ-ভিত্তিক জটিলতা দূর করে এবং সরকারি কর্মকর্তা থেকে শুরু করে অবসরপ্রাপ্ত কর্মচারী পর্যন্ত সকলের জন্য একটি স্বচ্ছ, দ্রুত এবং নির্ভরযোগ্য পেনশন প্রক্রিয়া নিশ্চিত করে।

---

## 🎯 উদ্দেশ্য (Objectives)

- সরকারি পেনশন আবেদন প্রক্রিয়া সম্পূর্ণ ডিজিটাল করা
- মাল্টি-রোল অ্যাক্সেস কন্ট্রোল সিস্টেম তৈরি করা
- আবেদন ট্র্যাকিং এবং রিয়েল-টাইম স্ট্যাটাস আপডেট নিশ্চিত করা
- অভিযোগ ব্যবস্থাপনা ও রেড-ফ্ল্যাগ সিস্টেম চালু করা
- ডিজিটাল সার্টিফিকেট ও ডকুমেন্ট জেনারেশন সুবিধা প্রদান করা
- বাংলা ও ইংরেজি দ্বিভাষিক সমর্থন নিশ্চিত করা

---

## 👥 ব্যবহারকারীর ধরন (User Roles)

| রোল | বিবরণ |
|-----|--------|
| **পেনশন হোল্ডার** (`pension_holder`) | অবসরপ্রাপ্ত সরকারি কর্মচারী যারা পেনশনের জন্য আবেদন করেন |
| **সহকারী হিসাবরক্ষক** (`assistant_accountant`) | আবেদন যাচাই ও ফরওয়ার্ড করেন |
| **প্রধান কার্যালয়** (`head_office`) | চূড়ান্ত অনুমোদন বা প্রত্যাখ্যান করেন |

---

## ⚙️ প্রযুক্তি স্ট্যাক (Technology Stack)

### 🖥️ Frontend
| প্রযুক্তি | সংস্করণ | উদ্দেশ্য |
|-----------|---------|----------|
| React.js | 18.3.1 | UI Framework |
| Vite | 5.4.2 | Build Tool |
| Tailwind CSS | 3.4.13 | Styling |
| React Router DOM | 6.26.2 | Client-side Routing |
| React Hook Form | 7.53.0 | Form Management |
| React i18next | 15.0.1 | Multilingual (বাংলা/English) |
| Lucide React | 0.445.0 | Icon Library |
| React Hot Toast | 2.4.1 | Notification |
| jsPDF + html2canvas | 2.5.1 / 1.4.1 | PDF Generation |
| date-fns | 3.6.0 | Date Utilities |

### 🔧 Backend
| প্রযুক্তি | সংস্করণ | উদ্দেশ্য |
|-----------|---------|----------|
| Node.js | ≥16.0.0 | Runtime Environment |
| Express.js | 4.18.2 | Web Framework |
| MongoDB Atlas | Cloud | Database |
| Mongoose | 7.5.0 | ODM |
| JSON Web Token | 9.0.2 | Authentication |
| bcryptjs | 2.4.3 | Password Hashing |
| Multer | 1.4.5 | File Upload |
| Nodemailer | 10.1.1 | Email Service |
| Helmet | 7.0.0 | Security Headers |
| express-rate-limit | 6.10.0 | API Rate Limiting |
| express-validator | 7.0.1 | Input Validation |
| pdf-lib | 1.17.1 | PDF Processing |
| Sharp | 0.35.5 | Image Processing |

---

## 🗂️ প্রজেক্ট স্ট্রাকচার (Project Structure)

```
PensionProBD/
├── frontend/                          # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/                  # লগইন ও রেজিস্ট্রেশন
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── Home/                  # হোমপেজ
│   │   │   │   └── Homepage.jsx
│   │   │   ├── Layout/                # অ্যাপ লেআউট
│   │   │   │   └── Layout.jsx
│   │   │   ├── Common/                # শেয়ার্ড কম্পোনেন্ট
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── PensionHolder/         # পেনশন হোল্ডার মডিউল
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── ApplicationForm.jsx
│   │   │   │   ├── ApplicationStatus.jsx
│   │   │   │   ├── SubmitComplaint.jsx
│   │   │   │   └── MyDocuments.jsx
│   │   │   ├── AssistantAccountant/   # সহকারী হিসাবরক্ষক মডিউল
│   │   │   │   └── Dashboard.jsx
│   │   │   └── HeadOffice/            # প্রধান কার্যালয় মডিউল
│   │   │       └── Dashboard.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx        # Authentication Context
│   │   │   ├── DataContext.jsx        # Data Management Context
│   │   │   └── ThemeContext.jsx       # Theme (Dark/Light) Context
│   │   ├── i18n/                      # Internationalization (বাংলা/EN)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                           # Node.js + Express Backend
│   ├── models/
│   │   ├── User.js                    # ব্যবহারকারী মডেল
│   │   ├── Application.js             # পেনশন আবেদন মডেল
│   │   ├── Complaint.js               # অভিযোগ মডেল
│   │   └── Notification.js            # নোটিফিকেশন মডেল
│   ├── routes/
│   │   ├── auth.js                    # Auth API
│   │   ├── applications.js            # Application API
│   │   └── complaints.js              # Complaint API
│   ├── middleware/
│   │   └── auth.js                    # JWT Middleware
│   ├── uploads/                       # File Upload Directory
│   ├── server.js                      # Main Server
│   └── .env                           # Environment Config
│
└── Diagram/                           # প্রজেক্ট ডায়াগ্রামসমূহ
    ├── System Architecture Diagram.png
    ├── ER Diagaram.png
    ├── Data Flow.drawio.png
    ├── Context Diagram.png
    └── Use Case.png
```

---

## 🗄️ ডেটাবেজ ডিজাইন (Database Design — MongoDB)

### 1. Users Collection
```json
{
  "name": "String (required)",
  "email": "String (unique, required)",
  "password": "String (bcrypt hashed)",
  "phone": "String",
  "address": "String",
  "userType": "pension_holder | assistant_accountant | head_office",
  "isActive": "Boolean",
  "redFlags": "Number (0-3)",
  "designation": "String",
  "department": "String",
  "profileImage": "String",
  "emailVerified": "Boolean",
  "lastLogin": "Date",
  "createdAt": "Date"
}
```

### 2. Applications Collection
```json
{
  "applicationNumber": "APP2025000001 (auto-generated)",
  "userId": "ObjectId (ref: User)",
  "fullName": "String",
  "fatherName": "String",
  "motherName": "String",
  "dateOfBirth": "Date",
  "nidNumber": "String (unique)",
  "phoneNumber": "String",
  "address": "String",
  "lastDesignation": "String",
  "department": "String",
  "joiningDate": "Date",
  "retirementDate": "Date",
  "lastSalary": "Number",
  "jobAge": "Number (min: 19)",
  "age": "Number",
  "pensionAmount": "Number (auto-calculated)",
  "bankName": "String",
  "accountNumber": "String",
  "branchName": "String",
  "nidFile": "String (upload path)",
  "jobDocuments": "String (upload path)",
  "status": "pending | forwarded | approved | rejected",
  "priority": "low | medium | high",
  "history": "[{ status, timestamp, message, feedback, updatedBy }]",
  "certificateGenerated": "Boolean",
  "submittedAt": "Date"
}
```

### 3. Complaints Collection
```json
{
  "complaintNumber": "CMP2025000001 (auto-generated)",
  "userId": "ObjectId (ref: User)",
  "officerId": "ObjectId (ref: User)",
  "officerName": "String",
  "subject": "String (max: 200)",
  "description": "String (max: 1000)",
  "category": "delay | misconduct | corruption | poor_service | other",
  "priority": "low | medium | high | urgent",
  "status": "pending | investigating | resolved | dismissed",
  "redFlagIssued": "Boolean",
  "evidence": "[{ filename, path, uploadedAt }]",
  "resolution": "String",
  "submittedAt": "Date",
  "resolvedAt": "Date"
}
```

### 4. Notifications Collection
```json
{
  "userId": "ObjectId (ref: User)",
  "type": "application_submitted | status_updated | complaint_submitted | red_flag_issued | ...",
  "title": "String",
  "message": "String",
  "applicationId": "ObjectId (ref: Application)",
  "complaintId": "ObjectId (ref: Complaint)",
  "read": "Boolean",
  "priority": "low | medium | high",
  "actionRequired": "Boolean",
  "actionUrl": "String",
  "expiresAt": "Date",
  "timestamp": "Date"
}
```

---

## 🔌 API এন্ডপয়েন্ট (REST API Endpoints)

### 🔐 Authentication Routes — `/api/auth`
| Method | Endpoint | বিবরণ |
|--------|---------|--------|
| `POST` | `/register` | নতুন ব্যবহারকারী নিবন্ধন |
| `POST` | `/login` | লগইন ও JWT টোকেন |
| `GET` | `/me` | বর্তমান ব্যবহারকারীর তথ্য |
| `PUT` | `/profile` | প্রোফাইল আপডেট |

### 📄 Application Routes — `/api/applications`
| Method | Endpoint | বিবরণ |
|--------|---------|--------|
| `POST` | `/` | নতুন পেনশন আবেদন জমা |
| `GET` | `/` | সকল আবেদন দেখুন (role-based) |
| `GET` | `/:id` | নির্দিষ্ট আবেদনের বিবরণ |
| `PUT` | `/:id` | আবেদন আপডেট |
| `PUT` | `/:id/status` | স্ট্যাটাস পরিবর্তন (Approve/Reject/Forward) |
| `DELETE` | `/:id` | আবেদন মুছুন |

### 📢 Complaint Routes — `/api/complaints`
| Method | Endpoint | বিবরণ |
|--------|---------|--------|
| `POST` | `/` | নতুন অভিযোগ দাখিল |
| `GET` | `/` | সকল অভিযোগ দেখুন |
| `GET` | `/:id` | নির্দিষ্ট অভিযোগের বিবরণ |
| `PUT` | `/:id/status` | অভিযোগের স্ট্যাটাস পরিবর্তন |
| `PUT` | `/:id/red-flag` | রেড-ফ্ল্যাগ জারি করুন |

---

## 🌟 মূল ফিচারসমূহ (Key Features)

### পেনশন হোল্ডার (Pension Holder)
- ✅ অ্যাকাউন্ট তৈরি ও লগইন
- ✅ পেনশন আবেদন ফর্ম পূরণ (NID, চাকরির তথ্য, ব্যাংক তথ্য)
- ✅ ডকুমেন্ট আপলোড (NID কপি, চাকরির দলিল)
- ✅ আবেদনের রিয়েল-টাইম স্ট্যাটাস ট্র্যাকিং
- ✅ আবেদন সম্পাদনা (Pending অবস্থায়)
- ✅ অভিযোগ দাখিল ও ট্র্যাকিং
- ✅ ডকুমেন্ট ডাউনলোড ও PDF জেনারেশন
- ✅ নোটিফিকেশন সিস্টেম

### সহকারী হিসাবরক্ষক (Assistant Accountant)
- ✅ সকল আবেদন পর্যালোচনা ও যাচাই
- ✅ আবেদন প্রধান কার্যালয়ে ফরওয়ার্ড করা
- ✅ ফিডব্যাক ও মন্তব্য যোগ করা
- ✅ ব্যবহারকারীদের রেড-ফ্ল্যাগ দেওয়া
- ✅ অভিযোগ পর্যালোচনা
- ✅ ড্যাশবোর্ড পরিসংখ্যান

### প্রধান কার্যালয় (Head Office)
- ✅ চূড়ান্ত আবেদন অনুমোদন/প্রত্যাখ্যান
- ✅ পেনশন সার্টিফিকেট জেনারেশন
- ✅ সকল ব্যবহারকারী ও আবেদন পরিচালনা
- ✅ অভিযোগ নিষ্পত্তি ও রেজোলিউশন
- ✅ রেড-ফ্ল্যাগ সিস্টেম পরিচালনা
- ✅ অ্যাকাউন্ট সক্রিয়/নিষ্ক্রিয় করা
- ✅ সিস্টেম-ওয়াইড রিপোর্ট ও অ্যানালিটিক্স

### সিস্টেম-ওয়াইড ফিচার
- 🌐 বাংলা ও ইংরেজি দ্বিভাষিক সমর্থন (i18n)
- 🌙 ডার্ক মোড / লাইট মোড
- 🔒 JWT-ভিত্তিক নিরাপদ অথেনটিকেশন
- 📧 ইমেইল নোটিফিকেশন (Nodemailer)
- 📁 ফাইল আপলোড (PDF, JPG, PNG — সর্বোচ্চ 10MB)
- 📊 পেনশন পরিমাণ স্বয়ংক্রিয় গণনা
- 🛡️ API Rate Limiting ও Security Headers

---

## 🔐 নিরাপত্তা (Security Features)

| ফিচার | বিবরণ |
|-------|--------|
| **JWT Authentication** | JSON Web Token দিয়ে সেশন ম্যানেজমেন্ট |
| **bcryptjs** | পাসওয়ার্ড হ্যাশিং (10 rounds) |
| **Helmet.js** | HTTP Security Headers |
| **Rate Limiting** | 15 মিনিটে সর্বোচ্চ 100 রিকোয়েস্ট |
| **Input Validation** | express-validator দিয়ে সকল ইনপুট যাচাই |
| **File Type Validation** | শুধুমাত্র PDF, JPG, JPEG, PNG অনুমোদিত |
| **Role-Based Access** | প্রতিটি রোলের জন্য আলাদা অ্যাক্সেস নিয়ন্ত্রণ |
| **CORS** | Cross-Origin Resource Sharing কনফিগারেশন |
| **Email Validation** | শুধুমাত্র gmail.com, yahoo.com, .bd ডোমেইন গ্রহণযোগ্য |

---

## 🔄 অ্যাপ্লিকেশন ওয়ার্কফ্লো (Application Workflow)

```
পেনশন হোল্ডার          সহকারী হিসাবরক্ষক        প্রধান কার্যালয়
      │                        │                        │
      ▼                        │                        │
  আবেদন দাখিল                 │                        │
  [Status: Pending]            │                        │
      │                        │                        │
      │───────────────────────►│                        │
      │                   আবেদন যাচাই                  │
      │                   ফরওয়ার্ড/ফিডব্যাক             │
      │                  [Status: Forwarded]            │
      │                        │                        │
      │                        │───────────────────────►│
      │                        │                 চূড়ান্ত পর্যালোচনা
      │                        │                 অনুমোদন/প্রত্যাখ্যান
      │                        │           [Status: Approved/Rejected]
      │                        │                        │
      │◄───────────────────────────────────────────────│
  নোটিফিকেশন পাওয়া                                     │
  সার্টিফিকেট ডাউনলোড                                  │
```

---

## 🚀 প্রজেক্ট চালানোর নিয়ম (Setup & Installation)

### পূর্বশর্ত (Prerequisites)
- Node.js v16 বা তার উপরে
- npm v8 বা তার উপরে
- MongoDB Atlas অ্যাকাউন্ট (অথবা লোকাল MongoDB)

### Backend চালানো

```bash
cd backend
npm install
npm run dev        # Development (nodemon)
npm start          # Production
```

Backend চলবে: `http://localhost:5000`

### Frontend চালানো

```bash
cd frontend
npm install
npm run dev        # Development
npm run build      # Production build
```

Frontend চলবে: `http://localhost:5173`

---

## 🌐 Environment Configuration (`.env`)

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key

# Server Port
PORT=5000

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Environment
NODE_ENV=development
```

---

## 📊 প্রজেক্ট ডায়াগ্রামসমূহ (Project Diagrams)

> 📁 সকল ডায়াগ্রাম `Diagram/` ফোল্ডারে পাওয়া যাবে।

| ডায়াগ্রাম | বিবরণ |
|-----------|--------|
| **System Architecture Diagram** | সিস্টেমের সামগ্রিক আর্কিটেকচার |
| **ER Diagram** | ডেটাবেজ সত্তা সম্পর্ক চিত্র (4 Collections) |
| **Data Flow Diagram (DFD)** | ডেটা প্রবাহ চিত্র |
| **Context Diagram** | প্রজেক্টের প্রসঙ্গ চিত্র |
| **Use Case Diagram** | ব্যবহারকারীর ব্যবহার ক্ষেত্র |

---

## 📦 ডিপেন্ডেন্সি সারাংশ (Dependencies)

### Backend
```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-rate-limit": "^6.10.0",
  "express-validator": "^7.0.1",
  "helmet": "^7.0.0",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^7.5.0",
  "multer": "^1.4.5-lts.1",
  "nodemailer": "^10.1.1",
  "pdf-lib": "^1.17.1",
  "sharp": "^0.35.5"
}
```

### Frontend
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "react-i18next": "^15.0.1",
  "i18next": "^23.15.1",
  "lucide-react": "^0.445.0",
  "react-hook-form": "^7.53.0",
  "react-hot-toast": "^2.4.1",
  "date-fns": "^3.6.0",
  "jspdf": "^2.5.1",
  "html2canvas": "^1.4.1"
}
```

---

## 👨‍💻 ডেভেলপমেন্ট টিম (Team)

| পদবী | বিবরণ |
|------|--------|
| **University** | UIBT — University of Information Technology & Business |
| **Department** | Computer Science and Engineering |
| **Team** | PensionProBD Team |
| **License** | MIT |

---

## 📌 ভবিষ্যৎ পরিকল্পনা (Future Scope)

- [ ] মোবাইল অ্যাপ (React Native)
- [ ] SMS নোটিফিকেশন সিস্টেম
- [ ] সরকারি NID যাচাই API ইন্টিগ্রেশন
- [ ] অনলাইন পেমেন্ট গেটওয়ে ইন্টিগ্রেশন
- [ ] রিপোর্ট এক্সপোর্ট (Excel, PDF)
- [ ] Super Admin প্যানেল
- [ ] অডিট লগ সিস্টেম
- [ ] AI-চালিত পেনশন পরিমাণ গণনা

---

## 📄 লাইসেন্স (License)

এই প্রজেক্টটি **MIT License** এর অধীনে প্রকাশিত।

---

<div align="center">

**🏛️ PensionProBD — ডিজিটাল পেনশন, সহজ জীবন**

*Built with ❤️ for Digital Bangladesh*

</div>