const express = require("express");
const router = express.Router();
const { pool } = require("../models/db");
const { verifyToken } = require("../config/VerifyToken");

const VALID_TABLES = {
  administrativee_details: "administrativee_details",
  investigatorss: "investigatorss",
  funding_budgett_and_details: "funding_budgett_and_details",
  overvieww_research: "overvieww_research",
  participantt_related_information: "participantt_related_information",
  benefits_and_risk: "benefits_and_risk",
  informedd_consent: "informedd_consent",
  payment_compensation: "payment_compensation",
  storage_and_confidentiality: "storage_and_confidentiality",
  additional_information: "additional_information",
  declaration: "declaration",
  administrative_requirements: "administrative_requirements",
  expedited_review: "expedited_review",
  requesting_waiver: "requesting_waiver"
};

const FUNDING_TABLES = {
  "self-funding": "self_funded_studies",
  "institutional": "funding_studies",
  "agency": "industry_sponsored_studies"
};

// Mapping of DB column names to frontend variable names
const fundingKeyMap = {
  self_funded_studies: {
    proposed_budget: "proposedBudget",
    cost_per_patient: "costPerPatient",
    total_project_cost: "totalProjectCost",
    nims_investigations: "nimsInvestigations",
    is_outsourced: "isOutsourced",
    outsourced_investigations: "outsourcedInvestigations"
  },
  funding_studies: {
    funding_agency: "fundingAgency",
    grant_per_patient: "grantPerPatient",
    manpower_grant: "manpowerGrant",
    total_grant: "totalGrant",
    nims_investigations: "nimsInvestigations",
    is_outsourced: "isOutsourced",
    outsourced_investigations: "outsourcedInvestigations"
  },
  industry_sponsored_studies: {
    sponsor_name: "sponsorName",
    sponsor_pan: "sponsorPAN",
    sponsor_gst: "sponsorGST",
    total_grant: "totalGrant",
    budget_items: "budgetItems",
    nims_investigations: "nimsInvestigations",
    personnel: "personnel",
    is_outsourced: "isOutsourced",
    outsourced_investigations: "outsourcedInvestigations"
  }
};

// Function to convert DB keys to frontend keys
const convertToFrontendKeys = (row, table) => {
  if (!row || !fundingKeyMap[table]) return row;

  const map = fundingKeyMap[table];
  const converted = {};

  for (const [dbKey, frontendKey] of Object.entries(map)) {
    const value = row[dbKey];
    try {
      converted[frontendKey] =
        typeof value === "string" && (value.startsWith("{") || value.startsWith("["))
          ? JSON.parse(value)
          : value;
    } catch {
      converted[frontendKey] = value;
    }
  }

  return converted;
};

// GET /admin route
router.get("/admin", verifyToken, async (req, res) => {
  const { form_type } = req.query;
  const email = req.user?.email;

  if (!form_type || !email) {
    return res.status(400).json({ message: "Missing form_type or email" });
  }

  const tableName = VALID_TABLES[form_type.trim()];
  if (!tableName) {
    return res.status(400).json({ message: "Invalid form_type" });
  }

  try {
    const formResult = await pool.query(
      `SELECT * FROM forms WHERE email = $1`,
      [email]
    );

    if (formResult.rows.length === 0) {
      return res.status(200).json([]);
    }

    const formId = formResult.rows[0].id;

    const result = await pool.query(
      `SELECT * FROM ${tableName} WHERE form_id = $1`,
      [formId]
    );

    const data = result.rows;

    // Handle funding table conversion
    if (tableName === "funding_budgett_and_details" && data.length > 0) {
      const fundingSource = data[0].funding_source;
      const fundingTable = FUNDING_TABLES[fundingSource];

      if (fundingTable) {
        const fundingResult = await pool.query(
          `SELECT * FROM ${fundingTable} WHERE form_id = $1`,
          [formId]
        );

        const rawRow = fundingResult.rows[0] || null;
        const frontendFormatted = convertToFrontendKeys(rawRow, fundingTable);
        data[0].funding_FormData = frontendFormatted;
      }
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching admin data:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
