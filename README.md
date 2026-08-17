# Todo List App — Full-Stack Authentication & Secure Task Management

A full-stack Todo application built with **Node.js**, **Express.js**, **MongoDB/Mongoose**, **JWT authentication**, **bcrypt password hashing**, and a lightweight browser frontend.

The project started as a simple RESTful Todo API and was extended into a multi-user application where every task belongs to an authenticated user. The application is designed to run locally and is also deployed to **Vercel** with **MongoDB Atlas** as the hosted database.

> **Live Production:** https://todo-list-app-wffe.vercel.app

---

## 📌 Project Overview

The application supports:

- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- Protected task endpoints
- User-owned tasks
- Full Todo CRUD operations
- Server-side validation
- Centralized error handling
- MongoDB persistence
- Production deployment on Vercel
- MongoDB Atlas integration
- Environment-based secret management
- A simple Arabic/RTL frontend

The main security goal is not only to authenticate users, but also to make sure that an authenticated user can access and modify **only their own tasks**.

---

## ✨ Features

### Authentication

- `POST /auth/register` — create a new account
- `POST /auth/login` — authenticate an existing user
- Passwords are never stored as plain text
- Password hashing uses **bcryptjs** with a work factor of `12`
- JWT access tokens are issued after successful authentication
- Authentication is checked by middleware before protected Todo operations
- Invalid login attempts return a generic authentication message instead of exposing whether an email exists

### User Management

Each user contains data conceptually similar to:

```text
User
├── id
├── name
├── email
├── passwordHash
├── createdAt
└── updatedAt
```

The password field stored in the database is a bcrypt hash rather than the original password.

### User-Owned Tasks

Each task belongs to one authenticated user:

```text
Task
├── id
├── title
├── description
├── completed
├── userId
├── createdAt
└── updatedAt
```

This creates a logical relationship of:

```text
User 1 ──────────── N Tasks
```

A user can see, edit, complete, and delete only tasks associated with their own `userId`.

### Todo CRUD

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/todos` | Get the current user's tasks | ✅ |
| GET | `/todos/:id` | Get one task owned by the current user | ✅ |
| POST | `/todos` | Create a task for the current user | ✅ |
| PATCH | `/todos/:id` | Update a task owned by the current user | ✅ |
| DELETE | `/todos/:id` | Delete a task owned by the current user | ✅ |

The frontend also includes:

- Create task form
- Complete/uncomplete task
- Inline title editing
- Delete task
- Automatic task numbering in the UI
- User greeting
- Logout button
- Connection status indicator
- Error banner for failed API operations

---

# 🔐 Security Implementation

Security was treated as part of the application design rather than as an afterthought.

## 1. Password Hashing with bcrypt

Passwords are **hashed**, not encrypted.

Registration flow:

```text
Plain password
      ↓
bcrypt.hash(password, 12)
      ↓
Password hash
      ↓
MongoDB
```

Login flow:

```text
Submitted password
      ↓
bcrypt.compare(password, storedHash)
      ↓
true / false
```

### Why hashing instead of encryption?

A password should not be recoverable from the database. The application only needs to verify whether the supplied password matches the stored hash.

The database should contain a value similar to:

```text
$2b$12$...
```

not the original password.

---

## 2. Passwords Are Not Returned by Normal User Queries

The user password field is intentionally excluded from normal queries and is explicitly requested only when needed for authentication.

This reduces the chance of accidentally returning password hashes in API responses.

---

## 3. JWT Authentication

After successful login, the server issues a signed JWT access token.

General flow:

```text
Login
  ↓
Validate credentials
  ↓
bcrypt.compare()
  ↓
Create signed JWT
  ↓
Return accessToken
  ↓
