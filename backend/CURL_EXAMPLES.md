# cURL Commands for Contact Management API

Base URL: `http://localhost:7000/api`

---

## 🔐 Authentication Endpoints

### 1. Register User
```bash
curl -X POST http://localhost:7000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:7000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Note:** Copy the `token` from the response and use it in the following requests.

### 3. Get Current User
```bash
curl -X GET http://localhost:7000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📇 Contact Endpoints

**Important:** Replace `YOUR_TOKEN_HERE` with the actual JWT token you received from login/register.

### 1. Get All Contacts (No Filters)
```bash
curl -X GET http://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 2. Get All Contacts with Search
```bash
curl -X GET "http://localhost:7000/api/contacts?search=john" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Get Favorite Contacts Only
```bash
curl -X GET "http://localhost:7000/api/contacts?favorite=true" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Get Contacts by Tag
```bash
curl -X GET "http://localhost:7000/api/contacts?tag=work" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get Contacts with Pagination
```bash
curl -X GET "http://localhost:7000/api/contacts?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Get Contacts with Multiple Filters
```bash
curl -X GET "http://localhost:7000/api/contacts?search=john&favorite=true&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Get Contact by ID
```bash
curl -X GET http://localhost:7000/api/contacts/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 8. Create New Contact (Minimal)
```bash
curl -X POST http://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "phone": "+1 234 567 8901",
    "email": "john.smith@example.com"
  }'
```

### 9. Create New Contact (Full Details)
```bash
curl -X POST http://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "phone": "+1 987 654 3210",
    "email": "jane.doe@example.com",
    "company": "Tech Corp",
    "tags": "work, client, important",
    "notes": "Met at tech conference 2024. Interested in our new product.",
    "is_favorite": true
  }'
```

### 10. Create Another Contact (For Testing)
```bash
curl -X POST http://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Michael Brown",
    "phone": "+1 345 678 9012",
    "email": "michael.brown@example.com",
    "company": "Design Studio",
    "tags": "freelance, designer",
    "notes": "Freelance designer for UI/UX projects",
    "is_favorite": false
  }'
```

### 11. Update Contact
```bash
curl -X PUT http://localhost:7000/api/contacts/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith Updated",
    "phone": "+1 234 567 8901",
    "email": "john.smith.updated@example.com",
    "company": "New Tech Corp",
    "tags": "work, vip",
    "notes": "Updated contact information",
    "is_favorite": true
  }'
```

### 12. Delete Contact
```bash
curl -X DELETE http://localhost:7000/api/contacts/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 13. Toggle Favorite Status
```bash
curl -X PATCH http://localhost:7000/api/contacts/1/favorite \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 14. Get All Tags
```bash
curl -X GET http://localhost:7000/api/contacts/tags \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🧪 Testing Workflow

### Step-by-Step Testing Guide:

1. **Register a new user:**
```bash
curl -X POST http://localhost:7000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "test123456"
  }'
```

2. **Copy the token from the response** (it will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

3. **Create your first contact:**
```bash
curl -X POST http://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "phone": "+1 555 123 4567",
    "email": "alice@example.com",
    "company": "Startup Inc",
    "tags": "client, priority",
    "notes": "CEO of Startup Inc",
    "is_favorite": true
  }'
```

4. **Get all contacts:**
```bash
curl -X GET http://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

5. **Search for a contact:**
```bash
curl -X GET "http://localhost:7000/api/contacts?search=alice" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

6. **Toggle favorite:**
```bash
curl -X PATCH http://localhost:7000/api/contacts/1/favorite \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📋 Postman Import Format

You can also import these as a Postman collection. Here's a quick guide:

### For Postman:
1. Open Postman
2. Click "Import" button
3. Select "Raw text"
4. Paste any of the cURL commands above
5. Postman will automatically convert them

### Setting up Environment Variables in Postman:
1. Create a new environment in Postman
2. Add these variables:
   - `base_url`: `http://localhost:7000/api`
   - `token`: (leave empty, will be set after login)
3. After login/register, manually copy the token to the `token` variable
4. Use `{{base_url}}` and `{{token}}` in your requests

### Example Postman Request:
```
POST {{base_url}}/auth/login
Headers:
  Content-Type: application/json
Body:
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## ✅ Health Check

Test if the server is running:
```bash
curl -X GET http://localhost:7000/
```

Expected response:
```json
{
  "success": true,
  "message": "Contact Management API is running",
  "version": "1.0.0"
}
```

---

## 🔍 Testing Error Cases

### Invalid Email Format:
```bash
curl -X POST http://localhost:7000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123"
  }'
```

### Missing Required Fields:
```bash
curl -X POST http://localhost:7000/api/contacts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User"
  }'
```

### Unauthorized Access (No Token):
```bash
curl -X GET http://localhost:7000/api/contacts
```

### Invalid Token:
```bash
curl -X GET http://localhost:7000/api/contacts \
  -H "Authorization: Bearer invalid_token_here"
```

---

## 💡 Tips

1. **Pretty Print JSON Response:** Add `-s | jq` to the end of curl commands (requires jq):
   ```bash
   curl -X GET http://localhost:7000/api/contacts \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" -s | jq
   ```

2. **Save Response to File:**
   ```bash
   curl -X GET http://localhost:7000/api/contacts \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" -o contacts.json
   ```

3. **View Response Headers:**
   ```bash
   curl -X GET http://localhost:7000/api/contacts \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" -i
   ```

4. **Verbose Output (for debugging):**
   ```bash
   curl -X GET http://localhost:7000/api/contacts \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" -v
   ```
