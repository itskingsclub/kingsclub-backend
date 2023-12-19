const Otp = require("../models/Otp");
const db = require("../config/db");
const { generateOtp, sendOtp } = require("../utils/otpUtils");
const { generateAuthToken } = require('../utils/authUtils');

class OtpController {
    static async createOtp(req, res) {
        const { mobile } = req.body;
        try {
            const [user] = await db.execute(
                "SELECT * FROM users WHERE mobile = ?",
                [mobile]
            );

            // User Found
            if (user.length > 0) {
                const [otp] = await db.execute(
                    "SELECT * FROM otp WHERE mobile = ?",
                    [mobile]
                );
                const { id: user_id } = user[0];

                // OTP Exists
                if (otp.length > 0) {
                    res.json({
                        success: true,
                        message: "OTP sent successfully",
                        data: {
                            pin: otp[0]?.pin,
                        },
                    });
                } else {
                    const pin = generateOtp(); // Implement your OTP generation logic
                    const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now
                    const created_time = new Date(Date.now());

                    const [result] = await db.execute(
                        "INSERT INTO otp (user_id, mobile, pin, expiry, created_time) VALUES (?, ?, ?, ?, ?)",
                        [user_id, mobile, pin, expiry, created_time]
                    );
                    await sendOtp(mobile, pin); // Implement your OTP sending logic
                    res.json({
                        success: true,
                        message: "OTP sent successfully",
                        data: {
                            pin: pin,
                        },
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    // send
    static async sendOTP(req, res) {
        const { mobile } = req.body;

        try {
            const [user] = await db.execute(
                "SELECT * FROM users WHERE mobile = ?",
                [mobile]
            );

            // User Found
            if (user.length > 0) {
                const [otp] = await db.execute(
                    "SELECT * FROM otp WHERE mobile = ?",
                    [mobile]
                );
                const { id: user_id } = user[0];

                // OTP Exists
                if (otp.length > 0) {
                    return {
                        success: true,
                        message: "OTP sent successfully",
                        data: {
                            pin: otp[0]?.pin,
                        },
                    };
                } else {
                    const pin = generateOtp(); // Implement your OTP generation logic
                    const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now
                    const created_time = new Date(Date.now());

                    const [result] = await db.execute(
                        "INSERT INTO otp (user_id, mobile, pin, expiry, created_time) VALUES (?, ?, ?, ?, ?)",
                        [user_id, mobile, pin, expiry, created_time]
                    );

                    await sendOtp(mobile, pin); // Implement your OTP sending logic
                    return {
                        success: true,
                        message: "OTP sent successfully",
                        data: {
                            pin: pin,
                        },
                  };
                }
            } else {
                return {
                    success: false,
                    message: "User not found",
                };
            }
        } catch (error) {
            return {
                success: false,
                message: "Internal Server Error",
            };
        }
    }

    static async getOtp(mobile) {
        try {
            const [rows] = await db.execute(
                "SELECT * FROM otp WHERE mobile = ?",
                [mobile]
            );

            if (rows.length > 0) {
                return {
                    success: true,
                    message: "Otp already exist.",
                    data: rows[0],
                };
            } else {
                return {
                    success: false,
                    message: "Otp dosn't exist.",
                };
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }

    // verify
    static async verifyOtp(req, res) {
        const { mobile, pin } = req.body;

        try {
            const [user] = await db.execute(
                "SELECT * FROM users WHERE mobile = ?",
                [mobile]
            );

            // User Found
            if (user.length > 0) {
                const [otp] = await db.execute(
                    "SELECT * FROM otp WHERE mobile = ?",
                    [mobile]
                );

                // OTP Exists
                if (otp.length > 0) {
                    const { expiry } = otp[0];
                    const isExpired = new Date(Date.now()) > expiry;

                    if (pin == otp[0]?.pin && mobile === otp[0]?.mobile) {

                        // OTP Exists
                        if (isExpired) {
                            const [result] = await db.execute(
                                "DELETE FROM otp WHERE mobile=?",
                                [mobile]
                            );
                            if (result.affectedRows > 0) {
                                res.status(401).json({
                                    success: false,
                                    message: "OTP has expired, Try again",
                                });
                            } else {
                                res.status(500).json({
                                    success: false,
                                    message: "Internal Server Error",
                                });
                            }
                        } else {
                            const [result] = await db.execute(
                                "DELETE FROM otp WHERE mobile=?",
                                [mobile]
                            );

                            if (result.affectedRows > 0) {
                                const authToken = generateAuthToken(mobile);
                                const [result] = await db.execute(
                                    "UPDATE users SET token=? WHERE mobile=?",
                                    [authToken, mobile]
                                );

                                if (result.affectedRows > 0) {
                                    res.json({
                                        success: true,
                                        message: "OTP verified successfully",
                                        token: authToken,
                                        data: user[0],
                                    });
                                }

                            } else {
                                res.status(500).json({
                                    success: false,
                                    message: "Internal Server Error",
                                });
                            }
                        }
                    }

                    else {
                        res.status(401).json({
                            success: false,
                            message: "Invalid OTP",
                        });
                    }

                } else {
                    res.status(401).json({
                        success: false,
                        message: "Invalid OTP",
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    static async resendOtp(userId) {
        const existingOtp = await Otp.getOtp(userId);

        if (existingOtp) {
            await Otp.clearOtp(userId);
        }

        const pin = generateOtp(); // Implement your OTP generation logic
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now

        await Otp.createOtp(userId, pin, expiry);
        await sendOtp(userId, pin); // Implement your OTP sending logic

        return { message: "OTP resent successfully" };
    }

    static async deleteOtp(userId) {
        try {
            const cleared = await Otp.clearOtp(userId);
            return { cleared, message: "OTP deleted successfully" };
        } catch (error) {
            console.error(error);
            throw new Error("Error deleting OTP");
        }
    }
}

module.exports = OtpController;
