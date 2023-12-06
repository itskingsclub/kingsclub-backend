const db = require('../config/db');

class Otp {
    static async createOtp(mobile_number, code, expiry) {
        const [result] = await db.execute('INSERT INTO otp (mobile_number, code, expiry) VALUES (?, ?, ?)', [mobile_number, code, expiry]);
        return result.insertId;
    }

    static async getOtp(mobile_number) {
        const [rows] = await db.execute('SELECT * FROM otp WHERE mobile_number = ? AND expiry > NOW() ORDER BY id DESC LIMIT 1', [
            mobile_number,
        ]);

        return rows[0];
    }

    static async clearOtp(mobile_number) {
        const [result] = await db.execute('DELETE FROM otp WHERE mobile_number = ?', [mobile_number]);
        return result.affectedRows > 0;
    }
}

module.exports = Otp;
