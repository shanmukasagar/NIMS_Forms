const { pool } = require("../models/db");

//Insert funding data in table
const FundingTableInsertion = async (tableName, formID, email, data) => {
  try {
    let result;
    if (tableName === "self_funded_studies" || tableName === "clinical_self_funding") {
        const { proposedBudget, costPerPatient, totalProjectCost, nimsInvestigations, isOutsourced,
            outsourcedInvestigations } = data;

        result = await pool.query(`INSERT INTO ${tableName} (proposed_budget, cost_per_patient, 
            total_project_cost, nims_investigations, is_outsourced, outsourced_investigations,
            form_id, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`, 
            [proposedBudget, costPerPatient, totalProjectCost, JSON.stringify(nimsInvestigations), 
                isOutsourced, JSON.stringify(outsourcedInvestigations), formID, email]);
    } 
    else if (tableName === "funding_studies" || tableName === "clinical_funding_studies") {
        const { fundingAgency, grantPerPatient, manpowerGrant, totalGrant, nimsInvestigations, 
            isOutsourced, outsourcedInvestigations } = data;
        result = await pool.query(`INSERT INTO ${tableName} (funding_agency, grant_per_patient, 
            manpower_grant, total_grant, nims_investigations, is_outsourced, outsourced_investigations, 
            form_id, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, 
            [fundingAgency, grantPerPatient, manpowerGrant, totalGrant, JSON.stringify(nimsInvestigations), 
                isOutsourced, JSON.stringify(outsourcedInvestigations), formID, email]);
    } 
    else if (tableName === "industry_sponsored_studies" || tableName === "clinical_industry_funding") {
        const { sponsorName, sponsorPAN, sponsorGST, totalGrant, budgetItems, nimsInvestigations, 
            personnel, isOutsourced, outsourcedInvestigations } = data;
        result = await pool.query(`INSERT INTO ${tableName} 
            (sponsor_name, sponsor_pan, sponsor_gst, total_grant, budget_items, nims_investigations, 
            personnel, is_outsourced, outsourced_investigations, form_id, email) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`, 
            [sponsorName, sponsorPAN, sponsorGST, totalGrant, JSON.stringify(budgetItems), 
                JSON.stringify(nimsInvestigations), JSON.stringify(personnel), isOutsourced, 
                JSON.stringify(outsourcedInvestigations), formID, email]);
    }
    return result;
  } catch (err) {
    console.error(" Error inserting into funding table:", err.message);
    throw err;
  }
};

//Update funding data
const FundingTableUpdate = async (tableName, formID, data) => {
  try {
    let result;
    if (tableName === "self_funded_studies"  || tableName === "clinical_self_funding") {
        const { proposedBudget, costPerPatient, totalProjectCost, nimsInvestigations, isOutsourced, 
            outsourcedInvestigations } = data;
        result = await pool.query(`UPDATE ${tableName} SET proposed_budget = $1, 
            cost_per_patient = $2, total_project_cost = $3, nims_investigations = $4, is_outsourced = $5,
            outsourced_investigations = $6 WHERE form_id = $7 RETURNING id`, 
            [proposedBudget, costPerPatient, totalProjectCost, JSON.stringify(nimsInvestigations), 
                isOutsourced, JSON.stringify(outsourcedInvestigations), formID]);
    } 
    else if (tableName === "funding_studies" || tableName === "clinical_funding_studies") {
        const { fundingAgency, grantPerPatient, manpowerGrant, totalGrant, nimsInvestigations, isOutsourced,
            outsourcedInvestigations } = data;
        result = await pool.query(`UPDATE ${tableName} SET funding_agency = $1, grant_per_patient = $2, 
            manpower_grant = $3, total_grant = $4, nims_investigations = $5, is_outsourced = $6, 
            outsourced_investigations = $7 WHERE form_id = $8 RETURNING id`, 
            [fundingAgency, grantPerPatient, manpowerGrant, totalGrant, JSON.stringify(nimsInvestigations), 
                isOutsourced, JSON.stringify(outsourcedInvestigations), formID]);
    } 
    else if (tableName === "industry_sponsored_studies" || tableName === "clinical_industry_funding") {
        const { sponsorName, sponsorPAN, sponsorGST, totalGrant, budgetItems, nimsInvestigations, personnel,
            isOutsourced, outsourcedInvestigations } = data;
        result = await pool.query(`UPDATE ${tableName} SET sponsor_name = $1, 
            sponsor_pan = $2, sponsor_gst = $3, total_grant = $4, budget_items = $5, nims_investigations = $6,
            personnel = $7, is_outsourced = $8, outsourced_investigations = $9 
            WHERE form_id = $10 RETURNING id`, 
            [sponsorName, sponsorPAN, sponsorGST, totalGrant, JSON.stringify(budgetItems), 
                JSON.stringify(nimsInvestigations), JSON.stringify(personnel), isOutsourced, 
                JSON.stringify(outsourcedInvestigations), formID]);
    }
    return result;
  }
    catch (err) {
        console.error("Error updating funding table:", err.message);
        throw err;
    }
};

// Mapping of DB column names to frontend variable names
const fundingKeyMap = {
  clinical_self_funding: {
    proposed_budget: "proposedBudget",
    cost_per_patient: "costPerPatient",
    total_project_cost: "totalProjectCost",
    nims_investigations: "nimsInvestigations",
    is_outsourced: "isOutsourced",
    outsourced_investigations: "outsourcedInvestigations"
  },
  clinical_funding_studies: {
    funding_agency: "fundingAgency",
    grant_per_patient: "grantPerPatient",
    manpower_grant: "manpowerGrant",
    total_grant: "totalGrant",
    nims_investigations: "nimsInvestigations",
    is_outsourced: "isOutsourced",
    outsourced_investigations: "outsourcedInvestigations"
  },
  clinical_industry_funding: {
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


module.exports = { FundingTableInsertion, FundingTableUpdate, fundingKeyMap, convertToFrontendKeys  };
