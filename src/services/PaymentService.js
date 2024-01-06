const Payment = require('../models/Payment')

class PaymentService {
    static async createPayment(payload) {
        console.log("PV payload", payload)
        try {
            console.log("PV", { ...payload, payment_mode: "Upi", payment_status: "Sucessfull" })
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

    static async verifyOTP(mobile, pin) {
        const response = await OtpController.verifyOTP(mobile, pin);
        return response;
    }
}

module.exports = PaymentService;