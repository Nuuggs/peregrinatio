// Start express
const express = require('express');
const app = express();
require('dotenv').config();
const { PORT } = process.env;

// Import Routes

// Import Controllers

// Import Models
const db = require('./models');

// Express stuff
// app.use(express.json());

// Middlewares

// Routes
app.get('/', (req, res) => console.log('works!'))

// Listen to port
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));