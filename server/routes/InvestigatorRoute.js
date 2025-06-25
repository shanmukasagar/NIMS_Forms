const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken");
const {getProjectsController, getOverallProjectController, checkInvestigatorApproval, approveHOD} = require("../controllers/InvestigatorController")

router.get("/projects", verifyToken, getProjectsController);
router.get("/projectdata", verifyToken, getOverallProjectController);
router.get("/approve", verifyToken, checkInvestigatorApproval);
router.get('/hod-approve', approveHOD);

module.exports = router;