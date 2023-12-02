const express = require('express');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.get('/users', UserController.getAllUsers);

// Add other routes as needed

module.exports = router;