const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('role'); // Populate role

  if (!user) {
    return res.status(400).send('User not found');
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send('Invalid password');
  }

  // Compare role name
  if (user.role.name !== 'admin') { // Ensure this matches your role name field
    return res.status(403).send('Access denied');
  }

  const token = jwt.sign({ _id: user._id, role: user.role.name }, process.env.JWT_SECRET); // Include role name in the token
  res.header('auth-token', token).send(token);
});

module.exports = router;
