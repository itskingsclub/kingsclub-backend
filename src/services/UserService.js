const UserController = require('../controllers/UserController');

class UserService {
    static async sendOtp(mobile_number) {
        // Send OTP
        const res = await UserController.sendOtp(mobile_number);
        return res;
    }

    static async getUser(mobile_number) {
        // Send OTP
        const res = await UserController.getUser(mobile_number);
        return res;
    }
}

module.exports = UserService;