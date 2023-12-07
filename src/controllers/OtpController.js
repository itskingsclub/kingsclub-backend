const Otp = require("../models/Otp");
const db = require("../config/db");
const { generateOtp, sendOtp } = require("../utils/otpUtils");

class OtpController {
    static async createOtp(req, res) {
        const { mobile_number } = req.body;
        try {
            const [user] = await db.execute(
                "SELECT * FROM users WHERE mobile_number = ?",
                [mobile_number]
            );

            // User Found
            if (user.length > 0) {
                const [otp] = await db.execute(
                    "SELECT * FROM otp WHERE mobile_number = ?",
                    [mobile_number]
                );

                // OTP Exists
                if (otp.length > 0) {
                    res.json({
                        success: true,
                        message: "OTP sent successfully",
                        data: {
                            code: otp[0]?.code,
                        },
                    });
                } else {
                    const code = generateOtp(); // Implement your OTP generation logic
                    const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now

                    const [result] = await db.execute(
                        "INSERT INTO otp (mobile_number, code, expiry) VALUES (?, ?, ?)",
                        [mobile_number, code, expiry]
                    );
                    await sendOtp(mobile_number, code); // Implement your OTP sending logic
                    res.json({
                        success: true,
                        message: "OTP sent successfully",
                        data: {
                            code: code,
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
        const { mobile_number } = req.body;

        try {
            const [user] = await db.execute(
                "SELECT * FROM users WHERE mobile_number = ?",
                [mobile_number]
            );

            // User Found
            if (user.length > 0) {
                const [otp] = await db.execute(
                    "SELECT * FROM otp WHERE mobile_number = ?",
                    [mobile_number]
                );

                // OTP Exists
                if (otp.length > 0) {
                    return {
                        success: true,
                        message: "OTP sent successfully",
                        data: {
                            code: otp[0]?.code,
                        },
                    };
                } else {
                    const code = generateOtp(); // Implement your OTP generation logic
                    const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now

                    const [result] = await db.execute(
                        "INSERT INTO otp (mobile_number, code, expiry) VALUES (?, ?, ?)",
                        [mobile_number, code, expiry]
                    );

                    await sendOtp(mobile_number, code); // Implement your OTP sending logic
                    return {
                        success: true,
                        message: "OTP sent successfully",
                        data: {
                            code: code,
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

    static async getOtp(mobile_number) {
        try {
            const [rows] = await db.execute(
                "SELECT * FROM otp WHERE mobile_number = ?",
                [mobile_number]
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
        const { mobile_number, code } = req.body;

        try {
            const [user] = await db.execute(
                "SELECT * FROM users WHERE mobile_number = ?",
                [mobile_number]
            );

            // User Found
            if (user.length > 0) {
                const [otp] = await db.execute(
                    "SELECT * FROM otp WHERE mobile_number = ?",
                    [mobile_number]
                );

                // OTP Exists
                if (otp.length > 0) {
                    const { expiry } = otp[0];
                    const isExpired = new Date(Date.now()) > expiry;

                    if (isExpired || code !== otp[0]?.code) {
                        res.status(401).json({
                            success: false,
                            message: "Invalid OTP",
                        });
                    } else {
                        const [result] = await db.execute(
                            "DELETE FROM otp WHERE mobile_number=?",
                            [mobile_number]
                        );

                        if (result.affectedRows > 0) {
                            res.json({
                                success: true,
                                message: "OTP verified successfully",
                                data: user[0],
                            });
                        } else {
                            res.status(500).json({
                                success: false,
                                message: "Internal Server Error",
                            });
                        }
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

        const code = generateOtp(); // Implement your OTP generation logic
        const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry to 5 minutes from now

        await Otp.createOtp(userId, code, expiry);
        await sendOtp(userId, code); // Implement your OTP sending logic

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
