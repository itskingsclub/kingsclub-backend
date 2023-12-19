const jwt = require('jsonwebtoken');

// Replace 'your_secret_key' with a strong, secret key
const secretKey = 'raatkaalithi';

function generateAuthToken(mobile) {
    // Create a JWT token with the user ID and a specific expiration time (e.g., 1 hour)
    const token = jwt.sign({ mobile }, secretKey, { expiresIn: '1h' });
    return token;
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token',
        });
    }
}

module.exports = { generateAuthToken, verifyToken };