const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken");

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {addClinical, clinicalList, getProjects} = require("../controllers/AddClinicalController");

// ✅ Multer storage configuration
const mediaPath = path.join(__dirname, "../media/clinical/checklist");
if (!fs.existsSync(mediaPath)) fs.mkdirSync(mediaPath);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mediaPath),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post("/add", verifyToken, upload.any(), addClinical);

router.get("/list", verifyToken, clinicalList);
router.get("/projects", verifyToken, getProjects);

module.exports = router;