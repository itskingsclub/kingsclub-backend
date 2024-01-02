const Challenge = require('../models/Challenge');
const User = require('../models/User');
const OtpService = require("../services/OtpService");

class ChallengeController {
    // Create a new Challenge
    static async createChallenge(req, res) {
        const { creator, amount } = req.body;
        const expiry_time = new Date(Date.now() + 30 * 60 * 1000); // Set Challenge expiry to 30 minutes from now
        try {
            const creatorUser = await User.findOne({ where: { id: creator } });
            if (!creatorUser || creatorUser?.dataValues?.total_coin < amount) {
                return res.status(400).json({
                    success: false,
                    message: 'Creator does not have enough coins for the challenge',
                });
            }
            else {
                const newChallenge = await Challenge.create({ ...req.body, expiry_time, creator_result: 'Waiting', joiner_result: 'Waiting', challenge_status: 'Waiting', joiner_result: 'Waiting', updated_by: creator });

                creatorUser.total_coin -= amount;
                await creatorUser.save();

                res.status(201).json({
                    success: true,
                    message: "Challenge created successfully",
                    data: newChallenge
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    // Get all Challenges
    static async getAllChallenges(req, res) {
        try {
            const Challenges = await Challenge.findAll();
            res.status(200).json({
                success: true,
                message: "All Challenge fetched successfully",
                data: Challenges
            });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Error fetching Challenges' });
        }
    }

    // Get a specific Challenge by Id
    static async getChallengeById(req, res) {
        const { id } = req.params;
        try {
            const challenge = await Challenge.findOne({ where: { id } });
            if (challenge) {
                res.status(200).json({
                    success: true,
                    message: "Challenge fetched successfully",
                    data: challenge
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Challenge not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error fetching Challenge'
            });
        }
    }

    // Update a Challenge by Id
    static async updateChallengeById(req, res) {
        const { id } = req.body;
        try {
            const [updatedRowsCount] = await Challenge.update(req.body, { where: { id } });
            if (updatedRowsCount > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Challenge updated successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Challenge not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error updating Challenge'
            });
        }
    }

    // Delete a Challenge by Id
    static async deleteChallengeById(req, res) {
        const { id } = req.body;
        try {
            const deletedRowCount = await Challenge.destroy({ where: { id } });
            if (deletedRowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Challenge deleted successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Challenge not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error deleting Challenge'
            });
        }
    }
}

module.exports = ChallengeController;
