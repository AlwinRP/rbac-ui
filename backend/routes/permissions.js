const express = require('express');
const router = express.Router();
const Permission = require('../models/permission');
const Activity = require('../models/activity');


// Create a new permission
router.post('/', async (req, res) => {
    console.log("request to create permission",req.body);

    try {
        const { name, actions, description } = req.body;
        const permission = new Permission({ name, actions, description });
        await permission.save();
        res.status(201).send(permission);
        const activity = new Activity({ description: 'New Permission created' , }); 
        await activity.save();
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all permissions
router.get('/', async (req, res) => {
    try {
        const permissions = await Permission.find();
        res.status(200).send(permissions);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a permission by ID
router.get('/:id', async (req, res) => {
    try {
        const permission = await Permission.findById(req.params.id);
        if (!permission) return res.status(404).send();
        res.status(200).send(permission);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a permission by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, actions, description } = req.body;
        const permission = await Permission.findByIdAndUpdate(req.params.id, { name, actions, description }, { new: true, runValidators: true });
        if (!permission) return res.status(404).send();
        res.status(200).send(permission);
        const activity = new Activity({ description: 'Permission Updated' , }); 
        await activity.save();
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a permission by ID
router.delete('/:id', async (req, res) => {
    try {
        const permission = await Permission.findByIdAndDelete(req.params.id);
        if (!permission) return res.status(404).send();
        res.status(200).send(permission);
        const activity = new Activity({ description: 'Permission Deleted' , }); 
        await activity.save();
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
