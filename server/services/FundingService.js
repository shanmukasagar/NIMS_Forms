const {pool} =require("../models/db");
const {checkFormDetails} = require("./ResearchService");

const saveSelfFundedStudy = async (data, form_type) => {
  try {
    const { proposed_budget, cost_per_patient, total_project_cost, is_outsourced, nims_investigations,
      outsourced_investigations, email } = data;

    const formId = await checkFormDetails(email, form_type, "administration");

    const query = `
      INSERT INTO self_funded_studies (
        proposed_budget, cost_per_patient, total_project_cost,
        is_outsourced, nims_investigations, outsourced_investigations,
        email, form_id )
      VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8) RETURNING id `;

    const values = [
      proposed_budget, cost_per_patient, total_project_cost, is_outsourced,
      JSON.stringify(nims_investigations), JSON.stringify(outsourced_investigations), email,
      formId, ];

    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    console.error("❌ Failed to insert self-funded study:", error.message);
    throw error;
  }
};

const saveIndustrySponsoredStudy = async (data, isEdit, tableName) => {

  const {
    sponsor_name,
    sponsor_pan,
    sponsor_gst,
    total_grant,
    budget_items,
    nims_investigations,
    personnel,
    is_outsourced,
    outsourced_investigations,
    email
  } = data;

  const formId = await checkFormDetails(email, form_type, "administration");

  if (isEdit) {
    const updateQuery = `
      UPDATE ${tableName} SET
        sponsor_name = $1,
        sponsor_pan = $2,
        sponsor_gst = $3,
        total_grant = $4,
        budget_items = $5::jsonb,
        nims_investigations = $6::jsonb,
        personnel = $7::jsonb,
        is_outsourced = $8,
        outsourced_investigations = $9::jsonb
      WHERE form_id = $10
      RETURNING id
    `;

    const values = [
      sponsor_name,
      sponsor_pan,
      sponsor_gst,
      total_grant,
      JSON.stringify(budget_items),
      JSON.stringify(nims_investigations),
      JSON.stringify(personnel),
      is_outsourced,
      JSON.stringify(outsourced_investigations),
      formId
    ];

    const result = await pool.query(updateQuery, values);
    return result;
  }

  const insertQuery = `
    INSERT INTO industry_sponsored_studies (
      sponsor_name, sponsor_pan, sponsor_gst, total_grant,
      budget_items, nims_investigations, personnel, is_outsourced,
      outsourced_investigations, email, form_id
    ) VALUES (
      $1, $2, $3, $4,
      $5::jsonb, $6::jsonb, $7::jsonb, $8,
      $9::jsonb, $10, $11
    ) RETURNING id
  `;

  const values = [
    sponsor_name,
    sponsor_pan,
    sponsor_gst,
    total_grant,
    JSON.stringify(budget_items),
    JSON.stringify(nims_investigations),
    JSON.stringify(personnel),
    is_outsourced,
    JSON.stringify(outsourced_investigations),
    email,
    formId
  ];

  const result = await pool.query(insertQuery, values);
  return result;
};

const saveFundedStudy = async (data, formId, isEdit, tableName) => {
  const {
    funding_agency,
    grant_per_patient,
    manpower_grant,
    total_grant,
    nims_investigations,
    is_outsourced,
    outsourced_investigations,
    email
  } = data;

  

  if (isEdit) {
    const updateQuery = `
      UPDATE ${tableName} SET
        funding_agency = $1,
        grant_per_patient = $2,
        manpower_grant = $3,
        total_grant = $4,
        nims_investigations = $5::jsonb,
        is_outsourced = $6,
        outsourced_investigations = $7::jsonb
      WHERE form_id = $8
      RETURNING id
    `;

    const updateValues = [
      funding_agency,
      grant_per_patient,
      manpower_grant,
      total_grant,
      JSON.stringify(nims_investigations),
      is_outsourced,
      JSON.stringify(outsourced_investigations),
      formId
    ];

    return await pool.query(updateQuery, updateValues);
  }

  const insertQuery = `
    INSERT INTO funded_studies (
      funding_agency, grant_per_patient, manpower_grant, total_grant,
      nims_investigations, is_outsourced, outsourced_investigations,
      email, form_id
    ) VALUES (
      $1, $2, $3, $4,
      $5::jsonb, $6, $7::jsonb,
      $8, $9
    )
    RETURNING id
  `;

  const insertValues = [
    funding_agency,
    grant_per_patient,
    manpower_grant,
    total_grant,
    JSON.stringify(nims_investigations),
    is_outsourced,
    JSON.stringify(outsourced_investigations),
    email,
    formId
  ];

  return await pool.query(insertQuery, insertValues);
};

module.exports = { saveSelfFundedStudy, saveIndustrySponsoredStudy, saveFundedStudy };