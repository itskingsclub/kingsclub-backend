const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

// Create a new user
router.post('/users', UserController.createUser);

// Get all users
router.get('/users', UserController.getAllUsers);

// Get a specific user by ID
router.get('/users/:userId', UserController.getUserById);

// Update a user by ID
router.put('/users/:userId', UserController.updateUser);

// Delete a user by ID
router.delete('/users/:userId', UserController.deleteUser);

module.exports = router;