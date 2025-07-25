const {userRegistration, userAuthentication, deleteUserService } = require("../services/UserService");
const {createToken} = require("../config/VerifyToken")
const cookieParser = require('cookie-parser');

const userRegister = async(req, res) => { //User Registration
    try{
        const userData = req.body;
        const result = await userRegistration(userData);
        if(result.success) {
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
            const token = await createToken(userData.email, userData.selectedRole, result.message?.name);
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

const deleteUser = async (req, res) => { //Delete User
    try {
        const empCode = req.query.emp_code;
        const result = await deleteUserService(empCode);
        if (result.success) {
            return res.status(200).json(result.message);
        } else {
            return res.status(404).json(result.message);
        }
    } catch (error) {
        console.error("Delete User Error:", error.message);
        return res.status(500).json("Internal Server Error");
    }
};

const verifyUser = async(req, res) => {//Verify user
    const userEmail = req.user;
    res.status(200).json(userEmail);
}

const userLogout = async (req, res) => {
    try {
        // Clear the cookie (e.g., "token")
        res.clearCookie('token', {
        httpOnly: true, 
        secure: true,       
        sameSite: 'Strict', 
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({ message: 'Something went wrong during logout' });
    }
};


module.exports = {userRegister, userLogin, verifyUser, userLogout, deleteUser};