

const express = require('express');
const router = express.Router();
const {verifyToken} = require("../config/VerifyToken");
const {connectToMongo, getDB} = require("../models/db");

const multer = require("multer");

const { administartion, fundingBudget ,overviewResearch,participantRelatedInformation,benefitsAndRisk,
     paymentCompensation,additionalInformation, storageAndConfidentiality,administrativeRequirements,declaration,
      expeditedReview,requestingWaiver,informedConsent ,submitInvestigators} = require("../controllers/ResearchController");
const { CURSOR_FLAGS } = require('mongodb');


const storage = multer.diskStorage({
    destination: function ( req, file, cb) {
        cb(null, 'media/research/');
    },
    filename:  function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create multer instance
const upload = multer({ storage: storage });

router.post("/administrativee_details", administartion);
router.post("/funding_budgett_and_details", fundingBudget);
router.post("/overvieww_research",overviewResearch);
router.post("/participantt_related_information",participantRelatedInformation);
router.post("/benefits_and_risk",benefitsAndRisk);
router.post("/payment_compensation", paymentCompensation);
router.post("/additional_information",additionalInformation);
router.post("/storage_and_confidentiality",storageAndConfidentiality);
router.post("/administrative_requirements",administrativeRequirements);
router.post("/declaration",declaration);
router.post("/expedited_review", expeditedReview);
router.post("/requesting_waiver", requestingWaiver);
router.post("/informedd_consent", informedConsent);
router.post("/investigatorss", submitInvestigators);
router.post("/upload", upload.single('image'), async(req,res) => {
    try{
        if(!req.file) {
            return res.status(400).json("Image upload failed");
        }
        await connectToMongo(); //connect to database
        const researchCollection = getDB().collection("Overview_Research");
        const result = await researchCollection.insertOne({"imagePath" : req.file.path, email:"abc@gmail.com"});
        if(result.acknowledged) {
            return res.status(200).json("image successfully uploaded");
        }
        return res.status(400).json("Image upload failed");
    }
    catch(err){
        console.log("Image upload failed");
        res.status(500).json("Internal server error");
    }
});

router.post("/upload1", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json("Image upload failed");
      }
  
      await connectToMongo();
      const expeditedCollection = getDB().collection("Expedited_Review");
  
      const result = await expeditedCollection.insertOne({"imagePath" : req.file.path, email:"abc@gmail.com"});
        if(result.acknowledged) {
            return res.status(200).json("image successfully uploaded");
        }
        return res.status(400).json("Image upload failed");
    }
    catch(err){
        console.log("Image upload failed");
        res.status(500).json("Internal server error");
    }
});
  
router.post("/upload2", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json("Image upload failed");
      }
  
      await connectToMongo();
      const waiverCollection = getDB().collection("Waiver_Consent");
  
      const result = await waiverCollection.insertOne({"imagePath" : req.file.path, email:"abc@gmail.com"});
        if(result.acknowledged) {
            return res.status(200).json("image successfully uploaded");
        }
        return res.status(400).json("Image upload failed");
    }
    catch(err){
        console.log("Image upload failed");
        res.status(500).json("Internal server error");
    }
});
  

router.post("/upload-declaration", upload.array("images"), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json("Image upload failed");
      }
  
      await connectToMongo();
      const declarationCollection = getDB().collection("Declaration");
      // Save all image paths
      const imagePaths = req.files.map(file => file.path);
      const result = await declarationCollection.insertOne({ imagePaths , email:"abc@gmail.com"});
  
      if (result.acknowledged) {
        return res.status(200).json("Images successfully uploaded");
      }
      return res.status(400).json("Images upload failed");
    } catch (err) {
      console.log("Images upload failed:", err.message);
      res.status(500).json("Internal server error");
    }
  });
  

module.exports = router;