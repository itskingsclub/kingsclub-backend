const express = require('express');
const OtpController = require('../controllers/OtpController');

const router = express.Router();

// Route for sending OTP
router.post('/send-otp', OtpController.createOtp);
router.post('/log-in', OtpController.createOtp);
router.post('/verify-otp', OtpController.verifyOtp);

// Route for resending OTP
router.post('/resend-otp/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await OtpController.resendOtp(userId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for deleting OTP
router.delete('/delete-otp/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await OtpController.deleteOtp(userId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
