require('dotenv').config();

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const createToken = async (email) => {
    return jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });
}

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.cookies ? req.cookies.token : undefined;  // Get the token from cookies

    if (!token) {
        return res.status(403).json({ error: 'Token Error' });
    }

    // Verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.log("Invalid Token");
            return res.status(403).json({ error: 'Token Error' });
        }
        req.user = decoded;  // Attach decoded data to the request object
        next();  // Move to the next middleware or route handler
    });
};


module.exports = {createToken, verifyToken};