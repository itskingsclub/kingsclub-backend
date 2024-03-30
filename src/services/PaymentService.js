const Payment = require('../models/Payment')

class PaymentService {
    static async createPayment(payload) {
        const { user_id } = payload.body;
        console.log("PV 1", payload.files)
        try {
            const newPayment = await Payment.create({
                ...payload?.body,
                updated_by: user_id,
                type: payload?.type,
                payment_mode: "Admin",
                payment_status: "Pending",
                ...(payload?.files?.image && {
                    image: payload?.files?.image[0]?.filename,
                }),
            });

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