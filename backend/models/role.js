const mongoose = require('mongoose');
const Permission = require('./permission'); // Ensure Permission model is imported

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    createdAt: { type: Date, default: Date.now }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
