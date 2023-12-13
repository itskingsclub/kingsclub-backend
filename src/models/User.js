const db = require('../config/db');

class User {
    static async createUser(name, email, mobile) {
        const [result] = await db.execute('INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)', [
            name,
            email,
            mobile
        ]);

        return result.insertId;
    }

    static async getUserById(userId) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        return rows[0];
    }

  static async getAllUsers() {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
  }

    static async updateUser(userId, newData) {
        const { name, email, mobile } = newData;
        const [result] = await db.execute('UPDATE users SET name=?, email=?, mobile=? WHERE id=?', [
            name,
            email,
            mobile,
            userId,
        ]);

        return result.affectedRows > 0;
    }

    static async deleteUser(userId) {
        const [result] = await db.execute('DELETE FROM users WHERE id=?', [userId]);
        return result.affectedRows > 0;
    }
}

module.exports = User;