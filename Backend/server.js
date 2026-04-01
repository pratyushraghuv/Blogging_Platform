import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.js';
import userRoute from './routes/user.routes.js';


dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1/user', userRoute)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});