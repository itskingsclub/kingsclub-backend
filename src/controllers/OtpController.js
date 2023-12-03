const Otp = require('../models/Otp');
const { generateOtp, sendOtp } = require('../utils/otpUtils');

class OtpController {
    static async sendOtp(userId) {
        const otp = generateOtp(); // Implement your OTP generation logic
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now

        await Otp.createOtp(userId, otp, expiry);
        await sendOtp(userId, otp); // Implement your OTP sending logic

        return { message: 'OTP sent successfully' };
    }

    static async verifyOtp(userId, otp) {
        const otpRecord = await Otp.getOtp(userId);

        if (otpRecord && otpRecord.otp === otp) {
            // Clear OTP after successful verification
            await Otp.clearOtp(userId);
            return { message: 'OTP verified successfully' };
        } else {
            throw new Error('Invalid OTP');
        }
    }

    static async resendOtp(userId) {
        const existingOtp = await Otp.getOtp(userId);

        if (existingOtp) {
            await Otp.clearOtp(userId);
        }

        const otp = generateOtp(); // Implement your OTP generation logic
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now

        await Otp.createOtp(userId, otp, expiry);
        await sendOtp(userId, otp); // Implement your OTP sending logic

        return { message: 'OTP resent successfully' };
    }
}

module.exports = OtpController;
