const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken")

const {addClinical} = require("../controllers/AddClinicalController")

router.post("/add", verifyToken, addClinical);

module.exports = router;