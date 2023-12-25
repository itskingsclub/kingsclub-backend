const express = require('express');
const { createUser, getAllUsers, getUserById, updateUserById, deleteUserById } = require('../controllers/UserController');
const { verifyToken } = require('../utils/authUtils');
const router = express.Router();

// Create a new user
router.post('/register', createUser);

// Get all user
router.get('/all', getAllUsers);

// Get a specific user by ID
router.get('/:id', getUserById);

// Update a user by ID
router.put('/update', updateUserById);

// Delete a user by ID
router.delete('/delete', deleteUserById);

module.exports = router;