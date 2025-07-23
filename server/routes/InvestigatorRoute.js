const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken");
const {getProjectsController, getOverallProjectController, checkInvestigatorApproval, investigatorEmailsController, 
    approveHOD, projectChangesController, investigatorStatusController} = require("../controllers/InvestigatorController")

router.get("/projects", verifyToken, getProjectsController);
router.get("/projectdata", verifyToken, getOverallProjectController);
router.get("/approve", verifyToken, checkInvestigatorApproval);
router.get('/hod-approve', approveHOD);
router.post('/changes', projectChangesController);
router.get('/approvedstatus', verifyToken, investigatorStatusController );
router.get("/mails", verifyToken, investigatorEmailsController);

module.exports = router;