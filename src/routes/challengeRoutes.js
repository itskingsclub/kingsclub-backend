// routes/challengeRoutes.js
const express = require('express');
const ChallengeController = require('../controllers/ChallengeController');

const router = express.Router();

// Route for creating a challenge
router.post('/create', ChallengeController.createChallenge);

// Route for getting a challenge by ID
router.get('/:challengeId', ChallengeController.getChallengeById);

// Route for getting all challenges
router.get('/', ChallengeController.getAllChallenges);

// Route for updating a challenge
router.put('/:challengeId', ChallengeController.updateChallenge);

// Route for deleting a challenge
router.delete('/:challengeId', ChallengeController.deleteChallenge);

module.exports = router;
