const db = require('../config/db');

class User {
    static async createUser(name, email, mobile) {
        const [result] = await db.execute('INSERT INTO user (name, email, mobile) VALUES (?, ?, ?)', [
            name,
            email,
            mobile
        ]);

        return result.insertId;
    }

    static async getUserById(userId) {
        const [rows] = await db.execute('SELECT * FROM user WHERE id = ?', [userId]);
        return rows[0];
    }

    static async getAlluser() {
        const [rows] = await db.execute('SELECT * FROM user');
    return rows;
  }

    static async updateUser(userId, newData) {
        const { name, email, mobile } = newData;
        const [result] = await db.execute('UPDATE user SET name=?, email=?, mobile=? WHERE id=?', [
            name,
            email,
            mobile,
            userId,
        ]);

        return result.affectedRows > 0;
    }

    static async deleteUser(userId) {
        const [result] = await db.execute('DELETE FROM user WHERE id=?', [userId]);
        return result.affectedRows > 0;
    }
}

module.exports = User;