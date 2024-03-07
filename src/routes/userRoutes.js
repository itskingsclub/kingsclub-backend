const express = require('express');
const UserController = require('../controllers/UserController');
const { verifyToken } = require('../utils/authUtils');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const paginationMiddleware = require('../middleware/paginationMiddleware');
const router = express.Router();

// Create a new user
router.post('/register', uploadMiddleware([{ name: 'profile', maxCount: 1 }]), UserController.createUser);

// Get all user
router.get('/', paginationMiddleware, UserController.getAllUsers);

// Verify Pin
router.get('/leaderboard', paginationMiddleware, UserController.leaderboard);

// Get a specific user by ID
router.get('/:id', UserController.getUserById);

// Update a user by ID
router.put('/update', uploadMiddleware([{ name: 'profile', maxCount: 1 }]), UserController.updateUserById);

// Delete a user by ID
router.delete('/delete', UserController.deleteUserById);

// Log In User
router.post('/login', UserController.logInUser);

// Verify Pin
router.post('/verify-pin', UserController.verifyPin);


module.exports = router;