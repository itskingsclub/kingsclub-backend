const OtpController = require('../controllers/OtpController');

class OtpService {
    static async sendOtp(req, res) {
        // Send OTP
        const response = await OtpController.sendOTP(req, res);
        return response;
    }

    static async getOtp(mobile) {
        // Send OTP
        const res = await OtpController.getOtp(mobile);
        return res;
    }
}

module.exports = OtpService;