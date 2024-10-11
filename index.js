// src/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const UserModel = require('./Models/User'); 
const CodeModel = require('./Models/Code');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/User", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Basic route
app.get('/', (req, res) => {
    res.send("hello");
});

// Signup route
app.post('/Signup', (req, res) => {
    UserModel.create(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            console.error("Error creating user:", err);
            res.status(500).json({ error: "Error creating user" });
        });
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email }); // Find user by email
        if (!user) {
            return res.status(401).json({ message: "User not found" }); // User not found
        }
        if (user.password !== password) { // Check if passwords match
            return res.status(401).json({ message: "Invalid password" }); // Invalid password
        }
        res.status(200).json({ message: "Login successful", user }); // Login successful
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ error: "Internal server error" }); // Handle server error
    }
});

// Post code snippet route
app.post('/codes', async (req, res) => {
    const { title, codeSnippet, description, useremail } = req.body; // Include useremail here
    try {
        // Find user by email
        const user = await UserModel.findOne({ email: useremail }); // Correctly reference useremail
        if (!user) {
            return res.status(404).json({ error: "User not found" }); // User not found error
        }
        const newCode = new CodeModel({
            title,
            codeSnippet,
            description,
            user: user._id // Store the user's ID
        });

        const savedCode = await newCode.save();
        res.status(201).json(savedCode); // Respond with the created code snippet
    } catch (err) {
        console.error("Error creating code snippet:", err);
        res.status(500).json({ error: "Error creating code snippet" });
    }
});

// Get all code snippets route
app.get('/codes', async (req, res) => {
    try {
        const codes = await CodeModel.find().populate('user', 'name email'); // Populate user details
        res.status(200).json(codes); // Respond with the list of codes
    } catch (err) {
        console.error("Error fetching codes:", err);
        res.status(500).json({ error: "Error fetching codes" });
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
