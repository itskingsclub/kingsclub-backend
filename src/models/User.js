const db = require('../config/db');

class User {
  static async getAllUsers() {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
  }

  // Add other model methods as needed
}

module.exports = User;