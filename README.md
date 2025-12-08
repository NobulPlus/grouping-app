# Group Harmony Backend

Backend API for the Group Harmony team assignment application.

## 🚀 Deployment on Render

This branch is optimized for deployment on Render.

### Quick Deploy

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select branch: `backend-deploy`
5. Configure:
   - **Name**: group-harmony-backend
   - **Root Directory**: (leave empty - files are at root)
   - **Build Command**: `npm install --include=dev && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node

### Environment Variables

Add these in Render dashboard:

```
NODE_ENV=production
PORT=5050
MONGODB_URI=your_mongodb_atlas_connection_string
```

### MongoDB Setup

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist Render's IP (or use 0.0.0.0/0 for all IPs)
4. Get your connection string and add it to Render environment variables

## 📁 Project Structure

```
├── src/
│   ├── server.ts          # Entry point
│   ├── app.ts             # Express app configuration
│   ├── config/            # Database configuration
│   ├── models/            # Mongoose models
│   ├── controllers/       # Route controllers
│   ├── routes/            # API routes
│   └── utils/             # Utility functions
├── package.json
├── tsconfig.json
└── render.yaml            # Render configuration
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Create .env file
echo "MONGODB_URI=your_connection_string" > .env
echo "PORT=5050" >> .env

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

- `POST /api/users/register` - Register a new user
- `GET /api/users` - Get all users
- `GET /api/groups` - Get all groups with member counts
- `GET /api/groups/:id` - Get group details with members
- `POST /api/admin/assign` - Assign users to groups
- `POST /api/admin/reset` - Reset all group assignments

## 🎯 Features

- User registration with validation
- Automatic group assignment
- Group management
- MongoDB integration
- TypeScript support
- Express.js framework
- CORS enabled
- Security headers (Helmet)
- Rate limiting
- Input validation

## 📝 Notes

- The backend runs on port 5050 by default
- All API routes are prefixed with `/api`
- MongoDB connection is required for the app to start
- TypeScript is compiled to JavaScript in the `dist/` folder
