const { saveSelfFundedStudy, saveIndustrySponsoredStudy, saveFundedStudy  } = require("../services/FundingService");

const selfFundedStudyHandler = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;

    const form_type = req.query.selectedForm;
    

    const result = await saveSelfFundedStudy(formData, formId);

    if (result) {
      return res.status(200).json({ idd: result.rows[0].id });
    }

    res.status(400).json("Insert failed.");
  } catch (err) {
    console.error("❌ Self-funded study error:", err.message);
    res.status(500).send("Server Error");
  }
};

const industrySponsoredHandler = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;

    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === 'true';
    const { tableName, formId } = req.query;

    const numericFormId = Number(formId);
    

    const result = await saveIndustrySponsoredStudy(formData, isEdit, tableName);
    if (result) {
      return res.status(200).json({ idd: result.rows[0].id });
    }

    return res.status(400).json("Insert failed");
  } catch (err) {
    console.error("❌ Industry Sponsored error:", err.message);
    res.status(500).send("Server Error");
  }
};

const fundedStudyHandler = async (req, res) => {
  try {
    const formData = req.body;
    formData.email = req.user.email;

    const form_type = req.query.selectedForm;
    const isEdit = req.query.isEdit === "true";
    const { tableName, formId } = req.query;
 

    const result = await saveFundedStudy(formData, finalFormId, isEdit, tableName);

    if (result) {
      return res.status(200).json({ idd: result.rows[0].id });
    }

    return res.status(400).json("Insert failed");
  } catch (err) {
    console.error("❌ Funded Study Submission Error:", err.message);
    res.status(500).send("Server Error");
  }
};


module.exports = { selfFundedStudyHandler, industrySponsoredHandler, fundedStudyHandler
};


