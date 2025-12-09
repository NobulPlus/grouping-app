import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Routes
import userRoutes from './routes/userRoutes';
import groupRoutes from './routes/groupRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

class App {
  public app: Application;
  
  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.errorHandling();
  }
  
  private config(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration - Allow multiple origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL,
    ].filter(Boolean); // Remove undefined values

    this.app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    
    this.app.use('/api/', limiter);
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Compression
    this.app.use(compression());
    
    // Request logging
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      next();
    });
  }
  
  private routes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });
    
    // API routes
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/groups', groupRoutes);
    this.app.use('/api/admin', adminRoutes);
    
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
      });
    });
  }
  
  private errorHandling(): void {
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('Error:', err);
      
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      
      res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });
  }
}

export default new App().app;