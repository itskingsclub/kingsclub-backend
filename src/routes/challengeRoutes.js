const express = require('express');
const ChallengeController = require('../controllers/ChallengeController');
const { verifyToken } = require('../utils/authUtils');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const paginationMiddleware = require('../middleware/paginationMiddleware');
const router = express.Router()

// Route for creating a challenge
router.post('/create', ChallengeController.createChallenge);

// Get all challenge
router.get('/', paginationMiddleware, ChallengeController.getAllChallenges);

// Get a specific challenge by ID
router.get('/:id', ChallengeController.getChallengeById);

// Update a challenge by ID
router.put('/update', ChallengeController.updateChallengeById);

// Delete a challenge by ID
router.delete('/delete', ChallengeController.deleteChallengeById);

// Get challenges for specific user by ID
router.post('/my-challenges', paginationMiddleware, ChallengeController.getAllChallengesForUser);

// Update a challenge result
router.put('/update-result', uploadMiddleware([
    { name: 'creator_result_image', maxCount: 1 },
    { name: 'joiner_result_image', maxCount: 1 }]), ChallengeController.updateChallengeResult);

// Get challenges for specific user by ID
router.put('/clear-challenge', ChallengeController.clearChallenge);

module.exports = router;
