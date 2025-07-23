require('dotenv').config();

const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const createToken = async (email, selectedRole = "", userName) => {
    return jwt.sign({ email: email , name : userName, selectedRole : selectedRole}, secretKey, { expiresIn: '1h' });
}

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const token = req.cookies ? req.cookies.token : undefined;  // Get the token from cookies
    try{
        if (!token) {
            return res.status(403).json({ error: 'Token Error' });
        }
        jwt.verify(token, secretKey, (err, decoded) => {  // Verify the token
            if (err) {
                console.log("Invalid Token");
                return res.status(403).json({ error: 'Token Error' });
            }
            req.user = decoded;  // Attach decoded data to the request object
            next();  // Move to the next middleware or route handler
        });
    }
    catch(error) {
        console.log("Error occured", error.message);
        return res.status(500).json("Internal server error");
    }
};


module.exports = {createToken, verifyToken};