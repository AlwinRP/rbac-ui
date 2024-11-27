const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    actions: [{ type: String, enum: ['read', 'create', 'update', 'delete'] }],
    description: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
