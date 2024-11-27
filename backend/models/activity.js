// models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
