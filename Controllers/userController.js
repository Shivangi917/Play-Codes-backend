import User from '../Models/User.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateTokenAndSetCookie } from "../Utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from '../Config/nodeMailer.js';
import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();

app.use(cookieParser())

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random code
};

export const signup = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if (!email || !name || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const verificationCode = generateVerificationCode();
        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            isVerified: false,  // Fix
            verificationToken: verificationCode,  // Fix
            verificationTokenExpiresAt: Date.now() + 3600000 // Expires in 1 hour
        });

        await newUser.save();

        generateTokenAndSetCookie(res, newUser._id);
        await sendVerificationEmail(newUser.email, verificationCode);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...newUser._doc,
                password: undefined
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { verificationCode } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: verificationCode,
            verificationTokenExpiresAt: { $gt: Date.now() } // Check expiry
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log("Error in verifying email: ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "User not found" });

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set to true in production (HTTPS)
            sameSite: 'Lax',
          });
          res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Strict',
      secure: true,
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getUser = (req, res) => {
    const { name, email } = req.user;
    res.json({ name, email });
  };
  
  