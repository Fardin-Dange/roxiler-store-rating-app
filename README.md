# Store Rating Platform

A Full Stack Web Application that allows users to submit and manage ratings for stores registered on the platform. The application implements role-based access control with three user roles: Administrator, Normal User, and Store Owner.

Built using React.js, Express.js, MySQL, JWT Authentication, and Node.js as part of the Full Stack Developer Coding Challenge.

---

## Features

### System Administrator

#### Dashboard

* View Total Users
* View Total Stores
* View Total Ratings

#### User Management

* Add Normal Users
* Add Admin Users
* Add Store Owners
* View All Users
* View User Details
* Delete Users

#### User Filters

* Name
* Email
* Address
* Role

#### User Sorting

* ID
* Name
* Email
* Address
* Role

#### Store Management

* Add Stores
* View Stores
* View Store Details
* Delete Stores

#### Store Filters

* Store Name
* Email
* Address

#### Store Sorting

* ID
* Name
* Email
* Address

#### Account

* Change Password
* Logout

---

### Normal User

#### Authentication

* Sign Up
* Login

#### Store Features

* View All Registered Stores
* Search Stores by Name
* Search Stores by Address
* View Overall Store Rating
* View Own Submitted Rating
* Submit Rating (1–5)
* Modify Existing Rating

#### Account

* Change Password
* Logout

---

### Store Owner

#### Dashboard

* View Average Store Rating
* View Users Who Submitted Ratings
* View Submitted Ratings

#### Account

* Change Password
* Logout

---

## Technology Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt

### Database

* MySQL

---

## Project Structure

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

## Database Setup

### Create Database

```sql
CREATE DATABASE store_rating_platform;
```

### Import Schema

```bash
mysql -u root -p store_rating_platform < database.sql
```

Or import using MySQL Workbench.

---

## Backend Setup

### Navigate to Backend

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
JWT_SECRET=your_secret_key
```

### Configure Database

Update:

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

### Start Backend Server

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

---

## Frontend Setup

### Navigate to Frontend

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Start Frontend

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Authentication & Authorization

JWT-based Authentication is implemented.

Supported Roles:

```text
admin
user
store_owner
```

Security includes:

* JWT Middleware
* Role-Based Authorization
* Protected Routes

---

## API Endpoints

### Authentication

| Method | Endpoint         |
| ------ | ---------------- |
| POST   | /signup          |
| POST   | /login           |
| PUT    | /change-password |
| POST   | /logout          |

### Ratings

| Method | Endpoint          |
| ------ | ----------------- |
| POST   | /ratings          |
| PUT    | /ratings/:storeId |

### Stores

| Method | Endpoint          |
| ------ | ----------------- |
| GET    | /stores           |
| POST   | /stores           |
| GET    | /admin/stores/:id |
| DELETE | /admin/stores/:id |

### Admin

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /admin/dashboard |
| GET    | /admin/users     |
| GET    | /admin/users/:id |
| POST   | /admin/users     |
| DELETE | /admin/users/:id |

### Store Owner

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /owner/dashboard |

---

## Validation Rules

### Name

* Minimum: 20 Characters
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

Allowed Values:

```text
1, 2, 3, 4, 5
```

---

## Demo Credentials

### Administrator

```text
Email: admin@example.com
Password: Admin@123
```

### Store Owner

```text
Email: owner@example.com
Password: Owner@123
```

### Normal User

```text
Email: user@example.com
Password: User@123
```

Update these credentials according to your database records before submission.

---

## Screenshots

Add screenshots of:

* Login Page
* Admin Dashboard
* User Store Listing
* Store Owner Dashboard
* Rating Submission Screen

---

## Security Features

* Password Hashing using bcrypt
* JWT Authentication
* Role-Based Access Control
* Protected Routes
* Input Validation
* Form Validation
* One Rating Per User Per Store Constraint

---

## Future Improvements

* Pagination
* Email Verification
* Forgot Password
* Profile Management
* Store Analytics
* Rating Trends

---

## Author

Saleem Dange

BE Computer Engineering (2026 Batch)

---

## License

This project was developed for educational purposes and internship assessment evaluation.
