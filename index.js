import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './Config/db.js';
import userRoutes from './Routes/userRoutes.js';
import codeRoutes from './Routes/codeRoutes.js';
import projectRoutes from './Routes/projectRoutes.js';
import search from './Routes/searchRoutes.js';
import projectActivityRoutes from './Routes/projectActivityRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/Public', express.static(path.join(__dirname, 'Public')));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true                
  }));

  

connectDB();

app.get('/', (req, res) => res.send("Hello"));

app.use('/api/auth', userRoutes);
app.use('/codes', codeRoutes);
app.use('/post', projectRoutes);
app.use('/search', search);
app.use('/projectActivity', projectActivityRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
