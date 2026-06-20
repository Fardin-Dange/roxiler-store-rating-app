# Store Rating Platform

A Full Stack Web Application that allows users to rate stores registered on the platform. The application supports role-based access control for Administrators, Normal Users, and Store Owners.

Built as part of the Full Stack Intern Coding Challenge using React.js, Express.js, MySQL, JWT Authentication, and Node.js.

---

# Features

## System Administrator

### Dashboard

* View Total Users
* View Total Stores
* View Total Ratings

### User Management

* Add Normal Users
* Add Admin Users
* Add Store Owners
* View All Users
* View User Details
* Delete Users
* Filter Users by:

  * Name
  * Email
  * Address
  * Role
* Sort Users by:

  * ID
  * Name
  * Email
  * Address
  * Role

### Store Management

* Add Stores
* View Stores
* View Store Details
* Delete Stores
* Filter Stores by:

  * Store Name
  * Email
  * Address
* Sort Stores by:

  * ID
  * Name
  * Email
  * Address

### Account

* Change Password
* Logout

---

## Normal User

### Authentication

* Sign Up
* Login

### Store Features

* View All Stores
* Search Stores by Name
* Search Stores by Address
* View Overall Store Rating
* View Own Submitted Rating
* Submit Rating (1-5)
* Modify Existing Rating

### Account

* Change Password
* Logout

---

## Store Owner

### Dashboard

* View Store Average Rating
* View Users Who Rated Store
* View Submitted Ratings

### Account

* Change Password
* Logout

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* CSS

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt

## Database

* MySQL

---

# Project Structure

```text
Store_Rating_Platform/

├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── database.sql
├── README.md
└── .gitignore
```

---

# Database Setup

## Step 1: Create Database

```sql
CREATE DATABASE store_rating_platform;
```

---

## Step 2: Import Schema

Option 1

```bash
mysql -u root -p store_rating_platform < database.sql
```

Option 2 (MySQL Workbench)

```text
Server
→ Data Import
→ Import from Self-Contained File
→ Select database.sql
→ Start Import
```

---

# Backend Setup

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

## Create Environment File

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
JWT_SECRET=your_secret_key
```

---

## Configure Database

Update:

```text
backend/config/db.js
```

Example:

```javascript
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_password",
    database: "store_rating_platform"
});

module.exports = db;
```

---

## Start Backend Server

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

---

# Frontend Setup

## Navigate to Frontend

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

## Start Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Authentication & Authorization

JWT-based authentication is implemented.

Supported Roles:

```text
admin
user
store_owner
```

Protected routes are secured using:

* JWT Middleware
* Role-Based Authorization Middleware

---

# API Endpoints

## Authentication

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /signup          |
| POST   | /login           |
| PUT    | /change-password |
| POST   | /logout          |

---

## Ratings

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | /ratings          |
| PUT    | /ratings/:storeId |

---

## Stores

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /stores           |
| POST   | /stores           |
| GET    | /admin/stores/:id |
| DELETE | /admin/stores/:id |

---

## Admin

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /admin/dashboard |
| GET    | /admin/users     |
| GET    | /admin/users/:id |
| POST   | /admin/users     |
| DELETE | /admin/users/:id |

---

## Store Owner

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /owner/dashboard |

---

# Validation Rules

## User

### Name

* Minimum: 3 Characters
* Maximum: 60 Characters

### Address

* Maximum: 400 Characters

### Password

* Minimum: 8 Characters
* Maximum: 16 Characters
* Must contain:

  * One Uppercase Letter
  * One Special Character

### Email

* Valid Email Format Required

### Ratings

* Allowed Range:

  * 1
  * 2
  * 3
  * 4
  * 5

---

# Screenshots

Add screenshots before submission.

Recommended Screenshots:

* Login Page
* Signup Page
* Admin Dashboard
* Admin User Management
* Admin Store Management
* User Store Listing
* Rating Submission
* Owner Dashboard
* Change Password Modal

---

# Security Features

* Password Hashing using bcrypt
* JWT Authentication
* Role-Based Access Control
* Protected Routes
* Unique User Rating Constraint
* Input Validation
* Form Validation

---

# Future Improvements

* Pagination
* Email Verification
* Forgot Password
* Profile Management
* Store Analytics
* Rating Trends

---

# Author

**Saleem Dange**

BE Computer Engineering

2026 Batch

---

# License

This project was developed for educational and internship assessment purposes.
