const { FundedFormDetails, FundedFormData } = require("../services/FundedService");

const FundedFormController = async (req, res) => {
  try {
    const email = req.user.email;
    const tableName = req.query.tableName;
    const formData = req.body;

    const imageUrl = req.files?.[0]?.path || null;

    const result = await FundedFormDetails(formData, email, tableName, imageUrl);

    if (result) return res.status(200).json("Form submitted successfully");
    return res.status(400).json("Error occurred while submitting form");
  } catch (err) {
    console.error("Form submission error:", err.message);
    res.status(500).json("Internal server error");
  }
};

const getFundedFormData = async (req, res) => {
    try {
        const email = req.user.email;
        const tableName = req.query.tableName;

        const result = await FundedFormData(email, tableName);

        if (result) return res.status(200).json(result);
        return res.status(400).json("Error occurred while fetching form data");
    } catch (err) {
        console.error("Fetching form data error:", err.message);
        res.status(500).json("Internal server error");
    }
};

module.exports = { FundedFormController, getFundedFormData };
