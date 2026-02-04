# Testing Guide for Contact Management API

## 🚀 Quick Start

Your backend server is running on: **http://localhost:7000**

## 📁 Testing Files Available

1. **CURL_EXAMPLES.md** - All cURL commands for terminal testing
2. **Contact_Management_API.postman_collection.json** - Import this into Postman
3. **API_DOCUMENTATION.md** - Complete API documentation

---

## 🔥 Fastest Way to Test (Postman)

### Step 1: Import Collection
1. Open Postman
2. Click **Import** button (top left)
3. Click **Upload Files**
4. Select `Contact_Management_API.postman_collection.json`
5. Click **Import**

### Step 2: Test Authentication
1. Open the collection "Contact Management API"
2. Go to **Authentication** → **Register User**
3. Click **Send**
4. ✅ The token will be **automatically saved** to the collection variable
5. Now you can use all other endpoints!

### Step 3: Create Contacts
1. Go to **Contacts** → **Create Contact (Full)**
2. Click **Send**
3. You should see your contact created!

### Step 4: Get All Contacts
1. Go to **Contacts** → **Get All Contacts**
2. Click **Send**
3. See all your contacts!

---

## 🧪 Testing with cURL (Terminal)

### Quick Test Flow:

**1. Register:**
```bash
curl -X POST http://localhost:7000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mytest@example.com",
    "password": "test123456"
  }'
```

**2. Copy the token from response, then create a contact:**
```bash
curl -X POST http://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Contact",
    "phone": "+1 555 0000",
    "email": "test@test.com"
  }'
```

**3. Get all contacts:**
```bash
curl -X GET http://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## ✅ All Available Endpoints

### Authentication
- ✅ POST `/api/auth/register` - Register new user
- ✅ POST `/api/auth/login` - Login user
- ✅ GET `/api/auth/me` - Get current user info

### Contacts
- ✅ GET `/api/contacts` - Get all contacts (with search, filter, pagination)
- ✅ GET `/api/contacts/:id` - Get single contact
- ✅ POST `/api/contacts` - Create new contact
- ✅ PUT `/api/contacts/:id` - Update contact
- ✅ DELETE `/api/contacts/:id` - Delete contact
- ✅ PATCH `/api/contacts/:id/favorite` - Toggle favorite
- ✅ GET `/api/contacts/tags` - Get all unique tags

---

## 🎯 Test Scenarios

### Scenario 1: Basic CRUD
1. Register user
2. Create 3 contacts
3. Get all contacts
4. Update one contact
5. Delete one contact
6. Get all contacts again

### Scenario 2: Search & Filter
1. Create contacts with different names
2. Search by name
3. Filter by favorites
4. Filter by tags

### Scenario 3: Favorites
1. Create a contact
2. Toggle favorite ON
3. Get favorite contacts
4. Toggle favorite OFF

### Scenario 4: Tags
1. Create contacts with tags: "work, client"
2. Create contacts with tags: "family, friend"
3. Get all tags
4. Filter by specific tag

---

## 🔍 Checking Database

You can verify data in MySQL:

```bash
mysql -u root -p4171 practo_assignment_db

# Inside MySQL:
SELECT * FROM users;
SELECT * FROM contacts;
SELECT * FROM contacts WHERE is_favorite = TRUE;
```

---

## 🐛 Troubleshooting

### Server not running?
```bash
cd /Users/user/Desktop/assignment/backend
npm run dev
```

### Database connection error?
```bash
mysql -u root -p4171 -e "CREATE DATABASE IF NOT EXISTS practo_assignment_db;"
mysql -u root -p4171 practo_assignment_db < config/schema.sql
```

### Token expired?
Just login again to get a new token (tokens expire after 7 days).

---

## 📊 Expected Response Examples

### Successful Registration:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com"
  }
}
```

### Successful Contact Creation:
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
    "company": null,
    "tags": null,
    "notes": null,
    "is_favorite": false,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🎉 You're All Set!

Your backend is complete and ready to test. Choose your preferred method:
- **Postman** (Recommended) - Import the collection
- **cURL** - Use the examples in CURL_EXAMPLES.md
- **Any HTTP Client** - Use the API_DOCUMENTATION.md as reference

Happy Testing! 🚀
