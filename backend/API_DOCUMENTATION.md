# Contact Management API Documentation

## Base URL
```
http://localhost:7000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### 3. Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Contact Endpoints

### 1. Get All Contacts
**GET** `/contacts`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `search` (optional) - Search by name, email, phone, or company
- `favorite` (optional) - Filter favorites: `true` or `false`
- `tag` (optional) - Filter by tag
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 50)

**Example:**
```
GET /contacts?search=john&favorite=true&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "contacts": [
    {
      "id": 1,
      "user_id": 1,
      "name": "John Smith",
      "phone": "+1 234 567 8901",
      "email": "john.smith@example.com",
      "company": "Tech Corp",
      "tags": "work, client",
      "notes": "Important client",
      "is_favorite": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Get Contact by ID
**GET** `/contacts/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "contact": {
    "id": 1,
    "user_id": 1,
    "name": "John Smith",
    "phone": "+1 234 567 8901",
    "email": "john.smith@example.com",
    "company": "Tech Corp",
    "tags": "work, client",
    "notes": "Important client",
    "is_favorite": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Contact
**POST** `/contacts`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "phone": "+1 234 567 8901",
  "email": "john.smith@example.com",
  "company": "Tech Corp",
  "tags": "work, client",
  "notes": "Important client",
  "is_favorite": false
}
```

**Required Fields:**
- `name` (string, max 255 chars)
- `phone` (string, max 50 chars)
- `email` (valid email)

**Optional Fields:**
- `company` (string, max 255 chars)
- `tags` (string, max 500 chars, comma-separated)
- `notes` (text)
- `is_favorite` (boolean)

**Response:**
```json
{
  "success": true,
  "message": "Contact created successfully",
  "contact": {
    "id": 1,
    "user_id": 1,
    "name": "John Smith",
    "phone": "+1 234 567 8901",
    "email": "john.smith@example.com",
    "company": "Tech Corp",
    "tags": "work, client",
    "notes": "Important client",
    "is_favorite": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Contact
**PUT** `/contacts/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:** (Same as Create Contact)

**Response:**
```json
{
  "success": true,
  "message": "Contact updated successfully",
  "contact": {
    "id": 1,
    "user_id": 1,
    "name": "John Smith Updated",
    "phone": "+1 234 567 8901",
    "email": "john.smith@example.com",
    "company": "Tech Corp",
    "tags": "work, client",
    "notes": "Important client",
    "is_favorite": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-02T00:00:00.000Z"
  }
}
```

### 5. Delete Contact
**DELETE** `/contacts/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

### 6. Toggle Favorite
**PATCH** `/contacts/:id/favorite`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Contact added to favorites",
  "is_favorite": true
}
```

### 7. Get All Tags
**GET** `/contacts/tags`

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "tags": ["work", "client", "family", "friend"]
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Token is not valid"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Contact not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## Database Setup

Run the SQL schema file to create the database tables:

```bash
mysql -u root -p practo_assignment_db < config/schema.sql
```

Or manually create the database and run the schema:

```bash
mysql -u root -p
CREATE DATABASE practo_assignment_db;
USE practo_assignment_db;
source config/schema.sql;
```

---

## Running the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:7000`
