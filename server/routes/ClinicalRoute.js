const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken")

const {addClinical, clinicalList, getProjects} = require("../controllers/AddClinicalController")

router.post("/add", verifyToken, addClinical);
router.get("/list", verifyToken, clinicalList);
router.get("/projects", verifyToken, getProjects);

module.exports = router;