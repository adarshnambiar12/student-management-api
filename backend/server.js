import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';

// Load env variables
dotenv.config();

// Initialize express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply rate limiting middleware
app.use(apiLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('<h2>Hello from Student Management API</h2>');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});