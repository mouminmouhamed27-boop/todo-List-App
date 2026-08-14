# Todo API

A RESTful Todo API built with **Node.js** and **Express.js**, following a clean **MVC-style architecture**.

The project was built to practice backend fundamentals such as routing, controllers, models, CRUD operations, HTTP methods, request/response handling, validation, and API design.

The project currently uses an **in-memory array** as temporary data storage. MongoDB integration is planned as a future enhancement.

---

## 🚀 Technologies Used

* Node.js
* Express.js
* JavaScript
* REST API
* MVC-style Architecture
* JSON

---

## 🏗️ Project Architecture

The application is organized into separate layers to keep responsibilities clear and make the project easier to maintain and extend.

```text
todo-api/
│
├── controllers/
│   └── todoController.js
│
├── models/
│   └── todoModel.js
│
├── routes/
│   └── todoRoutes.js
│
├── app.js
├── package.json
└── package-lock.json
```

### Model

Responsible for working with Todo data and performing data operations.

### Controller

Responsible for handling HTTP requests, validating incoming data, communicating with the Model, and sending API responses.

### Routes

Responsible for mapping HTTP methods and endpoints to the appropriate Controller functions.

---

# ✅ Implemented Features

## 1. RESTful API

The project follows REST principles and provides endpoints for managing Todo items.

---

## 2. CRUD Operations

The API currently supports the complete CRUD cycle:

### Create

Create a new Todo using:

```http
POST /todos
```

Example request:

```json
{
  "title": "Learn MongoDB"
}
```

Example response:

```json
{
  "success": true,
  "data": {
    "id": 4,
    "title": "Learn MongoDB",
    "completed": false
  }
}
```

---

### Read All Todos

Retrieve all Todo items:

```http
GET /todos
```

---

### Read Todo by ID

Retrieve a specific Todo:

```http
GET /todos/:id
```

Example:

```http
GET /todos/2
```

If the Todo does not exist, the API returns:

```http
404 Not Found
```

---

### Update

Update an existing Todo:

```http
PATCH /todos/:id
```

Example:

```json
{
  "completed": true
}
```

The API supports updating Todo properties such as the title and completion status.

---

### Delete

Delete a Todo:

```http
DELETE /todos/:id
```

Example:

```http
DELETE /todos/3
```

---

# 🔍 Validation

Basic request validation has been added to protect the API from invalid input.

For example, when creating a Todo:

* `title` is required.
* `title` must be a string.
* Empty titles are rejected.
* Titles containing only whitespace are rejected.

Invalid requests return an appropriate:

```http
400 Bad Request
```

The same validation approach will be extended to update operations.

---

# 📡 HTTP Status Codes

The API uses meaningful HTTP status codes based on the result of each operation.

Examples include:

```text
200 OK
201 Created
400 Bad Request
404 Not Found
500 Internal Server Error
```

The goal is to make the API responses predictable and easy for frontend applications to consume.

---

# 📦 API Response Structure

API responses use a consistent JSON structure.

Successful responses follow a structure similar to:

```json
{
  "success": true,
  "data": {}
}
```

Error responses follow a structure similar to:

```json
{
  "success": false,
  "message": "Todo not found"
}
```

This makes the API easier to consume from frontend applications.

---

# 🔄 Request Flow

A typical request follows this flow:

```text
Client / Frontend
       ↓
HTTP Request
       ↓
Express
       ↓
Routes
       ↓
Controller
       ↓
Model
       ↓
Data
       ↓
Model
       ↓
Controller
       ↓
JSON Response
       ↓
Client / Frontend
```

For example:

```text
GET /todos
    ↓
todoRoutes.js
    ↓
todoController.js
    ↓
todoModel.js
    ↓
Todos Data
    ↓
JSON Response
```

---

# 🗄️ Current Data Storage

The project currently uses an in-memory JavaScript array as temporary storage.

Example:

```js
[
  {
    id: 1,
    title: "Learn Node.js",
    completed: false
  },
  {
    id: 2,
    title: "Learn Express",
    completed: false
  }
]
```

