const express = require('express');
const ChallengeController = require('../controllers/ChallengeController');
const { verifyToken } = require('../utils/authUtils');
const router = express.Router()

// Route for creating a challenge
router.post('/create', ChallengeController.createChallenge);

// Get all challenge
router.get('/', ChallengeController.getAllChallenges);

// Get a specific challenge by ID
router.get('/:id', ChallengeController.getChallengeById);

// Update a challenge by ID
router.put('/update', ChallengeController.updateChallengeById);

// Delete a challenge by ID
router.delete('/delete', ChallengeController.deleteChallengeById);

module.exports = router;
