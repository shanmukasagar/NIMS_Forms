const express = require("express");
const { administrationDetails } = require("../services/ResearchService");
const { fundingBudgetDetails } = require("../services/ResearchService");
const { overviewResearchDetails } = require("../services/ResearchService");
const {participantRelatedInformationDetails} = require("../services/ResearchService");
const { benefitsAndRiskDetails } = require("../services/ResearchService");
const { paymentCompensationDetails} = require("../services/ResearchService");
const {storageAndConfidentialityDetails} =require( "../services/ResearchService");
const {additionalInformationDetails}=require("../services/ResearchService");
const { insertAdminFiles, updateAdminFiles}=require("../services/ResearchService");
const {declarationDetails}=require("../services/ResearchService");
const { expeditedReviewDetails } = require("../services/ResearchService");
const { requestingWaiverDetails } = require("../services/ResearchService");
const{insertInformedConsent} =require("../services/ResearchService");
const {saveInvestigatorDetails}=require("../services/ResearchService");
const {updateResearchForms, updateInvestigators} = require("../services/ResearchService");

const administartion = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await administrationDetails(formData, form_type);
      if (result) {
        return res.status(200).json({ idd: result.rows[0].idd });
      }
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
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 

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

    if(isEdit) {
        const result = await updateInvestigators(validInvestigators, email, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await saveInvestigatorDetails(validInvestigators, email, form_type);
      return res.status(200).json({ message: "Investigators saved successfully", ids: result.map(r => r.id) });
    }
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error("Error saving investigators:", err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

const fundingBudget = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId, fundingTableName } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId, fundingTableName);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await fundingBudgetDetails(formData, form_type, fundingTableName);
      if (result) {
        return res.status(200).json({ id: result.rows[0].id });
      }
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
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await overviewResearchDetails(formData, form_type);
      if (result) {
        return res.status(200).json({ id: result.rows[0].id });
      }
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
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await participantRelatedInformationDetails(formData, form_type);
      if (result) {
        return res.status(200).json({ idd: result.rows[0].idd });
      }
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
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await benefitsAndRiskDetails(formData, form_type);
      if (result) {
        return res.status(200).json({ idd: result.rows[0].idd });
      }
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
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await paymentCompensationDetails(formData, form_type);
      if (result) {
        return res.status(200).json({ id: result.rows[0].id });
      }
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
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await storageAndConfidentialityDetails(formData, form_type);
      if (result) {
        return res.status(200).json({ id: result.rows[0].id });
      }
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
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await additionalInformationDetails(formData, form_type);
      if (result) {
        return res.status(200).json({ id: result.rows[0].id });
      }
    }
    
    return res.status(400).json("Error occured");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const administrativeRequirements = async (req, res) => {
  try {
    const email = req.user.email;
    const files = req.files;
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === "true";
    const { formId } = req.query;
    const numericFormId = Number(formId);

    if (!files || Object.keys(files).length === 0) {
      return res.status(200).json({ message: "No new files uploaded." });
    }

    // 1. Map uploaded files by fieldname for easy access
    const uploadedFilesMap = {};
      req.files.forEach(file => {
        uploadedFilesMap[file.fieldname] = file;
    });

    // 2. Parse all labels from form body, even if file is not present
    const parsedFiles = [];

    for (const key in req.body) {
      if (key.startsWith('label_name_')) {
        const id = key.replace('label_name_', '');
        const label_name = req.body[key];
        const file = uploadedFilesMap[`file_${id}`];
        const existingFile = req.body[`existingFile_${id}`];

        parsedFiles.push({
          label_id: parseInt(id),
          label_name,
          file_name: file
            ? file.filename
            : isEdit
            ? existingFile || null
            : null,
          email:email,
        });
      }
    }



    if (isEdit) {
      const updated = await updateAdminFiles(parsedFiles, numericFormId);
      return res.status(200).json({ message: "Updated modified files.", updatedCount: updated });
    } else {
      const inserted = await insertAdminFiles(parsedFiles, email, form_type);
      return res.status(200).json({ message: "All files uploaded.", insertedCount: inserted });
    }
  } catch (err) {
    console.error("Admin requirements error:", err.message);
    res.status(500).send("Server Error");
  }
};


const declaration= async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await declarationDetails(formData, form_type);
      if (result) {
        return res.status(200).json({ id: result.rows[0].id });
      }
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
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await expeditedReviewDetails(formData, form_type);
      return res.status(200).json({ id: result.rows[0].id });
    }
    
  } catch (err) {
    console.error("Error inserting expedited review:", err.message);
    return res.status(500).send("Internal Server Error");
  }
};
 
const requestingWaiver = async (req, res) => {
  try {
    const formData =req.body;
    formData.email =req.user.email;
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await requestingWaiverDetails(formData, form_type);
      return res.status(200).json({ id: result.rows[0].id });
    }
  } catch (error) {
    console.error("Error inserting requesting waiver:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const informedConsent = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;
    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;
    const numericFormId = Number(formId); 
    if(isEdit) {
        const result = await updateResearchForms(tableName, formData, numericFormId);
        if(result) {
          return res.status(200).json("Form successfully updated");
        }
    }
    else{
      const result = await insertInformedConsent(formData, form_type);
      return res.status(200).json({ id: result.rows[0].id });
    }
    
  } catch (error) {
    console.error("Error inserting informed consent:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


  

module.exports = {
  administartion,fundingBudget,overviewResearch,administrativeRequirements, participantRelatedInformation,benefitsAndRisk,  
    paymentCompensation, storageAndConfidentiality,additionalInformation,declaration,expeditedReview,  requestingWaiver, 
    informedConsent,submitInvestigators
};
