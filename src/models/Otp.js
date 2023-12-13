const db = require('../config/db');

class Otp {
    static async createOtp(mobile, pin, expiry) {
        const [result] = await db.execute('INSERT INTO otp (mobile, pin, expiry) VALUES (?, ?, ?)', [mobile, pin, expiry]);
        return result.insertId;
    }

    static async getOtp(mobile) {
        const [rows] = await db.execute('SELECT * FROM otp WHERE mobile = ? AND expiry > NOW() ORDER BY id DESC LIMIT 1', [
            mobile,
        ]);

        return rows[0];
    }

    static async clearOtp(mobile) {
        const [result] = await db.execute('DELETE FROM otp WHERE mobile = ?', [mobile]);
        return result.affectedRows > 0;
    }
}

module.exports = Otp;
