const dotenv = require('dotenv');
const User = require('../models/User');
const OtpService = require("../services/OtpService");
const { generateInviteCode } = require("../utils/numberUtils");
const Challenge = require('../models/Challenge');
const { Op } = require('sequelize');

dotenv.config();

class UserController {
    // Create a new user
    static async createUser(req, res) {
        const { mobile, name } = req.body;
        try {
            const user = await User.findOne({ where: { mobile } });
            if (user) {
                res.status(409).json({
                    success: false,
                    message: "You have Already An Account, please login",
                });
            } else {
                const newUser = await User.create({ ...req.body, invite_code: generateInviteCode(), game_coin: 500, account_holder_name: name, profile: req.file ? req.file.filename : null });
                const sendOtp = await OtpService.sendOtp(mobile);
                if (sendOtp?.success) {
                    res.status(200).json({
                        success: true,
                        message: sendOtp?.message,
                        data: sendOtp?.data
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Error register user'
                    });
                }
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    // Get all users
    static async getAllUsers(req, res) {
        try {
            const { offset, limit, sort, order, name, mobile } = req?.query;
            const whereCondition = {};
            if (name && mobile) {
                // Search for users where both name and mobile match
                whereCondition[Op.and] = [
                    { name: { [Op.like]: `%${name}%` } },
                    { mobile: { [Op.like]: `%${mobile}%` } }
                ];
            } else {
                // Search for users where either name or mobile matches
                whereCondition[Op.or] = [];

                if (name !== "") {
                    whereCondition[Op.or].push({ name: { [Op.like]: `%${name}%` } });
                }
                if (mobile !== "") {
                    whereCondition[Op.or].push({ mobile: { [Op.like]: `%${mobile}%` } });
                }
            }
            const { count, rows: Users } = await User.findAndCountAll({
                ...((name || mobile) && {
                    where: whereCondition,
                }),
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
                message: "All user fetched successfully",
                data: {
                    users: Users,
                    totalCount: count,
                },
            });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Error fetching users' });
        }
    }

    // Get a specific user by Id
    static async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await User.findOne({ where: { id } });
            if (user) {
                res.status(200).json({
                    success: true,
                    message: "User fetched successfully",
                    data: user
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user'
            });
        }
    }

    // Update a user by Id
    static async updateUserById(req, res) {
        const { id } = req.body;
        try {
            const [updatedRowsCount] = await User.update(
                {
                    ...req.body,
                    ...(req?.files?.profile && {
                        profile: req?.files?.profile[0]?.filename,
                    })
                }
                , { where: { id } });
            if (updatedRowsCount > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Profile updated successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error updating user 1'
            });
        }
    }

    // Delete a user by Id
    static async deleteUserById(req, res) {
        const { id } = req.body;
        try {
            const deletedRowCount = await User.destroy({ where: { id } });
            if (deletedRowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: 'User deleted successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error deleting user'
            });
        }
    }

    // Log In User 
    static async logInUser(req, res) {
        const { mobile } = req.body;
        try {
            const user = await User.findOne({ where: { mobile } });
            if (user) {
                const sendOtp = await OtpService.sendOtp(mobile);
                if (sendOtp?.success) {
                    res.status(200).json({
                        success: true,
                        message: sendOtp?.message,
                        data: sendOtp?.data
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: 'Error login user'
                    });
                }

            } else {
                res.status(404).json({
                    success: false,
                    message: "don't find any account for this number"
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    // verify Pin
    static async verifyPin(req, res) {
        const { mobile, pin } = req.body;
        try {
            const user = await User.findOne({ where: { mobile } });
            if (user) {
                const verifyOTP = await OtpService.verifyOTP(mobile, pin);
                if (verifyOTP?.success) {
                    res.status(200).json({
                        success: true,
                        message: verifyOTP?.message,
                        win_percentage: process.env.WIN_PERCENTAGE,
                        token: verifyOTP?.token,
                        data: user,
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: verifyOTP?.message,
                    });
                }

            } else {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    // Update a user service
    static async updateUserService(req, res) {
        const { amount, creator, } = req.body;
        try {
            const [updatedRowsCount] = await User.update(req.body, { where: { id: creator } });
            if (updatedRowsCount > 0) {
                res.status(200).json({
                    success: true,
                    message: 'User updated successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error updating user'
            });
        }
    }

    static async leaderboard(req, res) {
        try {
            let from_date = req.query.from_date;
            let to_date = req.query.to_date;

            let dateCondition = {};
            if (from_date && to_date) {
                dateCondition = {
                    createdAt: {
                        [Op.between]: [from_date, to_date],
                    },
                };
            }
            const users = await User.findAll();
            const leaderboardData = [];
            for (const user of users) {
                const challenges = await Challenge.findAll({
                    where: {
                        [Op.or]: [
                            { creator: user.id, creator_result: 'Win' },
                            { joiner: user.id, joiner_result: 'Win' }
                        ],
                        ...dateCondition,
                    }
                });
                const totalWinCoin = challenges.reduce((total, challenge) => {
                    return total + (challenge.creator === user.id ? ((challenge.amount * 17) / 10) : -((challenge.amount * 17) / 10));
                }, 0);
                if (totalWinCoin !== 0) {
                    leaderboardData.push({
                        id: user.id,
                        mobile: user.mobile,
                        profile: user.profile,
                        totalWinCoin
                    });
                }
            }
            leaderboardData.sort((a, b) => b.totalWinCoin - a.totalWinCoin);

            // Pagination
            const { offset, limit } = req.pagination;
            const paginatedData = leaderboardData.slice(offset, offset + limit);

            res.json({
                success: true,
                message: "Leaderboard fetched successfully",
                data: {
                    leaderboard: paginatedData
                }
            });
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            res.status(500).json({
                success: false,
                message: "Error fetching leaderboard",
                error: error.message
            });
        }
    };


}

module.exports = UserController;