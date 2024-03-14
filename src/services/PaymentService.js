const Payment = require('../models/Payment')

class PaymentService {
    static async createPayment(payload) {
        const { user_id } = payload.body;
        console.log("payload", {
            ...payload?.body,
            updated_by: payload?.updated_by,
            type: payload?.type,
            payment_mode: payload?.payment_mode,
            payment_status: payload?.payment_status,
            ...(payload?.user_id && {
                user_id: payload?.user_id,
            }),
            ...(payload?.amount && {
                amount: payload?.amount,
            }),
            ...(payload?.files?.image && {
                image: payload?.files?.image[0]?.filename,
            }),
        })
        try {
            const newPayment = await Payment.create({
                ...payload?.body,
                updated_by: payload?.updated_by,
                type: payload?.type,
                payment_mode: payload?.payment_mode,
                payment_status: payload?.payment_status,
                ...(payload?.user_id && {
                    user_id: payload?.user_id,
                }),
                ...(payload?.amount && {
                    amount: payload?.amount,
                }),
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