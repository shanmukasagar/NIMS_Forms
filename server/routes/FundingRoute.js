const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken");
const { selfFundedStudyHandler, industrySponsoredHandler, fundedStudyHandler } = require("../controllers/FundingController");

router.post("/self_funded_study", verifyToken, selfFundedStudyHandler);
router.post("/industry_sponsored_study", verifyToken, industrySponsoredHandler);
router.post("/funded_study", verifyToken, fundedStudyHandler);


module.exports = router;

