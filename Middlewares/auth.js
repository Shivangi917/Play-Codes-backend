import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cookieParser());

const SECRET_KEY = process.env.SECRET_KEY;

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) return res.status(401).json({ message: "Not logged in" });
  
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };

export default verifyUser;