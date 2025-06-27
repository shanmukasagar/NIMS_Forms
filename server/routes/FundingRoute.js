const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { verifyToken } = require("../config/VerifyToken");
const { FundedFormController, getFundedFormData } = require("../controllers/FundedController");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "media/");
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext);
        cb(null, `${baseName}_${timestamp}${ext}`);
    },
});

const upload = multer({ storage });

// Routes
router.post("/form", verifyToken, upload.any(), FundedFormController);
router.get("/formData", verifyToken, getFundedFormData);

module.exports = router;
