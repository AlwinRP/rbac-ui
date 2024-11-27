const express = require('express');
const router = express.Router();
const Activity = require('../models/activity'); // Ensure Activity model is imported

// Fetch the latest 10 activities
router.get('/latest', async (req, res) => {
  try {
    const activities = await Activity.find().sort({ timestamp: -1 }).limit(8);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

module.exports = router;
