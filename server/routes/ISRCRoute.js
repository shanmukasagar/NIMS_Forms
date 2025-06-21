const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken")

const {ISRCReviewerController, assignReviewerController, getISRCProjectsController, ISRCChairController} = require("../controllers/ISRCController")

router.post("/committee/comment", verifyToken, ISRCReviewerController);
router.post("/committee/assignproject", verifyToken, assignReviewerController);
router.get("/chair/projects", verifyToken, getISRCProjectsController);
router.post("/chair/comment", verifyToken, ISRCChairController);


module.exports = router;