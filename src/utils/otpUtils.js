// Function to generate a random 6-digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via SMS (dummy implementation)
const sendOtp = (mobileNumber, otp) => {
    console.log(`Sending OTP ${otp} to ${mobileNumber} via SMS`);
    // Implement the actual logic to send OTP via SMS using a third-party service or any other method
};

module.exports = { generateOtp, sendOtp };