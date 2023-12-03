const db = require('../config/db');

class Otp {
    static async createOtp(userId, code, expiry) {
        const [result] = await db.execute('INSERT INTO otp (user_id, code, expiry) VALUES (?, ?, ?)', [userId, code, expiry]);
        return result.insertId;
    }

    static async getOtp(userId) {
        const [rows] = await db.execute('SELECT * FROM otp WHERE user_id = ? AND expiry > NOW() ORDER BY id DESC LIMIT 1', [
            userId,
        ]);

        return rows[0];
    }

    static async clearOtp(userId) {
        const [result] = await db.execute('DELETE FROM otp WHERE user_id = ?', [userId]);
        return result.affectedRows > 0;
    }
}

module.exports = Otp;
