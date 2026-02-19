import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import noteRoutes from './routes/noteRoutes.js';

// Load env variables
dotenv.config();

// Check env
console.log('🔍 MONGO_URI exists:', !!process.env.MONGO_URI);
console.log('🔍 PORT:', process.env.PORT);

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

// Connect to DB
await connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notes', noteRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server on port ${PORT}`);
});