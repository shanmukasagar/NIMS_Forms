const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken");
const {getProjectsController, getOverallProjectController, checkInvestigatorApproval, investigatorEmailsController, 
    approveHOD, projectChangesController, investigatorStatusController,downloadPBACApproval,
   uploadMeetingDataController, downloadApprovalPdfController,downloadApproval} = require("../controllers/InvestigatorController")
const multer = require("multer");

router.get("/projects", verifyToken, getProjectsController);
router.get("/projectdata", verifyToken, getOverallProjectController);
router.get("/approve", verifyToken, checkInvestigatorApproval);
router.get('/hod-approve', approveHOD);
router.post('/changes', projectChangesController);
router.get('/approvedstatus', verifyToken, investigatorStatusController );
router.get("/mails", verifyToken, investigatorEmailsController);

router.get("/approval-letter/:projectRef", downloadApproval);
router.get("/pbac-approval-letter/:projectRef", downloadPBACApproval);

const upload = multer({
   storage: multer.memoryStorage()
});

router.post("/niec/complete-meeting", verifyToken,
upload.fields([
    { name: "file1" },
    { name: "file2" }
  ]),
  uploadMeetingDataController
);
router.get( "/niec/download/:projectRef",  verifyToken,downloadApprovalPdfController );

module.exports = router;