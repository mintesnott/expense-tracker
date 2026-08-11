import dotenv from 'dotenv';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { connectDB } from './config/db.js';

import authRoutes  from './routes/authRoutes.js';
import incomeRoutes  from './routes/incomeRoutes.js';
import expenseRoutes  from './routes/expenseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

import errorHandlerMiddleware from './middleware/error-handler.js'

import path from 'path';
import { fileURLToPath } from 'url';

// Re-create __filename and __dirname for ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

//Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/incomes', incomeRoutes); 
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);



//serve upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CRITICAL: Global Error Handler Middleware --> must be last
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();