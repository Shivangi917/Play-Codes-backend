const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./Config/db');
const userRoutes = require('./Routes/userRoutes');
const codeRoutes = require('./Routes/codeRoutes');
const projectRoutes = require('./Routes/projectRoutes');

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
app.use('/signup', userRoutes);
app.use('/login', userRoutes);
app.use('/codes', codeRoutes);
app.get('/post', (req, res) => {
    const projects = [
      {
        _id: '1',
        user: { name: 'Alice' },
        description: 'Project 1 description',
        image: 'Images/1728747684751-eb11bb47280327763acbe5cd6c91d590.jpg', // Adjusted this to your file name
      },
      // Add more project objects as needed
    ];
    res.json(projects);
  });
app.use('/post', projectRoutes);

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