This approach is intentional for the current learning stage.

Because the data is stored in memory, it will be lost when the server restarts.

---

# 🔮 Planned Features

The project is designed to be extended gradually into a more realistic backend application.

## 1. MongoDB Integration

Replace the temporary in-memory array with MongoDB.

Planned architecture:

```text
Controller
    ↓
Model
    ↓
MongoDB
```

This will provide persistent data storage.

---

## 2. Improved Validation

Expand validation for all endpoints.

Planned validation includes:

* Todo title type validation
* Empty title validation
* `completed` Boolean validation
* Validation for PATCH requests
* Better validation error messages

---

## 3. Centralized Error Handling

Introduce a global Express error-handling middleware instead of handling every error independently inside each Controller.

Planned flow:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Error
   ↓
Global Error Handler
   ↓
JSON Error Response
```

---

## 4. Search

Add the ability to search Todos by title.

Example:

```http
GET /todos?search=node
```

---

## 5. Filtering

Allow filtering Todos by completion status.

Examples:

```http
GET /todos?completed=true
```

```http
GET /todos?completed=false
```

---

## 6. Pagination

Add pagination for large datasets.

Example:

```http
GET /todos?page=1&limit=10
```

Possible response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

---

## 7. Sorting

Allow Todo items to be sorted using query parameters.

Example:

```http
GET /todos?sort=title
```

---

## 8. Middleware

Introduce reusable middleware for tasks such as:

* Request logging
* Validation
* Authentication
* Error handling

---

## 9. Authentication & Authorization

Add user authentication using:

* User registration
* Login
* Password handling
* JWT authentication
* Protected routes

Eventually, each user will have access only to their own Todo items.

---

## 10. Environment Variables

Use environment variables for configuration and sensitive information.

Examples:

```text
PORT
MONGODB_URI
JWT_SECRET
```

This will help keep configuration and secrets outside the source code.

---

## 11. Security Improvements

Planned security improvements include:

* CORS configuration
* Helmet
* Rate limiting
* Secure environment configuration
* Better request validation

---

## 12. API Documentation

Add API documentation using a tool such as Swagger / OpenAPI so that available endpoints, request bodies, responses, and status codes can be easily understood and tested.

---

## 13. Testing

Add automated tests for:

* Routes
* Controllers
* Validation
* CRUD operations
* Error handling

The goal is to make the API more reliable and easier to maintain as new features are added.

---

# 📌 Current API Endpoints

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| GET    | `/todos`     | Get all Todos     |
| GET    | `/todos/:id` | Get a Todo by ID  |
| POST   | `/todos`     | Create a new Todo |
| PATCH  | `/todos/:id` | Update a Todo     |
| DELETE | `/todos/:id` | Delete a Todo     |

---

# 🎯 Project Goals

This project is being developed as a practical backend learning project to understand how a real REST API is structured and how different backend layers communicate with each other.

The main goals are:

* Understand Node.js and Express.js
* Practice REST API development
* Apply MVC-style architecture
* Understand HTTP methods and status codes
* Implement CRUD operations
* Handle request validation
* Design consistent JSON responses
* Connect a backend application to MongoDB
* Add authentication and security
* Practice building scalable backend features

---

# 📈 Project Roadmap

```text
✅ Project Setup
✅ Express Server
✅ MVC-style Structure
✅ GET /todos
✅ GET /todos/:id
✅ POST /todos
✅ PATCH /todos/:id
✅ DELETE /todos/:id
✅ Basic Validation

⬜ Improved Validation
⬜ Centralized Error Handling
⬜ Search
⬜ Filtering
⬜ Pagination
⬜ Sorting
⬜ MongoDB Integration
⬜ Middleware
⬜ Authentication & Authorization
⬜ Environment Variables
⬜ Security Improvements
⬜ API Documentation
⬜ Automated Testing
```

---

## 👨‍💻 Learning Project

This project is being developed incrementally, with each feature added to strengthen practical backend development skills and build a better understanding of how production-style APIs are designed.
