const express = require('express');
const UserController = require('../controllers/UserController');
const { verifyToken } = require('../utils/authUtils');

const router = express.Router();

// Create a new user
router.post('/register', UserController.createUser);

// Get all users
router.get('/all', UserController.getAllUsers);

// Get a specific user by ID
router.get('/:userId', UserController.getUserById);

// Update a user by ID
router.put('/update', verifyToken, UserController.updateUser);

// Delete a user by ID
router.delete('/delete/:userId', UserController.deleteUser);

module.exports = router;