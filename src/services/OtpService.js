const OtpController = require('../controllers/OtpController');

class OtpService {
    static async sendOtp(mobile_number) {
        // Send OTP
        const res = await OtpController.sendOTP(mobile_number);
        return res;
    }

    static async getOtp(mobile_number) {
        // Send OTP
        const res = await OtpController.getOtp(mobile_number);
        return res;
    }
}

module.exports = OtpService;