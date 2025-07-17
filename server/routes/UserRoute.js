const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken")

const {userRegister, userLogin, verifyUser, userLogout, deleteUser} = require("../controllers/UserController")

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/verify", verifyToken, verifyUser);
router.get("/logout", userLogout);
router.get("/delete", deleteUser);


module.exports = router;