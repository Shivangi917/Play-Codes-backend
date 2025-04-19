import User from '../Models/User.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../Config/nodeMailer.js';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

// Generate a 6-digit verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// SIGNUP
export const signup = async (req, res) => {
    const { email, name, password } = req.body;
    try {
        if (!email || !name || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationCode = generateVerificationCode();

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            isVerified: false,
            verificationToken: verificationCode,
            verificationTokenExpiresAt: Date.now() + 3600000 // 1 hour
        });

        await newUser.save();
        await sendVerificationEmail(email, verificationCode);

        res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// VERIFY EMAIL
export const verifyEmail = async (req, res) => {
    const { verificationCode } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: verificationCode,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;

        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error verifying email" });
    }
};

// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email first" });
        }

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '100d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // set true in production with HTTPS
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGOUT
export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: false // Set true in production
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// GET USER DETAILS (Requires Middleware)
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
};
