const db = require("../config/db");
const OtpService = require("../services/OtpService");

class UserController {
    static async createUser(req, res) {
        const { name, email = null, mobile } = req.body;

        try {

            console.log("PV 1", req.body);

            const [rows] = await db.execute(
                "SELECT * FROM users WHERE mobile = ?",
                [mobile]
            );

            // User exists
            if (rows.length > 0) {
                const sendOtp = await OtpService.sendOtp(req, res);

                console.log("PV 2", sendOtp);

                if (sendOtp?.success) {
                res.json({
                    success: true,
                    message: "User already exists, OTP sent successfully",
                    data: sendOtp?.data,
                });
                } else {
                    res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                    });
                }
            } else {

                console.log("PV 3", req.body);

                const [result] = await db.execute(
                    "INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)",
                    [name, email, mobile]
                );

                console.log("PV 4", result);

                const sendOtp = await OtpService.sendOtp(req, res);

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
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    static async getUserById(req, res) {
        const { userId } = req.params;

        try {
            const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [
                userId,
            ]);

            if (rows.length > 0) {
                res.json({
                    success: true,
                    message: "User found",
                    data: rows[0],
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    static async getUser(mobile) {
        try {
            const [rows] = await db.execute(
                "SELECT * FROM users WHERE mobile = ?",
                [mobile]
            );

            if (rows.length > 0) {
                res.json(rows[0]);
                return {
                    success: false,
                    message: "User found",
                    data: rows[0],
                };
            } else {
                res.status(404).send("User not found");
                return {
                    success: true,
                    message: "User not found",
                    data: rows[0],
                };
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

  static async getAllUsers(req, res) {
    try {
        const [rows] = await db.execute("SELECT * FROM users");
        res.json({
            success: true,
            message: "User fetched successfully",
            data: rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
  }

    static async updateUser(req, res) {
        const { name, email, mobile } = req.body;

        try {
            const [result] = await db.execute(
                "UPDATE users SET name=?, email=?, mobile=? WHERE mobile=?",
                [name, email, mobile, mobile]
            );

            if (result.affectedRows > 0) {
                res.json({
                    success: true,
                    message: "User updated successfully",
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
    } catch (error) {
      console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
    }
  }

    static async deleteUser(req, res) {
        const { userId } = req.params;

        try {
            const [result] = await db.execute("DELETE FROM users WHERE id=?", [
                userId,
            ]);

            if (result.affectedRows > 0) {
                res.json({
                    success: true,
                    message: "User deleted successfully",
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
}

module.exports = UserController;
