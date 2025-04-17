const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken")

const {userRegister, userLogin, verifyUser} = require("../controllers/UserController")

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/verify", verifyToken, verifyUser)


module.exports = router;