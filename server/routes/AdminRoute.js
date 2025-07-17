const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken")
const {sendEmail} = require('../controllers/emailController');

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/mail/send', upload.array('attachments'), sendEmail);

module.exports = router;