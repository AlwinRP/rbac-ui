const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Role = require('../models/role');
const Activity = require('../models/activity');

// Create a new user

router.post('/', async (req, res) => {
    console.log('Received request to create user:', req.body); // Log request payload
    try {
        const user = new User(req.body);
        await user.save();
        const activity = new Activity({ description: 'New User created' , }); 
        await activity.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error creating user:', error.message); // Log error message
        res.status(400).send({ error: error.message }); // Send detailed error message
    }
});


// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('role');
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});
router.get('/active-sessions', async (req, res) => {
    try {
        const activeUsersCount = await User.countDocuments({ status: 'Active' });
        res.status(200).send({ activeUsersCount });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('role');
        if (!user) return res.status(404).send();
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Update a user by ID
router.put('/:id', async (req, res) => { 
    try { const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); 
    if (!user) { 
        return res.status(404).send({ error: 'User not found' }); 
    } 
    res.send(user); 
    const activity = new Activity({ description: 'User updated' , }); 
        await activity.save();
} catch (error) { 
    res.status(400).send({ error: error.message }); 
} 
});



// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send();
        res.status(200).send(user);
        const activity = new Activity({ description: 'User deleted' , }); 
        await activity.save();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/count-by-role/:roleId', async (req, res) => { 
    const { roleId } = req.params; 
    try { 
        const userCount = await User.countDocuments({ role: roleId }); 
        res.json({ roleId, userCount }); 
    } catch (error) { 
        res.status(500).json({ error: 'Failed to count users by role' }); } });


module.exports = router;
