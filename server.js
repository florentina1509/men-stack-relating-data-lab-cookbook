require('dotenv').config(); // Load env vars

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
// const morgan = require('morgan'); // Optional: request logging

// --- Controllers ---
const authController   = require('./controllers/auth.js');
const pantryController = require('./controllers/pantry.js');
const foodsController  = require('./controllers/food.js');
const usersController  = require('./controllers/users.js'); // ✅ NEW: Community page

// --- Middleware ---
const isSignedIn     = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// --- DB Connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Global Middleware ---
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
// app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Make user available in all views
app.use(passUserToView);

// --- Public Routes ---
app.use('/auth', authController);
app.use('/community', usersController); // ✅ NEW: public route to view all users

// --- Protected Routes ---
app.use(isSignedIn);                                // everything below requires login
app.use('/pantry', pantryController);               // optional shortcut
app.use('/users/:userId/foods', foodsController);   // main pantry routes

// --- Home Route ---
app.get('/', (req, res) => {
  res.render('index.ejs'); // user is passed via res.locals.user
});

// --- Test/Extra Route ---
app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party, ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});

// --- Start Server ---
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Express app running at http://localhost:${port}`);
});
