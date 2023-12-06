const OtpController = require('../controllers/OtpController');

class OtpService {
    static async sendOtp(userId) {
        // Send OTP
        const res = await OtpController.sendOtp(userId);
        return res;
    }
}

module.exports = OtpService;