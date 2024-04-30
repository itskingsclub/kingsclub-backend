const Payment = require('../models/Payment')

class PaymentService {
    static async createPayment(payload) {
        try {
            const newPayment = await Payment.create({
                user_id: payload?.user_id,
                payment_mode: payload?.payment_mode,
                payment_status: payload?.payment_status,
                type: payload?.type,
                updated_by: payload?.updated_by,
                amount: payload?.amount,
                ...(payload?.payment_id && {
                    payment_id: payload?.payment_id,
                }),
                ...(payload?.files?.image && {
                    image: payload?.files?.image[0]?.filename,
                }),
                ...payload?.body,
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
            console.log("PV", error)
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