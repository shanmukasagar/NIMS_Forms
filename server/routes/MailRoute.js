const express = require('express');
const router = express.Router();
const { sendMail } = require('../controllers/MailController');
const multer = require('multer');
const path = require('path');

// Temp storage for attachments
const upload = multer({ dest: 'media/projects/mails' });

router.post('/send', upload.array('attachments'), sendMail);

module.exports = router;
