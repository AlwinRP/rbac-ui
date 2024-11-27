const express = require('express');
const router = express.Router();

let lastConnectedTime = new Date();

// Middleware to update the last connected time
router.use((req, res, next) => {
  lastConnectedTime = new Date();
  next();
});

// Endpoint to get the system status
router.get('/status', async (req, res) => {
  try {
    res.json({
      status: 'Active',
      lastConnectedTime,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch system status' });
  }
});

module.exports = router;
