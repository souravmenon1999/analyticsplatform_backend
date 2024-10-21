import express from 'express';
import { connectDB } from './config/dbConfig.js';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from'dotenv';
import authRoute from './routes/authRoute.js';
import dataRoute from './routes/dataRoute.js';
import { sessionMid } from './config/sessionConfig.js';




connectDB();
const app = express();


app.use(morgan('dev'));
app.use(sessionMid);  
app.use(express.json());
dotenv.config();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Replace with the URL of your frontend application
  credentials: true // Allow credentials (cookies)
}));



app.use('/api/auth', authRoute);
app.use('/api/data', dataRoute);






export default app;

