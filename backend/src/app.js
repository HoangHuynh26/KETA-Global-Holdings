import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import inquiryRoutes from './routes/inquiry.routes.js';
import showcaseRoutes from './routes/showcase.routes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

// Trust reverse proxy (Netlify, Cloudflare, etc.)
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Cross-Origin Resource Sharing
app.use(cors({
  origin: true, // Allow all origins in dev or matching frontends
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing with 15MB limit for image uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request ID tagger for logging
app.use((req, res, next) => {
  req.requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  next();
});

// Normalize Netlify Serverless Function prefix if accessed directly or via rewrite
app.use((req, res, next) => {
  if (req.url.startsWith('/.netlify/functions/api')) {
    req.url = req.url.replace('/.netlify/functions/api', '/api') || '/';
  }
  next();
});

// Root ping
app.get('/', (req, res) => {
  res.json({
    name: 'KETA Global Holdings B2B API',
    status: 'ONLINE',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api', inquiryRoutes);
app.use('/api/showcase', showcaseRoutes);
// Direct fallback mounts if /api prefix is stripped by any proxy
app.use('/showcase', showcaseRoutes);
app.use('/', inquiryRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
