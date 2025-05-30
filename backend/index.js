import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import route from './router.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: ['https://taskmanager-frontend-aeyy.onrender.com'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api', route);

// Connect to DB
const connecttodb = () => {
  mongoose.connect("mongodb+srv://thashreefalit:SVuKsIHbLnfs35A7@taskmanager.evmpbui.mongodb.net/?retryWrites=true&w=majority&appName=TaskManager")
    .then(() => console.log('DB connected'))
    .catch(err => console.error('DB connection error:', err));
};
connecttodb();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
