const UserController = require('../controllers/UserController');

class UserService {
    static async sendOtp(mobile) {
        // Send OTP
        const res = await UserController.sendOtp(mobile);
        return res;
    }

    static async getUser(mobile) {
        // Send OTP
        const res = await UserController.getUser(mobile);
        return res;
    }
}

module.exports = UserService;