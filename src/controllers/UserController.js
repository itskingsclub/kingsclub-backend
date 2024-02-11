const User = require('../models/User');
const OtpService = require("../services/OtpService");
const { generateInviteCode } = require("../utils/numberUtils");
class UserController {
    // Create a new user
    static async createUser(req, res) {
        const { mobile } = req.body;
        try {
            const user = await User.findOne({ where: { mobile } });
            if (user) {
                res.status(409).json({
                    success: false,
                    message: "User already exists, please login",
                });
            } else {
                const newUser = await User.create({ ...req.body, invite_code: generateInviteCode(), game_coin: 500, profile: req.file ? req.file.filename : null });
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
            const { offset, limit, sort, order } = req?.query;
            const { count, rows: Users } = await User.findAndCountAll({
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
                    ...(req?.files?.profile[0]?.filename && {
                        profile: req?.files?.profile[0]?.filename,
                    }),
                }
                , { where: { id } });
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

}

module.exports = UserController;