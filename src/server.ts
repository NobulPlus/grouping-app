import app from './app';
import connectDB from './config/database';
import Group from './models/Group';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB().then(async () => {
  // Initialize groups if they don't exist
  await Group.initializeGroups();
  
  // Start server
  app.listen(PORT, () => {
    console.log(`
    🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
    ✅ API: http://localhost:${PORT}
    ✅ Health: http://localhost:${PORT}/health
    ✅ MongoDB: ${process.env.MONGODB_URI?.split('@')[1] || 'Connected'}
    `);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});