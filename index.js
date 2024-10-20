import express from "express";
import dotenv from "dotenv";
import app from "./app.js";

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    // Send a response with the error details
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});


const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);  
});