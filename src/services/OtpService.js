const OtpController = require('../controllers/OtpController');

class OtpService {
    static async sendOtp(mobile_number) {
        // Send OTP
        const res = await OtpController.sendOtp(mobile_number);
        return res;
    }
}

module.exports = OtpService;