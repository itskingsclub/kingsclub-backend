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
                offset: Number(offset),
                limit: Number(limit),
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
            res.status(500).json({ success: false, error: 'Error fetching Payments' });
        }
    }

    // Fetch payment for the user
    static async getAllPaymentForUser(req, res) {
        const { id } = req.body;
        try {
            const payemnts = await Payment.findAll({
                where: {
                    [Op.or]: [{ user_id: id }],
                }
            });
            res.json({
                success: true,
                message: 'Payements fetched successfully',
                data: payemnts,
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
        console.log(req.body)
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
    static async createWithdrawal(req, res) {
        const { user_id, amount } = req.body;

        try {
            const user = await User.findOne({ where: { id: user_id } });
            if (!user || user?.dataValues?.game_coin < amount) {
                return res.status(400).json({
                    success: false,
                    message: 'User does not have enough coins to withdrawal',
                });
            } else {
                const payment = await PaymentService.createPayment({ ...req.body, type: 'Withdraw' });
                user.game_coin -= amount;
                await user.save();
                if (payment?.success) {
                    res.status(200).json({
                        success: true,
                        message: "Coin withdrawal successfully",
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
        const { user_id, amount } = req.body;
        try {
            const user = await User.findOne({ where: { id: user_id } });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            } else {
                const payment = await PaymentService.createPayment({ ...req.body, type: 'Deposit' });
                const newTotalCoin = parseFloat(user.game_coin) + amount;
                user.game_coin = newTotalCoin;
                await user.save();
                if (payment?.success) {
                    res.status(200).json({
                        success: true,
                        message: "Coin deposit successfully",
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

}

module.exports = PaymentController;
