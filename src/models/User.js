const db = require('../config/db');

class User {
    static async createUser(username, email, password) {
        const [result] = await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
            username,
            email,
            password,
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
        const { username, email, password } = newData;
        const [result] = await db.execute('UPDATE users SET username=?, email=?, password=? WHERE id=?', [
            username,
            email,
            password,
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