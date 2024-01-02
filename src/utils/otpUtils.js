// Function to generate a random 6-digit Otp
const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Function to send Otp via SMS (dummy implementation)
const sendOtp = (mobile, otp) => {
    console.log(`Sending Otp ${otp} to ${mobile} via SMS`);
    // Implement the actual logic to send Otp via SMS using a third-party service or any other method
};

module.exports = { generateOtp, sendOtp };