Client sends:
Authorization: Bearer <token>
```

The token identifies the authenticated user and is verified by the backend before protected Todo operations.

### Important JWT note

JWTs are **signed, not encrypted by default**. Sensitive secrets or passwords must never be placed inside a normal JWT payload.

---

## 4. JWT Secret Management

The JWT secret is never committed to GitHub.

It is stored as an environment variable:

```env
JWT_SECRET=your-secret
```

In production, the value is managed through **Vercel Environment Variables**.

---

## 5. Authentication Middleware

Protected requests pass through authentication middleware that:

1. Reads the `Authorization` header.
2. Extracts the Bearer token.
3. Verifies the JWT signature.
4. Extracts the current user identity.
5. Stores the authenticated user information on the request.
6. Allows the request to continue only if authentication succeeds.

Conceptually:

```text
HTTP Request
    ↓
Authorization: Bearer <JWT>
    ↓
JWT verification
    ↓
req.user
    ↓
Controller / Service
```

Unauthenticated requests to protected resources return `401 Unauthorized`.

---

## 6. User Ownership / Authorization

Authentication alone is not enough.

The application also checks **authorization** for every task operation.

A task query is conceptually filtered like:

```js
{
  _id: taskId,
  userId: req.user.id
}
```

This means a user cannot access another user's task simply by knowing its ID.

For example:

```text
Momen
 ├── Learn JavaScript
 ├── Learn Node.js
 └── Build API

Ahmed
 ├── Study NestJS
 └── Finish project
```

Momen cannot update or delete Ahmed's tasks.

This protects against a common authorization problem often described as **IDOR / Broken Object Level Authorization**.

---

## 7. The Client Does Not Choose the Task Owner

When creating a task, the frontend sends only task data such as:

```json
{
  "title": "Learn TypeScript"
}
```

The client is not trusted to send:

```json
{
  "title": "Learn TypeScript",
  "userId": "someone-else"
}
```

The backend derives the owner from the authenticated user context instead.

This prevents users from attempting to create tasks under another user's account.

---

## 8. Server-Side Validation

Validation is performed on the backend rather than relying only on browser-side HTML validation.

Examples include:

### Registration

- Name required
- Valid email format
- Password required
- Password minimum length
- Validation of request structure

### Login

- Email required
- Password required

### Tasks

- Title required
- Title must contain valid text
- Invalid task payloads are rejected

Invalid input returns an appropriate client error such as:

```text
400 Bad Request
```

---

## 9. Generic Login Errors

The login flow avoids exposing unnecessary information such as whether a specific email address exists.

Instead of returning different messages like:

```text
Email does not exist
```

and:

```text
Wrong password
```

the application can return a generic authentication failure such as:

```text
Invalid email or password
```

This reduces the risk of user/account enumeration.

---

## 10. HTTPS in Production

The production application is served through the Vercel HTTPS domain:

```text
https://todo-list-app-wffe.vercel.app
```

This provides encrypted transport between the browser and the deployed application.

---

## 11. Environment Variables and Secrets

Secrets are kept outside the source code.

Production variables include:

```env
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
```

The local environment file is ignored by Git and should **never** be committed.

Example file:

```text
Backend/.env.example
```

Real secrets belong in:

- Local `.env` for development
- Vercel Environment Variables for production

---

## 12. MongoDB Atlas Network Access

The production deployment uses **MongoDB Atlas** instead of a local MongoDB instance.

The Vercel deployment cannot connect to:

```text
mongodb://127.0.0.1:27017/todoapp
```

because that address refers to the local machine.

The production connection uses a hosted Atlas connection string:

```text
mongodb+srv://...
```

The Atlas project also needs an appropriate IP access configuration for the Vercel deployment.

> For simple Vercel deployments, allowing `0.0.0.0/0` can be used when necessary because Vercel's outbound IPs can be dynamic. This is broader than an ideal enterprise network policy, so strong database credentials and least-privilege database permissions remain important.

---

# 🧱 Architecture

The application follows a layered Express structure:

```text
Browser / Frontend
        │
        ▼
      Express
        │
   ┌────┴────┐
   │         │
 Auth API   Todo API
   │         │
   ▼         ▼
Controllers / Middleware
        │
        ▼
      Services
        │
        ▼
      Mongoose
        │
        ▼
   MongoDB Atlas
