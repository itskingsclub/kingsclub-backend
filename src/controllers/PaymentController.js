const Payment = require('../models/Payment')
const User = require('../models/User');
const { Op } = require("sequelize");
const PaymentService = require("../services/PaymentService");

class PaymentController {
    // Create a new payment
    static async createPayment(payload) {
        try {
            const newPayment = await Payment.create({ ...payload, payment_mode: "Upi", payment_status: "Sucessfull" });
            if (newPayment) {
                return {
                    success: true,
                    message: "Payment created successfully",
                    data: newPayment
                }
            }
            return {
                success: false,
                message: "Error creting payment"
            }
        } catch (error) {
            return {
                success: false,
                message: "Internal Server Error",
            }
        }
    }

    // Get all Payments
    static async getAllPayments(req, res) {
        try {
            const { offset, limit, sort, order } = req?.query;
            const { count, rows: Payments } = await Payment.findAndCountAll({
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
                message: "All Payments fetched successfully",
                data: {
                    payments: Payments,
                    totalCount: count,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error fetching Payments'
            });
        }
    }

    // Fetch payment for the user
    static async getAllPaymentForUser(req, res) {
        const { id, offset, limit, sort, order } = req?.query;
        try {
            const { count, rows: Payments } = await Payment.findAndCountAll({
                where: {
                    [Op.or]: [{ user_id: id }],
                },
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
                message: 'Payments fetched successfully',
                data: {
                    payments: Payments,
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

    // Get a specific payment by Id
    static async getPaymentById(req, res) {
        const { id } = req.params;
        try {
            const payment = await Payment.findOne({ where: { id } });

            if (payment) {
                res.status(200).json({
                    success: true,
                    message: "Payment fetched successfully",
                    data: payment
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error fetching payment'
            });
        }
    }

    // Update a payment by Id
    static async updatePaymentById(req, res) {
        const { id } = req.body;
        try {
            const payment = await Payment.findOne({
                where: {
                    id: id
                }
            });
            if (payment) {
                await payment.update(req.body);
                res.status(200).json({
                    success: true,
                    message: 'Payment updated successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Payment not found for the user'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error updating Payment'
            });
        }
    }

    // Delete a payment by Id
    static async deletePaymentById(req, res) {
        const { id } = req.body;
        try {
            const deletedRowCount = await Payment.destroy({ where: { id } });
            if (deletedRowCount > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Payment deleted successfully'
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error deleting Payment'
            });
        }
    }

    // Create a withdrawal payment
    static async createWithdraw(req, res) {
        const { user_id, amount } = req.body;

        try {
            const user = await User.findOne({ where: { id: user_id } });
            if (!user || user?.dataValues?.win_coin < amount) {
                return res.status(400).json({
                    success: false,
                    message: "You don't have enough coins to withdrawal",
                });
            } else {
                if (parseFloat(amount) < 100) {
                    return res.status(400).json({
                        success: false,
                        message: 'Amount Should be mimimum of 100',
                    });
                }

                // Check if amount is a multiple of 10
                if (parseFloat(amount) % 50 !== 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Amount Should be multiple of 50',
                    });
                }
                const payment = await PaymentService.createPayment({ ...req, type: 'Withdraw' });
                if (payment?.success) {
                    user.win_coin -= parseFloat(amount);
                    await user.save();
                    res.status(200).json({
                        success: true,
                        message: "Coin withdrawal requested",
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Error withdrawing coin'
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

    // Create a deposit payment
    static async createDeposit(req, res) {
        const { user_id } = req.body;
        try {
            const user = await User.findOne({ where: { id: user_id } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            } else {
                const payment = await PaymentService.createPayment({ ...req, type: 'Deposit' });
                if (payment?.success) {
                    // const newTotalCoin = parseFloat(user.game_coin) + parseFloat(amount);
                    // user.game_coin = newTotalCoin;
                    // await user.save();
                    res.status(200).json({
                        success: true,
                        message: "Coin deposit requested",
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Error depositing coin'
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

    // Get all Deposit
    static async getAllDeposit(req, res) {
        try {
            const { offset, limit, sort, order } = req?.query;
            const { count, rows: Payments } = await Payment.findAndCountAll({
                where: {
                    type: 'Deposit',
                    payment_status: 'Pending'
                },
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
                message: "All Deposit Payments fetched successfully",
                data: {
                    payments: Payments,
                    totalCount: count,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error fetching Payments'
            });
        }
    }

    // Get all Withdraw
    static async getAllWithdraw(req, res) {
        try {
            const { offset, limit, sort, order } = req?.query;
            const { count, rows: Payments } = await Payment.findAndCountAll({
                where: {
                    type: 'Withdraw',
                    payment_status: 'Pending'
                },
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
                message: "All Withdraw Payments fetched successfully",
                data: {
                    payments: Payments,
                    totalCount: count,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Error fetching Payments'
            });
        }
    }

    // Update a deposit
    static async updateDeposit(req, res) {
        const { admin_id, user_id, id, amount } = req.body;
        try {
            const adminUser = await User.findOne({ where: { id: admin_id } });
            if (adminUser && adminUser.admin) {
                const payment = await Payment.findOne({
                    where: {
                        id: id
                    }
                });
                if (payment && payment.user_id == user_id && amount) {
                    await payment.update(req.body);
                    const user = await User.findOne({ where: { id: user_id } });
                    user.game_coin += amount;
                    await user.save();
                    res.status(200).json({
                        success: true,
                        message: 'Payment updated successfully'
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Payment not found for the user'
                    });
                }
            }
            else {
                res.status(404).json({
                    success: false,
                    message: 'Not a valid admin'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error updating Payment'
            });
        }
    }

    // Update a withdraw
    static async updateWithdraw(req, res) {
        const { admin_id, user_id, id } = req.body;
        try {
            const adminUser = await User.findOne({ where: { id: admin_id } });
            if (adminUser && adminUser.admin) {
                const payment = await Payment.findOne({
                    where: {
                        id: id
                    }
                });
                if (payment && payment.user_id == user_id) {
                    await payment.update(req.body);
                    res.status(200).json({
                        success: true,
                        message: 'Payment updated successfully'
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Payment not found for the user'
                    });
                }
            }
            else {
                res.status(404).json({
                    success: false,
                    message: 'Not a valid admin'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Error updating Payment'
            });
        }
    }

}

module.exports = PaymentController;
