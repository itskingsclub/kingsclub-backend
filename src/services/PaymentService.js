const Payment = require('../models/Payment')

class PaymentService {
    static async createPayment(payload) {
        const { user_id } = payload;
        try {
            const newPayment = await Payment.create({ ...payload, payment_mode: "Upi", payment_status: "Sucessfull", updated_by: user_id });

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

    static async verifyOTP(mobile, pin) {
        const response = await OtpController.verifyOTP(mobile, pin);
        return response;
    }
}

module.exports = PaymentService;