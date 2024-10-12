const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./Config/db');
const userRoutes = require('./Routes/userRoutes');
const codeRoutes = require('./Routes/codeRoutes');
const projectRoutes = require('./Routes/projectRoutes');
const { signup, login } = require('./Controllers/userController');

const app = express();

app.use('/Public', express.static(path.join(__dirname, 'Public')));

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Basic route
app.get('/', (req, res) => res.send("Hello"));

// Routes
app.use('/signup', signup);
app.use('/login', login);
app.use('/codes', codeRoutes);
app.use('/post', projectRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
