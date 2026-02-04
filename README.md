# Contact Management Application

A full-stack contact management application with user authentication, CRUD operations, search, filtering, and favorites functionality.

## 🎯 Features

### Authentication
- ✅ User registration with email and password
- ✅ User login with JWT token authentication
- ✅ Protected routes for authenticated users only
- ✅ Automatic token management

### Contact Management
- ✅ Create new contacts with name, phone, email, company, tags, and notes
- ✅ View all contacts in a clean table layout
- ✅ Edit existing contacts
- ✅ Delete contacts with confirmation
- ✅ Mark contacts as favorites (star icon)
- ✅ Search contacts by name, email, phone, or company
- ✅ Filter contacts by favorite status
- ✅ Filter contacts by tags
- ✅ Pagination for large contact lists

### UI/UX
- ✅ Clean, modern design matching the provided wireframes
- ✅ Responsive layout for desktop and mobile
- ✅ Modal-based contact editing
- ✅ Real-time search
- ✅ Error handling and validation
- ✅ Loading states

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

### Frontend
- **React** (Create React App)
- **React Router** for navigation
- **Axios** for API calls
- **Context API** for state management
- **CSS** for styling

## 📁 Project Structure

```
assignment/
├── backend/
│   ├── config/
│   │   ├── db.js                 # Database connection
│   │   └── schema.sql            # Database schema
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── contactController.js  # Contact CRUD logic
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   └── contactRoutes.js      # Contact endpoints
│   ├── server.js                 # Express server
│   ├── .env                      # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ContactModal.js   # Add/Edit contact modal
    │   │   └── ProtectedRoute.js # Route protection
    │   ├── context/
    │   │   └── AuthContext.js    # Authentication context
    │   ├── pages/
    │   │   ├── Auth.js           # Login/Register page
    │   │   └── Dashboard.js      # Main dashboard
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── App.js                # Main app component
    │   └── index.js              # Entry point
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd /Users/user/Desktop/assignment/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   The `.env` file is already configured:
   ```
   PORT=7000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=4171
   DB_NAME=practo_assignment_db
   JWT_SECRET=supersecret
   ```

4. **Create database and tables:**
   ```bash
   mysql -u root -p4171 -e "CREATE DATABASE IF NOT EXISTS practo_assignment_db;"
   mysql -u root -p4171 practo_assignment_db < config/schema.sql
   ```

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   The backend will run on `http://localhost:7000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd /Users/user/Desktop/assignment/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend server:**
   ```bash
   npm start
   ```
   
   The frontend will run on `http://localhost:3001`

## 🎮 Usage

### 1. Register/Login
- Open `http://localhost:3001` in your browser
- Register a new account with email and password
- Or login if you already have an account

### 2. Dashboard
- After login, you'll be redirected to the dashboard
- View all your contacts in a table format

### 3. Add Contact
- Click "Add New Contact" button
- Fill in the contact details (Name, Phone, Email are required)
- Optionally add Company, Tags, and Notes
- Click "Save" to create the contact

### 4. Search Contacts
- Use the search bar in the header
- Search by name, email, phone, or company
- Results update in real-time

### 5. Filter Favorites
- Check "Show favorites only" to see starred contacts
- Uncheck to see all contacts

### 6. Edit Contact
- Click "Edit" button on any contact row
- Modify the details in the modal
- Click "Save" to update

### 7. Delete Contact
- Click "Delete" button on any contact row
- Confirm the deletion
- Or delete from within the edit modal

### 8. Toggle Favorite
- Click the star icon (☆/⭐) to mark/unmark as favorite
- Favorites appear with a filled star

### 9. Logout
- Click the user icon in the top right
- You'll be logged out and redirected to login page

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Contacts (Protected)
- `GET /api/contacts` - Get all contacts (with search, filter, pagination)
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `PATCH /api/contacts/:id/favorite` - Toggle favorite
- `GET /api/contacts/tags` - Get all unique tags

See `backend/API_DOCUMENTATION.md` for detailed API documentation.

## 🧪 Testing

### Using Postman
1. Import `backend/Contact_Management_API.postman_collection.json`
2. The collection includes all endpoints
3. Token is automatically saved after login/register

### Using cURL
See `backend/CURL_EXAMPLES.md` for all cURL commands

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔒 Security Features

- Passwords are hashed using bcryptjs
- JWT tokens for secure authentication
- Protected API routes
- Input validation on both frontend and backend
- SQL injection prevention
- XSS protection

## 🎨 Design

The UI closely matches the provided wireframes with:
- Clean, modern aesthetic
- Gradient background on login page
- White card-based design
- Red accent color (#e53e3e) for primary actions
- Responsive table layout
- Modal-based editing

## 📝 Database Schema

### Users Table
- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Contacts Table
- `id` - Primary key
- `user_id` - Foreign key to users
- `name` - Contact name
- `phone` - Phone number
- `email` - Email address
- `company` - Company name (optional)
- `tags` - Comma-separated tags (optional)
- `notes` - Additional notes (optional)
- `is_favorite` - Boolean flag
- `created_at` - Timestamp
- `updated_at` - Timestamp

## 🐛 Troubleshooting

### Backend won't start
- Check if MySQL is running
- Verify database credentials in `.env`
- Ensure port 7000 is available

### Frontend won't start
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check if port 3000/3001 is available

### Can't login
- Check backend server is running
- Verify API URL in `frontend/src/services/api.js`
- Check browser console for errors

### Database errors
- Ensure database exists: `CREATE DATABASE practo_assignment_db;`
- Run schema: `mysql -u root -p4171 practo_assignment_db < config/schema.sql`

## 🚀 Deployment

### Backend
1. Set production environment variables
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Use production database

### Frontend
1. Build production bundle: `npm run build`
2. Serve static files with Nginx or similar
3. Update API URL to production backend

## 📄 License

This project is for assignment purposes.

## 👨‍💻 Development

- Backend runs on port 7000
- Frontend runs on port 3001
- Hot reload enabled for both
- Use `npm run dev` for backend development mode


