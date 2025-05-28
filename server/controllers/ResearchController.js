const express = require("express");
const { administrationDetails } = require("../services/ResearchService");
const { fundingBudgetDetails } = require("../services/ResearchService");
const { overviewResearchDetails } = require("../services/ResearchService");
const {participantRelatedInformationDetails} = require("../services/ResearchService");
const { benefitsAndRiskDetails } = require("../services/ResearchService");
const { paymentCompensationDetails} = require("../services/ResearchService");
const {storageAndConfidentialityDetails} =require( "../services/ResearchService");
const {additionalInformationDetails}=require("../services/ResearchService");
const {administrativeRequirementsDetails}=require("../services/ResearchService");
const {declarationDetails}=require("../services/ResearchService");
const { expeditedReviewDetails } = require("../services/ResearchService");
const { requestingWaiverDetails } = require("../services/ResearchService");
const{insertInformedConsent} =require("../services/ResearchService");
const {saveInvestigatorDetails}=require("../services/ResearchService")

const administartion = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await administrationDetails(formData);
    if (result) {
      return res.status(200).json({ idd: result.rows[0].idd });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};



const submitInvestigators = async (req, res) => {
  try {
    const investigators = req.body;
    const email = req.user.email;

    // Check if principal investigator is present
    const principal = investigators.find(inv => inv.investigator_type === "Principal_Investigator" && inv.name);
    if (!principal) {
      return res.status(400).json({ message: "Principal Investigator is required" });
    }

    // Filter out empty (optional) investigator entries
    const validInvestigators = investigators
      .filter(inv => inv.name && inv.investigator_type)
      .map(inv => ({
        ...inv,
        email,
      }));

    const result = await saveInvestigatorDetails(validInvestigators, email);

    return res.status(200).json({
      message: "Investigators saved successfully",
      ids: result.map(r => r.id)
    });
  } catch (err) {
    console.error("Error saving investigators:", err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};




const fundingBudget = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await fundingBudgetDetails(formData);
    if (result) {
      return res.status(200).json({ id: result.rows[0].id });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const overviewResearch = async (req, res) => {
  try {
   
    const formData = req.body;
  formData.email = req.user.email;
    const result = await overviewResearchDetails(formData);
    if (result) {
      return res.status(200).json({ id: result.rows[0].id });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const participantRelatedInformation = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await participantRelatedInformationDetails(formData);
    if (result) {
      return res.status(200).json({ idd: result.rows[0].idd });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const benefitsAndRisk = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await benefitsAndRiskDetails(formData);
    if (result) {
      return res.status(200).json({ idd: result.rows[0].idd });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


const paymentCompensation = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await paymentCompensationDetails(formData);
    if (result) {
      return res.status(200).json({ id: result.rows[0].id });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const storageAndConfidentiality= async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await storageAndConfidentialityDetails(formData);
    if (result) {
      return res.status(200).json({ id: result.rows[0].id });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


const additionalInformation= async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await additionalInformationDetails(formData);
    if (result) {
      return res.status(200).json({ id: result.rows[0].id });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const administrativeRequirements= async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await administrativeRequirementsDetails(formData);
    if (result) {
      return res.status(200).json({ id: result.rows[0].id });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};


const declaration= async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await declarationDetails(formData);
    if (result) {
      return res.status(200).json({ id: result.rows[0].id });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error("Error declaration:", err.message);
    res.status(500).send("Server Error");
  }
};


const expeditedReview = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await expeditedReviewDetails(formData);
    return res.status(200).json({ id: result.rows[0].id });
  } catch (err) {
    console.error("Error inserting expedited review:", err.message);
    return res.status(500).send("Internal Server Error");
  }
};
 
const requestingWaiver = async (req, res) => {
  try {
  const formData =req.body;
   formData.email =req.user.email;
    const result = await requestingWaiverDetails(formData);
    return res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    console.error("Error inserting requesting waiver:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const informedConsent = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const result = await insertInformedConsent(formData);
    return res.status(200).json({ id: result.rows[0].id });
  } catch (error) {
    console.error("Error inserting informed consent:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


  

module.exports = {
  administartion,fundingBudget,overviewResearch,administrativeRequirements, participantRelatedInformation,benefitsAndRisk,  paymentCompensation, storageAndConfidentiality,additionalInformation,declaration,expeditedReview,  requestingWaiver,informedConsent,submitInvestigators
};
