import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://finalProject:finalProject123@cluster0.pxd9mr9.mongodb.net/');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Optionally re-throw the error to handle it globally
  }
};
