const db = require('../config/db');

class UserController {
    static async createUser(req, res) {
        const { username, email, password } = req.body;

        try {
            const [result] = await db.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [
                username,
                email,
                password,
            ]);

            res.json({ userId: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async getUserById(req, res) {
        const { userId } = req.params;

        try {
            const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

  static async getAllUsers(req, res) {
    try {
            const [rows] = await db.execute('SELECT * FROM users');
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    static async updateUser(req, res) {
        const { userId } = req.params;
        const { username, email, password } = req.body;

        try {
            const [result] = await db.execute('UPDATE users SET username=?, email=?, password=? WHERE id=?', [
                username,
                email,
                password,
                userId,
            ]);

            if (result.affectedRows > 0) {
                res.send('User updated successfully');
            } else {
                res.status(404).send('User not found');
            }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

    static async deleteUser(req, res) {
        const { userId } = req.params;

        try {
            const [result] = await db.execute('DELETE FROM users WHERE id=?', [userId]);

            if (result.affectedRows > 0) {
                res.send('User deleted successfully');
            } else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = UserController;