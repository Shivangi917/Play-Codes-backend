const express = require('express');
const cors = require('cors');
const connectDB = require('./Config/db');
const userRoutes = require('./Routes/userRoutes');
const codeRoutes = require('./Routes/codeRoutes');
const projectRoutes = require('./Routes/projectRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Basic route
app.get('/', (req, res) => res.send("Hello"));

// Routes
app.use('/signup', userRoutes);
app.use('/login', userRoutes);
app.use('/codes', codeRoutes);
app.use('/projects', projectRoutes); // Updated route for projects

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
