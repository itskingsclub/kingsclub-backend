const express = require('express');
const UserController = require('../controllers/UserController');
const { verifyToken } = require('../utils/authUtils');
const router = express.Router();

// Create a new user
router.post('/register', UserController.createUser);

// Get all user
router.get('/all', UserController.getAllUsers);

// Get a specific user by ID
router.get('/:id', UserController.getUserById);

// Update a user by ID
router.put('/update', UserController.updateUserById);

// Delete a user by ID
router.delete('/delete', UserController.deleteUserById);

// Log In User
router.post('/login', UserController.logInUser);

// Verify Pin
router.post('/verify-pin', UserController.verifyPin);

module.exports = router;