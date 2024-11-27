const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const Permission = require('../models/permission');
const Activity= require('../models/activity');

// Create a new role
router.post('/', async (req, res) => {
    console.log("request to create role",req.body);
    try {
        const { name, description, permissions } = req.body;
        const permissionDocs = await Permission.find({ name: { $in: permissions } });
        const role = new Role({
            name,
            description,
            permissions: permissionDocs.map(permission => permission._id)
        });
        await role.save();
        const activity = new Activity({ description: 'New Role created' , }); 
        await activity.save();
        res.status(201).send(role);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all roles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.status(200).send(roles);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a role by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate('permissions');
        if (!role) return res.status(404).send();
        res.status(200).send(role);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a role by ID
router.put('/:id', async (req, res) => {
    console.log("update role",req.body);
    try {
        const { name, description, permissions } = req.body;
        const permissionDocs = await Permission.find({ name: { $in: permissions } });
        const role = await Role.findByIdAndUpdate(req.params.id, {
            name,
            description,
            permissions: permissionDocs.map(permission => permission._id)
        }, { new: true, runValidators: true });
        if (!role) return res.status(404).send();
        res.status(200).send(role);
        const activity = new Activity({ description: 'Role Updated' , }); 
        await activity.save();
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a role by ID
router.delete('/:id', async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).send();
        res.status(200).send(role);
        const activity = new Activity({ description: 'Role Deleted' , }); 
        await activity.save();
    } catch (error) {
        res.status(500).send(error);
    }
});


router.get('/count-by-permission/:permissionId', async (req, res) => { 
    const { permissionId } = req.params; 
    try { const roleCount = await Role.countDocuments({ permissions: permissionId }); 
    res.json({ permissionId, roleCount }); 
} catch (error) { 
    res.status(500).json({ error: 'Failed to count roles by permission' }); } });
    
module.exports = router;
