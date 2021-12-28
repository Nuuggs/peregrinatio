// Import Routes
const mainRouter = require('./routers/mainRouter');
// Import Controllers
const MainCtrl = require('./controllers/mainCtrl');
// Import Models
const db = require('./models');
// Import Express
const express = require('express');
// Initialize dotenv to utilize env variables
require('dotenv').config();

// Get PORT from .env
const { PORT } = process.env;

// Initialize express for functionality
const app = express();

// Express stuff
// set express engine to expect ejs templates
app.set('view engine', 'ejs');
// expose the files stored in public folder
app.use(express.static('public'));

// app.use(express.json());

// Middlewares

// Init Controllers
const mainCtrl = new MainCtrl('main', db)

// Routes
// app.get('/', (req, res) => console.log('works!'))
app.use('/', mainRouter(mainCtrl))

// Listen to port
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));