const db = require('../config/db');

class Otp {
    static async createOtp(userId, otp, expiry) {
        const [result] = await db.execute('INSERT INTO otps (user_id, otp, expiry) VALUES (?, ?, ?)', [userId, otp, expiry]);

        return result.insertId;
    }

    static async getOtp(userId) {
        const [rows] = await db.execute('SELECT * FROM otps WHERE user_id = ? AND expiry > NOW() ORDER BY id DESC LIMIT 1', [
            userId,
        ]);

        return rows[0];
    }

    static async clearOtp(userId) {
        const [result] = await db.execute('DELETE FROM otps WHERE user_id = ?', [userId]);

        return result.affectedRows > 0;
    }
}

module.exports = Otp;
