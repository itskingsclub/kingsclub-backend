const OtpController = require('../controllers/OtpController');
class OtpService {
    static async sendOtp(mobile) {
        const response = await OtpController.createOTP(mobile);
        return response;
    }

    static async verifyOTP(mobile, pin) {
        const response = await OtpController.verifyOTP(mobile, pin);
        return response;
    }
}

module.exports = OtpService;