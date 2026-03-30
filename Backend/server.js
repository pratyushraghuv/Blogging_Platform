import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './database/db.js';

const app = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});