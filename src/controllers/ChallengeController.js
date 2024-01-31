const Challenge = require('../models/Challenge');
const User = require('../models/User');
const OtpService = require("../services/OtpService");
const { Op } = require("sequelize");
const { getChallengeStatus } = require("../utils/resultUtils");

class ChallengeController {
    // Create a new Challenge
    static async createChallenge(req, res) {
        const { creator, amount } = req.body;
        const expiry_time = new Date(Date.now() + 30 * 60 * 1000); // Set Challenge expiry to 30 minutes from now
        try {
            const creatorUser = await User.findOne({ where: { id: creator } });
            if (!creatorUser || creatorUser?.dataValues?.game_coin < amount) {
                return res.status(400).json({
                    success: false,
                    message: 'Creator does not have enough coins for the challenge',
                });
            }
            else {
                const newChallenge = await Challenge.create({ ...req.body, expiry_time, creator_result: 'Waiting', joiner_result: 'Waiting', challenge_status: 'Waiting', joiner_result: 'Waiting', updated_by: creator });

                creatorUser.game_coin -= amount;
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
            const { offset, limit, sort, order } = req.body;
            const expiry = new Date(Date.now() + 5 * 60 * 1000);
            const { count, rows: Challenges } = await Challenge.findAndCountAll({
                // where: {
                //     expiry_time: {
                //         [Op.gt]: expiry,
                //     },
                // },
                include: [
                    { model: User, as: 'creatorUser' },
                    { model: User, as: 'joinerUser' },
                ],
                order: [[sort || 'updatedAt', order || 'DESC']],
                offset,
                limit,
            });

            res.status(200).json({
                success: true,
                message: "All Challenge fetched successfully",
                data: {
                    challenges: Challenges,
                    totalCount: count,
                },
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
        const { id, joiner } = req.body;
        try {
            const challenge = await Challenge.findOne({ where: { id } });
            if (challenge) {
                const { creator, amount } = challenge?.dataValues;
                if (joiner) {
                    if (creator != joiner) {
                        const joinerUser = await User.findOne({ where: { id: joiner } });
                        if (!joinerUser || joinerUser?.dataValues?.game_coin < amount) {
                            return res.status(400).json({
                                success: false,
                                message: 'Joiner does not have enough coins for the challenge',
                            });
                        }
                        else {
                            const [updatedRowsCount] = await Challenge.update(req.body, { where: { id } });
                            if (updatedRowsCount > 0) {
                                joinerUser.game_coin -= amount;
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
                        res.status(500).json({
                            success: false,
                            message: 'Creater is not allowed for this action'
                        });
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
                        res.status(500).json({
                            success: false,
                            message: 'Error updating Challenge'
                        });
                    }
                }
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
                order: [['updatedAt', 'DESC']],
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

    // Update a Challenge result
    static async updateChallengeResult(req, res) {
        const { id, creator, joiner, creator_result, joiner_result, updated_by, amount } = req.body;
        try {
            const challenge = await Challenge.findOne({ where: { id } });
            console.log("challenge_status", challenge.challenge_status)
            if (challenge) {
                const { creator: _creator, joiner: _joiner, creator_result: _creator_result, joiner_result: _joiner_result, amount } = challenge?.dataValues;
                if (creator && creator_result) {
                    if (creator == _creator) {
                        const creatorUser = await User.findOne({ where: { id: challenge.creator } });
                        const joinerUser = await User.findOne({ where: { id: challenge.joiner } });
                        const status = getChallengeStatus(creator_result, _joiner_result);
                        const [updatedRowsCount] = await Challenge.update({ challenge_status: status, creator_result, updated_by, creator_result_image: req.files.creator_result_image ? req.files.creator_result_image[0].filename : null }, { where: { id } });
                        if(status === "Clear"){
                        if(creator_result === "Win"){
                            creatorUser.win_coin += ((challenge.amount - challenge.amount * 10 / 100) * 2);
                            await creatorUser.save();
                            if (creatorUser.referral_code) {
                                const referralUser = await User.findOne({ where: { invite_code: creatorUser.referral_code } });
                                referralUser.refer_coin += (challenge.amount * 5 / 100);
                                await referralUser.save();
                            }
                        } else{
                            joinerUser.win_coin += ((challenge.amount - challenge.amount * 10 / 100) * 2);
                            await joinerUser.save();
                            if (joinerUser.referral_code) {
                                const referralUser = await User.findOne({ where: { invite_code: joinerUser.referral_code } });
                                referralUser.refer_coin += (challenge.amount * 5 / 100);
                                await referralUser.save();
                            }
                        }
                        }
                        if (updatedRowsCount > 0) {
                            res.status(200).json({
                                success: true,
                                message: 'Challenge updated successfully'
                            });
                        } else {
                            res.status(500).json({
                                success: false,
                                message: 'Error updating Challenge'
                            });
                        }
                    }
                    else {
                        res.status(500).json({
                            success: false,
                            message: 'Joiner is not found in challenge'
                        });
                    }
                }
                else if (joiner && joiner_result) {
                    if (joiner == _joiner) {
                        const joinerUser = await User.findOne({ where: { id: challenge.joiner } });
                        const creatorUser = await User.findOne({ where: { id: challenge.creator } });
                        const status = getChallengeStatus(_creator_result, joiner_result);
                        const [updatedRowsCount] = await Challenge.update({ challenge_status: status, joiner_result, updated_by, joiner_result_image: req.files.joiner_result_image ? req.files.joiner_result_image[0].filename : null }, { where: { id } });
                        if(status === "Clear"){
                        if(joiner_result === "Win"){
                            joinerUser.win_coin += ((challenge.amount - challenge.amount * 10 / 100) * 2);
                                await joinerUser.save();
                            if (joinerUser.referral_code) {
                                const referralUser = await User.findOne({ where: { invite_code: joinerUser.referral_code } });
                                referralUser.refer_coin += (challenge.amount * 5 / 100);
                                await referralUser.save();
                            }
                            } else{
                            creatorUser.win_coin += ((challenge.amount - challenge.amount * 10 / 100) * 2);
                                await creatorUser.save();
                            if (creatorUser.referral_code) {
                                const referralUser = await User.findOne({ where: { invite_code: creatorUser.referral_code } });
                                referralUser.refer_coin += (challenge.amount * 5 / 100);
                                await referralUser.save();
                            }
                            }
                        }
                        if (updatedRowsCount > 0) {
                            res.status(200).json({
                                success: true,
                                message: 'Challenge updated successfully'
                            });
                        } else {
                            res.status(500).json({
                                success: false,
                                message: 'Error updating Challenge'
                            });
                        }
                    }
                    else {
                        res.status(500).json({
                            success: false,
                            message: 'Creator is not found in challenge'
                        });
                    }
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Error updating challenge result 2'
                    });
                }
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
                message: 'Error updating challenge result 1'
            });
        }
    }

}

module.exports = ChallengeController;
