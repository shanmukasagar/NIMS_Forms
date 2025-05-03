const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken");
const {connectToMongo, getDB} = require("../models/db");
const multer = require("multer");

const { NIECFormController } = require("../controllers/NIECController");

const storage = multer.diskStorage({
    destination: function ( req, file, cb) {
        cb(null, 'media/NIEC/');
    },
    filename:  function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create multer instance
const upload = multer({ storage: storage });

router.post('/forms', verifyToken, upload.any(), NIECFormController);

module.exports = router;

