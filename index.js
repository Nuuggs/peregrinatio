// Import Routes
const mainRouter = require('./routers/mainRouter');
const gameRouter = require('./routers/gameRouter');
// Import Controllers
const MainCtrl = require('./controllers/mainCtrl');
const GameCtrl = require('./controllers/gameCtrl');
// Import Models
const db = require('./models/index');
// Import Express
const express = require('express');
// Initialize dotenv to utilize env variables
require('dotenv').config();

// Get PORT from .env
const { PORT } = process.env;

// Initialize express for functionality
const app = express();

// Express stuff
// set express engine to expect ejs templates - not using ejs, sendFile('index.html') instead
// app.set('view engine', 'ejs');
// expose the files stored in public folder
app.use(express.static('public'));
// to get sent data from req.body - not using app.urlencoded b/c not using html forms
app.use(express.json());

// Middlewares
const auth = require('./middlleware/auth');

// Init Controllers
const mainCtrl = new MainCtrl('main', db.User, db);
const gameCtrl = new GameCtrl('game', db.Game, db);

// Routes
app.get('/', (req, res) => res.redirect('/main'));
app.use('/main', mainRouter(mainCtrl, auth));
app.use('/game', gameRouter(gameCtrl, auth));

// Listen to port
app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));