```

The current project structure is organized around the backend and frontend responsibilities:

```text
todo-fullstack/
│
├── Backend/
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── todoController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── userModel.js
│   │   └── todoModel.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── todoRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   └── taskService.js
│   │
│   ├── utils/
│   │   ├── jwt.js
│   │   └── password.js
│   │
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── taskValidator.js
│   │
│   ├── API_DOCS.md
│   ├── .env.example
│   └── server.js
│
├── frontend/
│   ├── login.html
│   ├── register.html
│   ├── index.html
│   └── auth.js
│
├── app.js
├── package.json
├── package-lock.json
└── .gitignore
```

> The exact file naming can evolve, but the responsibilities stay separated: routes → controllers → services → models/database, with middleware handling cross-cutting concerns such as authentication and errors.

---

# 📡 API

## Authentication

### Register

```http
POST /auth/register
Content-Type: application/json
```

Request:

```json
{
  "name": "Momen",
  "email": "momen@example.com",
  "password": "12345678"
}
```

The backend validates the request, hashes the password with bcrypt, creates the user, and returns authentication data according to the current API implementation.

### Login

```http
POST /auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "momen@example.com",
  "password": "12345678"
}
```

Successful login returns an access token.

---

## Protected Task API

Every protected Todo request should include:

```http
Authorization: Bearer <accessToken>
```

### Get current user's tasks

```http
GET /todos
```

### Get one task

```http
GET /todos/:id
```

The task must belong to the authenticated user.

### Create task

```http
POST /todos
Content-Type: application/json
Authorization: Bearer <accessToken>
```

Request:

```json
{
  "title": "Learn TypeScript"
}
```

The server determines the task owner from the authenticated user.

### Update task

```http
PATCH /todos/:id
Content-Type: application/json
Authorization: Bearer <accessToken>
```

Example:

```json
{
  "completed": true
}
```

or:

```json
{
  "title": "Learn TypeScript deeply"
}
```

### Delete task

```http
DELETE /todos/:id
Authorization: Bearer <accessToken>
```

---

## Health Check

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "API is running"
}
```

---

# 🔄 Authentication Flow

```text
              Register
                 │
                 ▼
          Validate input
                 │
                 ▼
        bcrypt password hash
                 │
                 ▼
           Create User
                 │
                 ▼
            JWT issued
                 │
                 ▼
              Login
                 │
                 ▼
        bcrypt.compare()
                 │
                 ▼
            JWT issued
                 │
                 ▼
        Authorization header
                 │
                 ▼
       Authentication middleware
                 │
                 ▼
              req.user
                 │
                 ▼
          Protected Todo API
                 │
                 ▼
          MongoDB / userId filter
```

---

# 🖥️ Frontend

The frontend is a lightweight HTML/CSS/JavaScript interface served by the same Express application.

### Pages

```text
/login
/register
/tasks
```

### Frontend responsibilities

- Collect registration and login credentials
- Store the access token used by the current implementation
- Send Bearer authorization headers
- Show current user information
- Create and display tasks
- Mark tasks complete
- Edit task titles inline
- Delete tasks
- Automatically number visible tasks
- Show connection state
- Display API errors in the UI
- Logout and clear local authentication state

---

# 🚀 Local Development

## Requirements

- Node.js 18+
- npm
- MongoDB locally or MongoDB Atlas

## Install

```bash
npm install
```

## Environment Variables

Create:

```text
Backend/.env
```

Example:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/todoapp
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

For MongoDB Atlas, use the Atlas connection string instead:

```env
MONGODB_URI=mongodb+srv://...
```

## Run in development

```bash
npm run dev
```

## Run in production mode locally

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

# ☁️ Deployment

The application is deployed to **Vercel**.

Deployment architecture:

```text
GitHub
  │
  ▼
todo-fullstack branch
  │
  ▼
Vercel Production
  │
  ├── Frontend
  └── Express API
         │
         ▼
     MongoDB Atlas
```

## Production Environment Variables

Configure these in Vercel:

```text
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
```

Recommended production environment:

```text
Production
```

