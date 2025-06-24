/* controllers/users.js */

const express = require('express');
const router  = express.Router();

const User = require('../models/user.js');

/* ------------ COMMUNITY INDEX ------------ */
// GET /community
router.get('/', async (req, res) => {
  try {
    // Get all users (username + _id only)
    const users = await User.find({}, 'username');
    res.render('users/index.ejs', { users });
  } catch (err) {
    console.error('Error loading community page:', err);
    res.redirect('/');
  }
});

/* ------------ USER SHOW ROUTE ------------ */
// GET /community/:userId
router.get('/:userId', async (req, res) => {
  try {
    const profileUser = await User.findById(req.params.userId);

    if (!profileUser) {
      throw new Error('User not found');
    }

    res.render('users/show.ejs', { profileUser });
  } catch (err) {
    console.error('Error loading user pantry:', err);
    res.redirect('/community');
  }
});

module.exports = router;
