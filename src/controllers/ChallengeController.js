const dotenv = require('dotenv');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { Op } = require("sequelize");
const { getChallengeStatus, hasPendingResults } = require("../utils/resultUtils");
const { calculateCoinDeductions } = require("../utils/numberUtils");
const PaymentService = require('../services/PaymentService');

dotenv.config();

class ChallengeController {
    // Create a new Challenge
    static async createChallenge(req, res) {
        const { creator, amount } = req.body;
        const expiry_time = new Date(Date.now() + 30 * 60 * 1000); // Set Challenge expiry to 30 minutes from now
        try {
            const creatorUser = await User.findOne({ where: { id: creator } });
            const deductions = calculateCoinDeductions(creatorUser?.game_coin, creatorUser?.win_coin, creatorUser?.refer_coin, amount)
            const lastChallenge = await Challenge.findOne({
                where: {
                    [Op.or]: [{ creator }, { joiner: creator }],
                },
                order: [['createdAt', 'DESC']]
            });
            const pendingResults = hasPendingResults(lastChallenge, creator);

            if (pendingResults) {
                return res.status(400).json({
                    success: false,
                    message: 'Submit result for last challenge before creating a new challenge',
                });
            }
            else {
                if (!creatorUser || deductions?.remainingCoinRequired > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "You don't enough coins for the challenge",
                    });
                }
                else {
                    if (parseFloat(amount) < 50) {
                        return res.status(400).json({
                            success: false,
                            message: 'Amount Should be minimum of 50',
                        });
                    }

                    // Check if amount is a multiple of 10
                    if (parseFloat(amount) % 10 !== 0) {
                        return res.status(400).json({
                            success: false,
                            message: 'Amount Should be multiple of 10',
                        });
                    }
                    const newChallenge = await Challenge.create({ ...req.body, expiry_time, creator_result: 'Waiting', challenge_status: 'Waiting', updated_by: creator });

                    creatorUser.game_coin -= deductions?.gameCoinDeduction;
                    creatorUser.win_coin -= deductions?.winCoinDeduction;
                    creatorUser.refer_coin -= deductions?.referCoinDeduction;
                    await creatorUser.save();

                    const payment = await PaymentService.createPayment({ ...req, type: 'Create Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: creator, user_id: creator, payment_id: newChallenge?.id });
                    if (payment?.success) {
                        res.status(201).json({
                            success: true,
                            message: "Challenge created successfully",
                            data: newChallenge
                        });
                    }
                    else {
                        res.status(500).json({
                            success: false,
                            message: 'Error creating challenge'
                        });
                    }
                }
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
            const { offset, limit, sort, order } = req?.query;
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
                ...(offset && {
                    offset: Number(offset),
                }),
                ...(limit && {
                    limit: Number(limit),
                }),
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

    // Get all review Challenges
    static async getAllReview(req, res) {
        try {
            const { offset, limit, sort, order } = req?.query;
            const { count, rows: Challenges } = await Challenge.findAndCountAll({
                where: {
                    challenge_status: 'Review'
                },
                include: [
                    { model: User, as: 'creatorUser' },
                    { model: User, as: 'joinerUser' },
                ],
                order: [[sort || 'updatedAt', order || 'DESC']],
                ...(offset && {
                    offset: Number(offset),
                }),
                ...(limit && {
                    limit: Number(limit),
                }),
            });

            res.status(200).json({
                success: true,
                message: "All Review Challenge fetched successfully",
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
                        const deductions = calculateCoinDeductions(joinerUser?.game_coin, joinerUser?.win_coin, joinerUser?.refer_coin, amount)

                        if (!joinerUser || deductions?.remainingCoinRequired > 0) {
                            return res.status(400).json({
                                success: false,
                                message: "You don't have enough coins for the join challenge",
                            });
                        }
                        else {
                            const [updatedRowsCount] = await Challenge.update(req.body, { where: { id } });
                            if (updatedRowsCount > 0) {
                                joinerUser.game_coin -= deductions?.gameCoinDeduction;
                                joinerUser.win_coin -= deductions?.winCoinDeduction;
                                joinerUser.refer_coin -= deductions?.referCoinDeduction;
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
        const { id, offset, limit, sort, order } = req?.query;
        try {
            const { count, rows: Challenges } = await Challenge.findAndCountAll({
                where: {
                    [Op.or]: [{ creator: Number(id) }, { joiner: Number(id) }],
                },
                include: [
                    { model: User, as: 'creatorUser' },
                    { model: User, as: 'joinerUser' },
                ],
                order: [[sort || 'updatedAt', order || 'DESC']],
                ...(offset && {
                    offset: Number(offset),
                }),
                ...(limit && {
                    limit: Number(limit),
                }),
            });

            res.json({
                success: true,
                message: 'Challenges fetched successfully',
                data: {
                    challenges: Challenges,
                    totalCount: count,
                },
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
            if (challenge) {
                const { creator: _creator, joiner: _joiner, creator_result: _creator_result, joiner_result: _joiner_result, amount } = challenge?.dataValues;
                if (creator && creator_result) {
                    if (creator == _creator) {
                        const creatorUser = await User.findOne({ where: { id: challenge.creator } });
                        const joinerUser = await User.findOne({ where: { id: challenge.joiner } });
                        const status = getChallengeStatus(creator_result, _joiner_result);
                        const [updatedRowsCount] = await Challenge.update({ ...req.body, challenge_status: status, creator_result, updated_by, creator_result_image: req.files.creator_result_image ? req.files.creator_result_image[0].filename : null }, { where: { id } });
                        if (status === "Clear") {
                            if (creator_result === "Win") {
                                creatorUser.win_coin += (challenge.amount * process.env.WIN_PERCENTAGE) / 100;
                                await creatorUser.save();

                                await PaymentService.createPayment({ ...req, type: 'Win Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.creator, user_id: challenge?.creator, payment_id: id, amount: challenge.amount });

                                if (creatorUser.referral_code) {
                                    const referralUser = await User.findOne({ where: { invite_code: creatorUser.referral_code } });
                                    if (referralUser) {
                                        referralUser.refer_coin += (challenge.amount * process.env.REFER_PERCENTAGE) / 100;
                                        await referralUser.save();

                                        await PaymentService.createPayment({ ...req, type: 'Referral', payment_mode: "User", payment_status: "Sucessfull", updated_by: referralUser?.id, user_id: referralUser?.id, payment_id: id, amount: (challenge.amount * process.env.REFER_PERCENTAGE) / 100 });
                                    }
                                }
                            } else {
                                joinerUser.win_coin += (challenge.amount * process.env.WIN_PERCENTAGE) / 100;
                                await joinerUser.save();

                                await PaymentService.createPayment({ ...req, type: 'Win Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.joiner, user_id: challenge?.joiner, payment_id: id, amount: challenge.amount });

                                if (joinerUser.referral_code) {
                                    const referralUser = await User.findOne({ where: { invite_code: joinerUser.referral_code } });
                                    if (referralUser) {
                                        referralUser.refer_coin += (challenge.amount * process.env.REFER_PERCENTAGE) / 100;
                                        await referralUser.save();

                                        await PaymentService.createPayment({ ...req, type: 'Referral', payment_mode: "User", payment_status: "Sucessfull", updated_by: referralUser?.id, user_id: referralUser?.id, payment_id: id, amount: (challenge.amount * process.env.REFER_PERCENTAGE) / 100 });
                                    }
                                }
                            }
                        }
                        else if (status === "Cancel") {
                            creatorUser.game_coin += challenge.amount;
                            await creatorUser.save();

                            await PaymentService.createPayment({ ...req, type: 'Cancel Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.creator, user_id: challenge?.creator, payment_id: id, amount: challenge.amount });

                            if (joinerUser) {
                                joinerUser.game_coin += challenge.amount;
                                await joinerUser.save();

                                await PaymentService.createPayment({ ...req, type: 'Cancel Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.joiner, user_id: challenge?.joiner, payment_id: id, amount: challenge.amount });
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
                        const [updatedRowsCount] = await Challenge.update({ ...req.body, challenge_status: status, joiner_result, updated_by, joiner_result_image: req.files.joiner_result_image ? req.files.joiner_result_image[0].filename : null }, { where: { id } });
                        if (status === "Clear") {
                            if (joiner_result === "Win") {
                                joinerUser.win_coin += (challenge.amount * process.env.WIN_PERCENTAGE) / 100;
                                await joinerUser.save();

                                await PaymentService.createPayment({ ...req, type: 'Win Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.joiner, user_id: challenge?.joiner, payment_id: id, amount: challenge.amount });

                                if (joinerUser.referral_code) {
                                    const referralUser = await User.findOne({ where: { invite_code: joinerUser.referral_code } });
                                    if (referralUser) {
                                        referralUser.refer_coin += (challenge.amount * process.env.REFER_PERCENTAGE) / 100;
                                        await referralUser.save();

                                        await PaymentService.createPayment({ ...req, type: 'Referral', payment_mode: "User", payment_status: "Sucessfull", updated_by: referralUser?.id, user_id: referralUser?.id, payment_id: id, amount: (challenge.amount * process.env.REFER_PERCENTAGE) / 100 });
                                    }
                                }
                            } else {
                                creatorUser.win_coin += (challenge.amount * process.env.WIN_PERCENTAGE) / 100;
                                await creatorUser.save();

                                await PaymentService.createPayment({ ...req, type: 'Win Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.creator, user_id: challenge?.creator, payment_id: id, amount: challenge.amount });

                                if (creatorUser.referral_code) {
                                    const referralUser = await User.findOne({ where: { invite_code: creatorUser.referral_code } });
                                    if (referralUser) {
                                        referralUser.refer_coin += (challenge.amount * process.env.REFER_PERCENTAGE) / 100;
                                        await referralUser.save();

                                        await PaymentService.createPayment({ ...req, type: 'Referral', payment_mode: "User", payment_status: "Sucessfull", updated_by: referralUser?.id, user_id: referralUser?.id, payment_id: id, amount: (challenge.amount * process.env.REFER_PERCENTAGE) / 100 });
                                    }
                                }
                            }
                        }
                        else if (status === "Cancel") {
                            creatorUser.game_coin += challenge.amount;
                            joinerUser.game_coin += challenge.amount;
                            await creatorUser.save();
                            await joinerUser.save();

                            await PaymentService.createPayment({ ...req, type: 'Cancel Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.creator, user_id: challenge?.creator, payment_id: id, amount: challenge.amount });
                            await PaymentService.createPayment({ ...req, type: 'Cancel Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.joiner, user_id: challenge?.joiner, payment_id: id, amount: challenge.amount });
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

    // Clear a Challenge
    static async clearChallenge(req, res) {
        const { admin_id, id, creator_result, joiner_result } = req.body;
        try {
            const user = await User.findOne({ where: { id: admin_id } });
            if (user && user.admin) {
                const challenge = await Challenge.findOne({ where: { id } });
                if (challenge) {
                    const joinerUser = await User.findOne({ where: { id: challenge.joiner } });
                    console.log("joinerUser44", joinerUser.win_coin)
                    const creatorUser = await User.findOne({ where: { id: challenge.creator } });
                    console.log("creatorUser44", creatorUser.win_coin)

                    if (!(creator_result === "Win" && joiner_result === "Win") && !((creator_result === "Cancel" && joiner_result !== "Cancel") || (creator_result !== "Cancel" && joiner_result === "Cancel"))) {

                        if (creatorUser) {
                            if (creator_result === "Win") {

                                creatorUser.win_coin += (challenge.amount * process.env.WIN_PERCENTAGE) / 100;
                                await creatorUser.save();

                                await PaymentService.createPayment({ ...req, type: 'Win Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.creator, user_id: challenge?.creator, payment_id: id, amount: challenge.amount });

                                if (creatorUser.referral_code) {
                                    const referralUser = await User.findOne({ where: { invite_code: creatorUser.referral_code } });
                                    if (referralUser) {
                                        referralUser.refer_coin += (challenge.amount * process.env.REFER_PERCENTAGE) / 100;
                                        await referralUser.save();

                                        await PaymentService.createPayment({ ...req, type: 'Referral', payment_mode: "User", payment_status: "Sucessfull", updated_by: referralUser?.id, user_id: referralUser?.id, payment_id: id, amount: (challenge.amount * process.env.REFER_PERCENTAGE) / 100 });
                                    }
                                }
                            }

                            else if (creator_result === "Cancel") {
                                creatorUser.game_coin += challenge.amount;
                                await creatorUser.save();

                                await PaymentService.createPayment({ ...req, type: 'Cancel Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.creator, user_id: challenge?.creator, payment_id: id, amount: challenge.amount });
                            }
                        }

                        if (joinerUser) {
                            if (joiner_result === "Win") {
                                joinerUser.win_coin += (challenge.amount * process.env.WIN_PERCENTAGE) / 100;
                                await joinerUser.save();

                                await PaymentService.createPayment({ ...req, type: 'Win Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.joiner, user_id: challenge?.joiner, payment_id: id, amount: challenge.amount });

                                if (joinerUser.referral_code) {
                                    const referralUser = await User.findOne({ where: { invite_code: joinerUser.referral_code } });
                                    if (referralUser) {
                                        referralUser.refer_coin += (challenge.amount * process.env.REFER_PERCENTAGE) / 100;
                                        await referralUser.save();

                                        await PaymentService.createPayment({ ...req, type: 'Referral', payment_mode: "User", payment_status: "Sucessfull", updated_by: referralUser?.id, user_id: referralUser?.id, payment_id: id, amount: (challenge.amount * process.env.REFER_PERCENTAGE) / 100 });
                                    }
                                }
                            }

                            else if (joiner_result === "Cancel") {
                                joinerUser.game_coin += challenge.amount;
                                await joinerUser.save();

                                await PaymentService.createPayment({ ...req, type: 'Cancel Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: challenge?.joiner, user_id: challenge?.joiner, payment_id: id, amount: challenge.amount });
                            }
                        }

                        const [updatedRowsCount] = await Challenge.update(req.body, { where: { id } });
                        if (updatedRowsCount > 0) {
                            res.status(200).json({
                                success: true,
                                message: 'Challenge updated successfully'
                            });
                        } else {
                            res.status(404).json({
                                success: false,
                                message: 'Error updating Challenge'
                            });
                        }
                    }
                    else {
                        res.status(500).json({
                            success: false,
                            message: 'Invalid Challenge results'
                        });
                    }

                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Challenge not found'
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Not a valid admin'
                });
            }
        } catch (error) {
            console.error("error2", error);
            res.status(500).json({
                success: false,
                message: 'Error updating challenge result'
            });
        }
    }

    // Accept a Challenge by Id
    static async acceptChallengeById(req, res) {
        const { id, joiner } = req.body;
        try {
            const challenge = await Challenge.findOne({ where: { id } });

            if (challenge) {
                const { creator, amount, joiner: oldJoiner } = challenge;
                if (joiner) {
                    if (oldJoiner) {
                        res.status(500).json({
                            success: false,
                            message: 'Challenge is not available now'
                        });
                    }
                    else {

                        const lastChallenge = await Challenge.findOne({
                            where: {
                                [Op.or]: [{ joiner }, { creator: joiner }],
                            },
                            order: [['createdAt', 'DESC']]
                        });
                        const pendingResults = hasPendingResults(lastChallenge, joiner);

                        if (pendingResults) {
                            return res.status(400).json({
                                success: false,
                                message: 'Submit result for last challenge before creating a new challenge',
                            });
                        }
                        else {
                            if (creator != joiner) {
                                const joinerUser = await User.findOne({ where: { id: joiner } });
                                const deductions = calculateCoinDeductions(joinerUser?.game_coin, joinerUser?.win_coin, joinerUser?.refer_coin, amount)

                                if (!joinerUser || deductions?.remainingCoinRequired > 0) {
                                    return res.status(400).json({
                                        success: false,
                                        message: "You don't have enough coins for the challenge",
                                    });
                                }
                                else {
                                    const [updatedRowsCount] = await Challenge.update(req.body, { where: { id } });
                                    if (updatedRowsCount > 0) {
                                        joinerUser.game_coin -= deductions?.gameCoinDeduction;
                                        joinerUser.win_coin -= deductions?.winCoinDeduction;
                                        joinerUser.refer_coin -= deductions?.referCoinDeduction;
                                        await joinerUser.save();

                                        const payment = await PaymentService.createPayment({ ...req, type: 'Accept Challenge', payment_mode: "User", payment_status: "Sucessfull", updated_by: joiner, user_id: joiner, amount: amount, payment_id: id });
                                        if (payment?.success) {
                                            res.status(200).json({
                                                success: true,
                                                message: "Challenge accepted successfully",
                                            });
                                        }
                                        else {
                                            res.status(500).json({
                                                success: false,
                                                message: 'Error accepting challenge'
                                            });
                                        }
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

}

module.exports = ChallengeController;