After changing environment variables, redeploy the project so the new values are available to the deployed functions.

---

# 🔒 Security Status

## Implemented

- ✅ bcrypt password hashing
- ✅ Passwords are not stored in plain text
- ✅ Password hashes are excluded from normal user queries
- ✅ JWT authentication
- ✅ Protected Todo endpoints
- ✅ Server-side request validation
- ✅ User ownership checks on task operations
- ✅ User ID derived from authenticated context instead of trusting client input
- ✅ Generic authentication failure messages
- ✅ Secrets stored in environment variables
- ✅ `.env` excluded from Git
- ✅ HTTPS in Vercel production
- ✅ MongoDB Atlas for hosted database access
- ✅ Centralized error handling

## Recommended next security improvements

These are **not claimed as fully implemented features** in the current version and are good next steps for a stronger production-grade authentication system:

- ⏳ Move access tokens from localStorage to **HttpOnly + Secure + SameSite cookies**
- ⏳ Add login/register **rate limiting** and brute-force protection
- ⏳ Add **Helmet** / security headers
- ⏳ Restrict CORS to the exact production origin instead of allowing broad origins
- ⏳ Add refresh-token rotation and revocation strategy
- ⏳ Add password reset flow
- ⏳ Add email verification
- ⏳ Add stronger password policy if required by the product
- ⏳ Add security-focused tests for authentication and authorization
- ⏳ Add audit logging for sensitive security events

---

# 🧪 Suggested Security Test Cases

Before calling the authentication system production-ready, test cases like:

### Authentication

- Register with a duplicate email
- Register with an invalid email
- Register with a weak/short password
- Login with a wrong password
- Login with a non-existing email
- Access `/todos` without a token
- Access `/todos` with an invalid token
- Access `/todos` with an expired token

### Authorization

- User A attempts to read User B's task
- User A attempts to update User B's task
- User A attempts to delete User B's task
- User A attempts to create a task for User B by sending a forged `userId`

### Input Validation

- Empty task title
- Whitespace-only task title
- Unexpected fields
- Invalid MongoDB IDs
- Malformed JSON payloads

---

# 🛠️ Tech Stack

## Backend

- Node.js
- Express.js
- Mongoose
- MongoDB / MongoDB Atlas
- JWT (`jsonwebtoken`)
- bcryptjs
- express-validator
- dotenv
- CORS

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- RTL Arabic interface

## Deployment

- GitHub
- Vercel
- MongoDB Atlas

---

# 🎯 What This Project Demonstrates

This project demonstrates practical backend and full-stack concepts including:

- REST API design
- HTTP methods and status codes
- MVC-style separation of responsibilities
- Authentication vs authorization
- Password hashing
- JWT-based sessions/tokens
- Middleware in Express
- MongoDB/Mongoose data modeling
- One-to-many user/task relationships
- Object-level authorization
- Validation
- Error handling
- Environment configuration
- Deployment and production debugging
- Connecting Vercel serverless execution to MongoDB Atlas

---

# 📚 Learning Notes

A few important concepts demonstrated by the project:

### Hashing ≠ Encryption

Passwords should normally be hashed and verified, not encrypted and later decrypted.

### JWT ≠ Encryption

A standard JWT provides a signed token. Its payload should not be treated as secret data.

### Authentication ≠ Authorization

Authentication answers:

> Who are you?

Authorization answers:

> Are you allowed to access this resource?

The Todo ownership checks are the authorization layer in this project.

---

# 👨‍💻 Author

**Momen Mohammed**

Built as a practical full-stack project to learn and apply:

- Express.js
- REST APIs
- MongoDB
- Authentication
- Security fundamentals
- Deployment

---

# ⭐ Future Improvements

Possible future roadmap:

- Search
- Filtering
- Pagination
- Sorting
- Better task descriptions
- Tags/categories
- Password reset
- Email verification
- Refresh tokens
- Rate limiting
- Security headers
- Automated tests
- API documentation with Swagger/OpenAPI
- CI/CD checks

---

## License

This project is currently intended as a learning/portfolio project.
