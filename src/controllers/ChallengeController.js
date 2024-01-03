const Challenge = require('../models/Challenge');
const User = require('../models/User');
const OtpService = require("../services/OtpService");
const { Op } = require("sequelize");

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
            const Challenges = await Challenge.findAll({
                include: [
                    { model: User, as: 'creatorUser' },
                    { model: User, as: 'joinerUser' },
                ],
            });

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
            const challengeWithUsers = await Challenge.findByPk(id, {
                include: [
                    { model: User, as: 'creatorUser' },
                    { model: User, as: 'joinerUser' },
                ],
            });
            console.log()
            if (challenge) {
                res.status(200).json({
                    success: true,
                    message: "Challenge fetched successfully",
                    data: challengeWithUsers
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
        const { id, joiner, amount } = req.body;
        try {
            if (joiner) {
                const joinerUser = await User.findOne({ where: { id: joiner } });
                if (!joinerUser || joinerUser?.dataValues?.total_coin < amount) {
                    return res.status(400).json({
                        success: false,
                        message: 'Joiner does not have enough coins for the challenge',
                    });
                }
                else {
                    const [updatedRowsCount] = await Challenge.update(req.body, { where: { id } });
                    if (updatedRowsCount > 0) {
                        joinerUser.total_coin -= amount;
                        await joinerUser.save();
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
                }
            }
            else {
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

    static async getAllChallengesForUser(req, res) {
        const { id } = req.body;

        try {
            // Fetch challenges where the user is the creator or joiner
            const challenges = await Challenge.findAll({
                where: {
                    [Op.or]: [{ creator: id }, { joiner: id }],
                },
                include: [
                    { model: User, as: 'creatorUser' },
                    { model: User, as: 'joinerUser' },
                ],
            });

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

}

module.exports = ChallengeController;
