const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken")

const {getProjectsController, getOverallProjectController} = require("../controllers/InvestigatorController")

router.get("/projects", verifyToken, getProjectsController);
router.get("/projectdata", verifyToken, getOverallProjectController);

module.exports = router;