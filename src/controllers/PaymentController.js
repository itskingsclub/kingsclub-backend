const Payment = require('../models/Payment')
const User = require('../models/User');
const { Op } = require("sequelize");

class PaymentController {
    // Create a new payment
    static async createPayment(req, res) {
        const { user_id } = req.body;
        try {
            const user = await User.findOne({ where: { id:user_id } });
            if (user) {
                const newPayment = await Payment.create({ ...req.body, updated_by: user_id, payment_mode: "Upi",payment_status: "Sucessfull",type:'Withdraw' });
                res.status(201).json({
                    success: true,
                    message: "Payment created successfully",
                    data: newPayment
                });
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
    
    // Get all Payments
    static async getAllPayments(req, res) {
        try {
            const Payments = await Payment.findAll({});
            res.status(200).json({
                success: true,
                message: "All Payments fetched successfully",
                data: Payments
            });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Error fetching Payments' });
        }
    }

        static async getAllPaymentForUser(req, res) {
            const { id} = req.body;
    
            try {
                // Fetch challenges where the user is the creator or joiner
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
    
    // Update a user by Id
    static async updatePaymentById(req, res) {
        const { id,  updated_by } = req.body;
        try {
            const payment = await Payment.findOne({ 
                where: { 
                    id: id,
                    updated_by: updated_by
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
    
    // Delete a Payment by Id
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
}

module.exports = PaymentController;
