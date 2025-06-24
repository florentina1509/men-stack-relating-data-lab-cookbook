/* controllers/foods.js */

const express = require('express');
const router  = express.Router({ mergeParams: true }); // keeps :userId params

const User = require('../models/user.js'); // User schema has an embedded pantry array

/* ------------ NEW ITEM FORM PAGE ------------ */
// GET /users/:userId/foods/new
router.get('/new', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('foods/new.ejs', { user });
  } catch (err) {
    console.error('Error displaying new-item form:', err);
    res.redirect('/');
  }
});

/* --------------- CREATE ITEM ---------------- */
// POST /users/:userId/foods
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    user.pantry.push({
      name:     req.body.name,
      quantity: req.body.quantity
    });

    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error('Error saving pantry item:', err);
    res.redirect('/');
  }
});

/* ------------- EDIT ITEM FORM --------------- */
// GET /users/:userId/foods/:itemId/edit
router.get('/:itemId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const item = user.pantry.id(req.params.itemId);

    if (!item) throw new Error('Item not found');

    res.render('foods/edit.ejs', { user, item });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.redirect('/');
  }
});

/* --------------- UPDATE ITEM ---------------- */
// PUT /users/:userId/foods/:itemId
router.put('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const item = user.pantry.id(req.params.itemId);

    if (!item) throw new Error('Item not found');

    // Update fields in the sub-document
    item.set({
      name:     req.body.name,
      quantity: req.body.quantity
    });

    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error('Error updating pantry item:', err);
    res.redirect('/');
  }
});

/* --------------- DELETE ITEM ---------------- */
// DELETE /users/:userId/foods/:itemId
router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.pantry.id(req.params.itemId).deleteOne();
    await user.save();

    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.error('Error deleting pantry item:', err);
    res.redirect('/');
  }
});

/* --------------- PANTRY INDEX --------------- */
// GET /users/:userId/foods
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    // Expose data to the view
    res.locals.user   = user;
    res.locals.pantry = user.pantry;

    res.render('foods/index.ejs');
  } catch (err) {
    console.error('Error loading pantry:', err);
    res.redirect('/');
  }
});

module.exports = router;
