const Otp = require("../models/Otp");
const { generateOtp, sendOtp } = require("../utils/otpUtils");

class OtpController {
    static async sendOtp(mobile_number) {
        try {
            const code = generateOtp(); // Implement your OTP generation logic
            const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now

            const createOtp = await Otp.createOtp(mobile_number, code, expiry);
            await sendOtp(mobile_number, code); // Implement your OTP sending logic
            return { success: true, message: "OTP sent successfully" };
        } catch (error) {
            return {
                success: false,
                message: "Internal Server Error",
            };
        }
    }

    static async verifyOtp(mobile_number, code) {
        const otpRecord = await Otp.getOtp(mobile_number);

        if (otpRecord && otpRecord.code === code) {
            // Clear OTP after successful verification
            await Otp.clearOtp(mobile_number);
            return { message: "OTP verified successfully" };
        } else {
            throw new Error("Invalid OTP");
        }
    }

    static async resendOtp(userId) {
        const existingOtp = await Otp.getOtp(userId);

        if (existingOtp) {
            await Otp.clearOtp(userId);
        }

        const code = generateOtp(); // Implement your OTP generation logic
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now

        await Otp.createOtp(userId, code, expiry);
        await sendOtp(userId, code); // Implement your OTP sending logic

        return { message: "OTP resent successfully" };
    }

    static async deleteOtp(userId) {
        try {
            const cleared = await Otp.clearOtp(userId);
            return { cleared, message: "OTP deleted successfully" };
        } catch (error) {
            console.error(error);
            throw new Error("Error deleting OTP");
        }
    }
}

module.exports = OtpController;
