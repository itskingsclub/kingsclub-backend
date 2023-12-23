// controllers/ChallengeController.js
const Challenge = require('../models/Challenge');

class ChallengeController {
    static async createChallenge(req, res) {
        const { creator, amount } = req.body;

        try {
            const challengeId = await Challenge.createChallenge(creator, amount);
            res.json({
                success: true,
                message: 'Challenge created successfully',
                data: { challengeId },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    static async getChallengeById(req, res) {
        const { challengeId } = req.params;

        try {
            const challenge = await Challenge.getChallengeById(challengeId);
            if (challenge) {
                res.json({
                    success: true,
                    message: 'Challenge found',
                    data: challenge,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Challenge not found',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    static async getAllChallenges(req, res) {
        try {
            const challenges = await Challenge.getAllChallenges();
            res.json({
                success: true,
                message: 'Challenges fetched successfully',
                data: challenges,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    static async updateChallenge(req, res) {
        try {
            const success = await Challenge.updateChallenge(req, res);
            if (success) {
                res.json({
                    success: true,
                    message: 'Challenge updated successfully',
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Challenge not found',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }

    static async deleteChallenge(req, res) {
        const { challengeId } = req.params;

        try {
            const success = await Challenge.deleteChallenge(challengeId);
            if (success) {
                res.json({
                    success: true,
                    message: 'Challenge deleted successfully',
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Challenge not found',
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
            });
        }
    }
}

module.exports = ChallengeController;
