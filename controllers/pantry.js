const express = require('express');
const router = express.Router();
const User = require('../models/user');

// TEMP FIX — simulates login until auth works properly
router.use(async (req, res, next) => {
  if (!req.session.user) {
    const demoUser = await User.findOne(); // get any user from DB
    if (!demoUser) {
      return res.send('⚠️ No users found. Sign up a user first!');
    }
    req.session.user = demoUser; // fake login
  }
  next();
});

// INDEX — View user's pantry
router.get('/', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  res.render('pantry/index.ejs', { pantry: user.pantry, user });
});

// NEW — Form to add new pantry item
router.get('/new', (req, res) => {
  res.render('pantry/new.ejs');
});

// CREATE — Add new item to pantry
router.post('/', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  user.pantry.push({ name: req.body.name });
  await user.save();
  res.redirect('/pantry');
});

// EDIT — Form to edit a pantry item
router.get('/:itemId/edit', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const item = user.pantry.id(req.params.itemId);
  res.render('pantry/edit.ejs', { item });
});

// UPDATE — Update a pantry item
router.put('/:itemId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  const item = user.pantry.id(req.params.itemId);
  item.name = req.body.name;
  await user.save();
  res.redirect('/pantry');
});

// DELETE — Remove pantry item
router.delete('/:itemId', async (req, res) => {
  const user = await User.findById(req.session.user._id);
  user.pantry.id(req.params.itemId).remove();
  await user.save();
  res.redirect('/pantry');
});

module.exports = router;
