const Otp = require("../models/Otp");
const { generateOtp, sendOtp } = require("../utils/otpUtils");
const { generateAuthToken } = require('../utils/authUtils');

class OtpController {
    // Create a new Otp
    static async createOTP(mobile) {
        try {
            const existingOtp = await Otp.findOne({ where: { mobile } });
            if (existingOtp) {
                await sendOtp(mobile, existingOtp?.dataValues?.pin); // Implement your OTP sending logic
                return {
                    success: true,
                    message: "Otp sent successfully",
                    data: {
                        pin: existingOtp?.dataValues?.pin
                    }
                }
            } else {
                const pin = generateOtp(); // Implement your Otp generation logic
                const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set Otp expiry to 5 minutes from now
                const newOtp = await Otp.create({ mobile: mobile, expiry, pin });
                if (newOtp) {
                    await sendOtp(mobile, newOtp?.dataValues?.pin); // Implement your OTP sending logic
                    return {
                        success: true,
                        message: "Otp created successfully",
                        data: {
                            pin: newOtp?.dataValues?.pin
                        }
                    }
                }
                return {
                    success: false,
                    message: "Error creting Otp"
                }
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    // Verify Otp
    static async verifyOTP(mobile, pin) {
        try {
            const existingOtp = await Otp.findOne({ where: { mobile } });
            if (existingOtp) {
                const { expiry } = existingOtp?.dataValues;
                const isExpired = new Date(Date.now()) > expiry;

                if (pin === existingOtp?.dataValues?.pin && mobile === existingOtp?.dataValues?.mobile) {
                    if (isExpired) {
                        const pin = generateOtp(); // Implement your Otp generation logic
                        const expiry = new Date(Date.now() + 5 * 60 * 1000); // Set Otp expiry to 5 minutes from now
                        const [updatedRowsCount] = await Otp.update({ expiry, pin }, { where: { mobile } });
                        if (updatedRowsCount > 0) {
                            return {
                                success: false,
                                message: "OTP expired, try again",
                            }
                        }
                    }
                    else {
                        console.log("PV 1")
                        const deletedRowCount = await Otp.destroy({ where: { mobile } });
                        if (deletedRowCount > 0) {
                            const authToken = generateAuthToken(mobile);
                            return {
                                success: true,
                                message: "OTP verified successfully",
                                token: authToken,
                            }
                        }

                    }
                }
                return {
                    success: false,
                    message: "Invalid OTP",
                }
            }
            return {
                success: false,
                message: "Invalid OTP",
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

}

module.exports = OtpController;