const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken");
const multer = require("multer");
const path = require('path');

const { NIECFormController, getNIECFormData } = require("../controllers/NIECController");

const storage = multer.diskStorage({
    destination: function ( req, file, cb) {
        cb(null, 'media/NIEC/');
    },
    filename:  function(req, file, cb) {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        const newFileName = `${nameWithoutExt}_${timestamp}${ext}`;
        cb(null, newFileName);
    }
});


// Create multer instance
const upload = multer({ storage: storage });


router.post('/forms', verifyToken, upload.any(), NIECFormController);
router.get('/formsData', verifyToken, getNIECFormData);

module.exports = router;

