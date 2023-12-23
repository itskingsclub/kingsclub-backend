const db = require("../config/db");
const OtpService = require("../services/OtpService");
const { generateInviteCode } = require('../utils/numberUtils');

class UserController {
    static async createUser(req, res) {
        const time = new Date(Date.now());
        const invite_code = generateInviteCode();
        const { name,
            email = null,
            mobile,
            referral_code = null,
            admin = false,
            block = false,
            total_coin = 500,
            friend_list = null,
            challenges = null,
            depost_history = null,
            withdral_history = null,
            created_time = time,
            updated_time = time } = req.body;

        try {
            const [rows] = await db.execute(
                "SELECT * FROM users WHERE mobile = ?",
                [mobile]
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
                } else {
                    res.status(500).json({
                        success: false,
                        message: "Internal Server Error",
                    });
                }
            } else {

                const [result] = await db.execute(
                    "INSERT INTO users ( name, email, mobile, referral_code, invite_code, admin, block, total_coin, friend_list, challenges, depost_history, withdral_history,created_time, updated_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [name, email, mobile, referral_code, invite_code, admin, block, total_coin, friend_list, challenges, depost_history, withdral_history, created_time, updated_time]
                );

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
        const time = new Date(Date.now());
        const { name,
            email,
            mobile,
            referral_code,
            admin,
            block,
            total_coin,
            friend_list,
            challenges,
            depost_history,
            withdral_history } = req.body;

        // Create an array to hold the SET clauses for the fields that are provided
        const setClauses = [];
        const values = [];

        // Add each field to the setClauses and values arrays if it is provided
        if (name) {
            setClauses.push('name=?');
            values.push(name);
        }
        if (email !== undefined) {
            setClauses.push('email=?');
            values.push(email);
        }
        if (referral_code !== undefined) {
            setClauses.push('referral_code=?');
            values.push(referral_code);
        }
        if (admin !== undefined) {
            setClauses.push('admin=?');
            values.push(admin);
        }
        if (block !== undefined) {
            setClauses.push('block=?');
            values.push(block);
        }
        if (total_coin !== undefined) {
            setClauses.push('total_coin=?');
            values.push(total_coin);
        }
        if (friend_list !== undefined) {
            setClauses.push('friend_list=?');
            values.push(friend_list);
        }
        if (challenges !== undefined) {
            setClauses.push('challenges=?');
            values.push(challenges);
        }
        if (depost_history !== undefined) {
            setClauses.push('depost_history=?');
            values.push(depost_history);
        }
        if (withdral_history !== undefined) {
            setClauses.push('withdral_history=?');
            values.push(withdral_history);
        }

        // Join the setClauses array into a comma-separated string for the SET clause in the SQL query
        const setClause = setClauses.join(', ');

        try {
            values.push(time, mobile); // Add updated_time and mobile to the values array
            const [result] = await db.execute(
                `UPDATE users SET ${setClause}, updated_time=? WHERE mobile=?`,
                values
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
