const {userRegistration, userAuthentication} = require("../services/UserService");
const {createToken} = require("../config/VerifyToken")
const cookieParser = require('cookie-parser');

const userRegister = async(req, res) => { //User Registration
    try{
        const userData = req.body;
        const result = await userRegistration(userData);
        if(result.success) {
            const token = await createToken(userData.email, userData?.selectedRole);
            // Set the token in a cookie
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3600000 });  // 1 hour expiration time
            res.status(200).json(result.message);
            return;
        }
        return res.status(400).json(result.message);
    }
    catch(error) {
        console.log("User Registration failed:", error.message);
        return res.status(500).json("Internal Server Error");
    }
}

const userLogin = async(req, res) => { //User Login
    try{
        const userData = req.body;
        const result = await userAuthentication(userData);
        if(result.success) {
            const token = await createToken(userData.email, userData.selectedRole);
            // Set the token in a cookie
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3600000 });  // 1 hour expiration time
            res.status(200).json(result.message);
            return ;
        }
        return res.status(400).json(result.message);
    }
    catch(error) {
        console.log("User Login failed:", error.message);
        return res.status(500).json("Internal Server Error");
    }
}

const verifyUser = async(req, res) => {//Verify user
    const userEmail = req.user;
    res.status(200).json(userEmail);
}

module.exports = {userRegister, userLogin, verifyUser};