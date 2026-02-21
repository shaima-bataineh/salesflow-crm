# SalesFlow Backend API
Session 29 – Error Handling & Postman
 # Date: 16-02-2026

 # Assignment Requirement

The main goal of this assignment was to:

- Implement centralized error handling in an Express.js application.
- Use middleware to manage all errors in one place.
- Modify controllers to use next(error).
- Test all API endpoints using Postman.
- (Bonus) Implement a custom error class.

 # Created a dedicated file:

middleware/errorHandler.js

Handles:
- 400 → Bad Request
- 401 → Unauthorized
- 403 → Forbidden
- 404 → Not Found
- 500 → Internal Server Error

All errors are returned in a unified JSON format.

##  Project Overview
This project is a Backend API built using Node.js, Express, and MongoDB.

It includes authentication, role-based access control, dashboard statistics, and centralized error handling.

The goal of this assignment was to implement professional API error handling and test all scenarios using Postman.

##  Features

- User Authentication (Register / Login / Logout)
- JWT-based authentication with cookies
- Role-based authorization (Admin / Sales)
- Customers CRUD
- Deals CRUD
- Dashboard statistics
- Centralized Error Handling
- Custom Error Class (Bonus)
- Postman collection testing

## Authentication

- JWT Token stored in HTTP-only cookies
- Middleware verifies token
- Role-based access control supported

## Dashboard

The dashboard endpoint provides:

- Total Users
- Total Customers
- Total Deals
- Won Deals
- Lost Deals
- Pending Deals
- Total Revenue (calculated using MongoDB aggregation)

## Error Handling

This project uses centralized error handling middleware.

### Error Types Handled:

- 400 → Validation Errors
- 401 → Not Authenticated
- 403 → Forbidden
- 404 → Not Found
- 500 → Internal Server Error


### Standard Error Response Format:

```json
{
  "success": false,
  "message": "Error message",
  "code": "E001"
}

server.js
   ↓
auth.routes.js
   ↓
auth.controller.js
   ↓
User model


server.js
   ↓
auth.routes.js
   ↓
auth.controller.js
   ↓
User model
