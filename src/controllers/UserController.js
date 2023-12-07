const db = require("../config/db");
const OtpService = require("../services/OtpService");

class UserController {
    static async createUser(req, res) {
        const { user_name, email, password, mobile_number } = req.body;

        try {
            const [rows] = await db.execute(
                "SELECT * FROM users WHERE mobile_number = ?",
                [mobile_number]
            );

            // User exists
            if (rows.length > 0) {
                const sendOtp = await OtpService.sendOtp(req, res);

                if (sendOtp?.success) {
                res.json({
                    success: true,
                    message: "User already exists, OTP sent successfully",
                    data: sendOtp?.data,
                });
                }
            } else {
                const [result] = await db.execute(
                    "INSERT INTO users (user_name, email, password, mobile_number) VALUES (?, ?, ?, ?)",
                    [user_name, email, password, mobile_number]
                );

                    const sendOtp = await OtpService.sendOtp(mobile_number);

                if (sendOtp?.success) {
                    res.json({
                        success: true,
                        message: "User created, OTP sent successfully",
                        data: sendOtp?.data,
                    });
                } else {
                    res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                    });
                }
            }
        } catch (error) {
            res.status(500).send("Internal Server Error");
        }
    }

    static async getUserById(req, res) {
        const { userId } = req.params;

        try {
            const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [
                userId,
            ]);

            if (rows.length > 0) {
                res.json(rows[0]);
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    static async getUser(mobile_number) {
        try {
            const [rows] = await db.execute("SELECT * FROM users WHERE mobile_number = ?", [
                mobile_number,
            ]);

            if (rows.length > 0) {
                res.json(rows[0]);
                return {
                    success: false,
                    message: "User found",
                    data: rows[0]
                };
            } else {
                res.status(404).send("User not found");
                return {
                    success: true,
                    message: "User not found",
                    data: rows[0]
                };
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

  static async getAllUsers(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  }

    static async updateUser(req, res) {
        const { userId } = req.params;
        const { user_name, email, password, mobile_number } = req.body;

        try {
            const [result] = await db.execute(
                "UPDATE users SET user_name=?, email=?, password=?, mobile_number=? WHERE id=?",
                [user_name, email, password, mobile_number, userId]
            );

            if (result.affectedRows > 0) {
                res.send("User updated successfully");
            } else {
                res.status(404).send("User not found");
            }
    } catch (error) {
      console.error(error);
            res.status(500).send("Internal Server Error");
    }
  }

    static async deleteUser(req, res) {
        const { userId } = req.params;

        try {
            const [result] = await db.execute("DELETE FROM users WHERE id=?", [
                userId,
            ]);

            if (result.affectedRows > 0) {
                res.send("User deleted successfully");
            } else {
                res.status(404).send("User not found");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
}

module.exports = UserController;
