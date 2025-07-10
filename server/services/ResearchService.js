const {pool} =require("../models/db");
const {connectToMongo, getDB} = require("../models/db");
const { v4: uuidv4 } = require('uuid');
const { tableFieldMap } = require("../config/Data");
const {sendEmail} = require("../config/SendEmail");
const generateResearchPDF = require("../config/ResearchPdGenerator");
const {FundingTableInsertion, FundingTableUpdate} = require("../config/FundingTableConfig");

const checkFormDetails = async (email, form_type, form_name = "") => {
  // Check if email exists in the "forms" table
  const formResult = await pool.query(`SELECT * FROM forms WHERE email = $1`, [email]);

  if (formResult.rows.length === 0) {
    const project_ref = uuidv4(); // Generate project reference ID

    // Insert into "forms" table
    const insertResult = await pool.query(
      `INSERT INTO forms (form_type, created_at, email, status, project_ref) 
       VALUES ($1, NOW(), $2, $3, $4) RETURNING id`,
      ['research', email, 'pending', project_ref]
    );
    const formId = insertResult.rows[0].id;
    // Insert into MongoDB
    await connectToMongo();
    const projectsCollection = getDB().collection('Projects');
    const newProjectData = {
      project_id: '', project_ref: project_ref, status: 'pending', emp_code: email, sub_date: '',
      created_at: new Date(), comments: '', project_title: '', reviewer_id: '', type : "research", form_type : form_type,
      reviewer_name : "",
      project_pdf : ""
    };
    await projectsCollection.insertOne(newProjectData);
    return formId;
    
  } else {
    // Return existing form ID if already present (optional handling)
    const formId =  formResult.rows[0].id;
    return formId;
  }
  
};

const createNewProjectForm = async(email, form_type) => {
  const project_ref = uuidv4(); // Generate project reference ID

  // Insert into "forms" table
  const insertResult = await pool.query(
    `INSERT INTO forms (form_type, created_at, email, status, project_ref) 
      VALUES ($1, NOW(), $2, $3, $4) RETURNING id`,
    ['research', email, 'pending', project_ref]
  );
  const formId = insertResult.rows[0].id;
  // Insert into MongoDB
  await connectToMongo();
  const projectsCollection = getDB().collection('Projects');
  const newProjectData = {
    project_id: '', project_ref: project_ref, status: 'pending', emp_code: email, sub_date: '',
    created_at: new Date(), isrc_inv_comments: '', pbac_inv_comments: '', niec_inv_comments: '',
     project_title: '', reviewer_id: '', type : "research", form_type : form_type,
    reviewer_name : "",
    project_pdf : "",
    form_number : formId
  };
  await projectsCollection.insertOne(newProjectData);
  return formId;
}

const administrationDetails = async (formData, form_type) => {
  try {
    const formId = await createNewProjectForm(formData.email, form_type);

    const { name_of_research_principal, department, title, review_requested, protocol_number, version_number, date,
      email, date_1, summary, selectedElements, otherReason } = formData;

    // Get form_ref for MongoDB update
    const formResult = await pool.query(`SELECT * FROM forms WHERE id = $1`, [formId]);

    // Insert into PostgreSQL
    const newUser = await pool.query( `INSERT INTO administrativee_details (
        name_of_research_principal, department, title, review_requested, protocol_number,
        version_number, date, email, date_1, summary, selected_elements, other_reason, form_id
      ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 ) RETURNING idd`,
      [
        name_of_research_principal, department, title, review_requested, protocol_number, version_number,
        date, email,  date_1, summary || null, selectedElements?.length ? selectedElements : null, otherReason || null, formId
      ]
    );

    // Update MongoDB
    await connectToMongo();
    const projectsCollection = getDB().collection('Projects');

    const updateProjects = await projectsCollection.updateOne(
      { project_ref: formResult.rows[0].project_ref },
      {
        $set: {
          project_title: title,
          sub_date: new Date(date),
          investigator_name: name_of_research_principal,
          investigator_dep: department
        }
      }
    );

    return formId;
  } catch (error) {
    console.log("Failed to insert administration", error.message);
    throw error;
  }
};


const fundingBudgetDetails = async (formData, form_type, fundingTableName, numericFormId) => {
  try {
    // const formId = await checkFormDetails(formData.email, form_type);
    const formId = numericFormId;
    const {total_estimated_budget,funding_source, funding_FormData, email} = formData;
    // const adminId =   typeof administrativeDetailId === "object"? administrativeDetailId.adminId: administrativeDetailId;
    const newUser = await pool.query(
      `INSERT INTO funding_budgett_and_details (total_estimated_budget, funding_source, email, form_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id`, // Returning only the id
      [total_estimated_budget, funding_source, email, formId]
    );

    const result = await FundingTableInsertion(fundingTableName, formId, email, funding_FormData);

    return newUser; // Add this
  } catch (error) {
    console.log("Failed to insert funding budget details:", error.message);
    throw error;
  }
};

const overviewResearchDetails = async (formData, form_type, numericFormId) => {
  // const formId = await checkFormDetails(formData.email, form_type);
  const formId = numericFormId;
  try {
    const {
      summary,  type_of_study, external_laboratory, specify, otherStudyType, sample_size, justification,  email // camel‑case from front‑end
    } = formData;
    // const adminId = typeof administrativeDetailId === "object"? administrativeDetailId.adminId : administrativeDetailId;
    const newUser = await pool.query(
      `INSERT INTO overvieww_research(  summary, type_of_study, external_laboratory, specify, otherStudyType, 
      sample_size, justification, email, form_id)VALUES 
      ($1, $2, $3,$4,$5, $6, $7, $8, $9)RETURNING id`,
      [summary, type_of_study, external_laboratory, specify, otherStudyType, sample_size, justification, email, formId]
    );
return newUser;
  } catch (error) {
    console.log("Failed to insert overview:", error.message);
    throw error;
  }
};

const participantRelatedInformationDetails = async (formData, form_type, numericFormId) => {
  // const formId = await checkFormDetails(formData.email, form_type);
  const formId = numericFormId;
  try {
    const {type_of_participants, justification, specifiy,  additional_safeguards, reimbursement_details,
      advertisement_type, advertisement_details,   payment_type, vulnerableGroups,
      email, // camel‑case from front‑end
    } = formData;
    // const adminId =typeof administrativeDetailId === "object"  ? administrativeDetailId.adminId  : administrativeDetailId;
    const newUser = await pool.query(
      `INSERT INTO participantt_related_information ( type_of_participants, justification, specifiy, additional_safeguards, 
        reimbursement_details, advertisement_type, advertisement_details, payment_type, 
        vulnerableGroups, email, form_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING idd`,
      [
        type_of_participants, justification, specifiy, additional_safeguards, reimbursement_details, advertisement_type,
        advertisement_details, payment_type, vulnerableGroups, email, formId ] );

    return newUser;
  } catch (error) {
    console.log("Failed to insert overview:", error.message);
    throw error;
  }
};

const benefitsAndRiskDetails = async (formData, form_type, numericFormId) => {
  const formId = numericFormId;
  try {
    const {improvement_benefits,  reimbursement_details,  management_strategy,  participant_benefits,  
      anticipated_type,  society_benefits,email,
    } = formData;
    const newUser = await pool.query(
      `INSERT INTO benefits_and_risk( improvement_benefits, reimbursement_details,   management_strategy,participant_benefits,anticipated_type,
      society_benefits,email, form_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        improvement_benefits,  reimbursement_details,  management_strategy,participant_benefits,anticipated_type,  
         society_benefits,email, formId
      ]
    );
return newUser;
  } catch (error) {
    console.log("❌ Failed to insert benefits risk:", error.message);
    throw error;
  }
};

const paymentCompensationDetails = async (formData, form_type, numericFormId) => {
  const formId = numericFormId;
  try {
    const {waiver_consent_type, specify,  compensation_research_of_type,   specific,email } = formData;
    // const adminId =
    //   typeof administrativeDetailId === "object"? administrativeDetailId.adminId   : administrativeDetailId;
    const newUser = await pool.query(
      `INSERT INTO payment_compensation(  waiver_consent_type,  specify,compensation_research_of_type,
       specific,email, form_id)VALUES ($1, $2, $3,$4,$5, $6)RETURNING id`,
      [
        waiver_consent_type, specify, compensation_research_of_type, specific, email, formId
      ]
    );
    return newUser;
  } catch (error) {
    console.log("Failed to paymentcompensation:", error.message);
    throw error;
  }
};

const storageAndConfidentialityDetails = async (formData, form_type, numericFormId) => {
  const formId = numericFormId;
  try {
    const {
      document_access_type, access_details,  drugs_access_type, control_details,  sample_access_type, sample_details, 
      email, identifierPrecautions } = formData;
    const newUser = await pool.query(
      `INSERT INTO storage_and_confidentiality(  document_access_type,access_details,drugs_access_type,control_details, sample_access_type, 
      sample_details, identifierPrecautions, email, form_id)VALUES ($1, $2, $3,$4,$5,$6,$7, $8, $9)RETURNING id`,
      [
        document_access_type,access_details, drugs_access_type, control_details, sample_access_type,sample_details, identifierPrecautions, 
        email, formId
      ]
    );
    return newUser;
  } catch (error) {
    console.log("Failed to storageandconfidentiality:", error.message);
    throw error;
  }
};
const additionalInformationDetails = async (formData, form_type, numericFormId) => {
  try {
     const formId = numericFormId;
    const { support_type, additional,email} = formData;

    // const adminId =
    //   typeof administrativeDetailId === "object"
    //     ? administrativeDetailId.adminId
    //     : administrativeDetailId;

    const newUser = await pool.query(
      `INSERT INTO additional_information(support_type, additional,email, form_id)VALUES ($1, $2,$3, $4) RETURNING id`,
      [support_type, additional,email, formId]
    );

    return newUser;
  } catch (error) {
    console.log("Failed to additional information:", error.message);
    throw error;
  }
};

const administrativeRequirementsDetails = async (email, formId, uploadedFiles) => {
  try {
    const values = uploadedFiles.map(file => [
      file.fieldname.replace("file_", ""), // label_id
      file.originalname,                   // label_name
      file.filename                        // file_name (stored name)
    ]);

    const insertPromises = values.map(async ([label_id, label_name, file_name]) => {
      return pool.query(
        `INSERT INTO administrative_requirements (label_id, label_name, file_name, email, form_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [label_id, label_name, file_name, email, formId]
      );
    });

    const results = await Promise.all(insertPromises);
    const pdfUploadResult = await researchPDF(formId);
    
    return results;
  } catch (error) {
    console.error("Failed to insert administrative requirements:", error.message);
    throw error;
  }
};

module.exports = {
  administrativeRequirementsDetails,
};


const declarationDetails = async (formData, form_type, numericFormId) => {
  try {
     const formId = numericFormId;
    const {
      selected_elements, name_of_pi_research, date_pi, sign_1, 
          name_of_co_pi_guide, date_co_pi,  sign_2, 
          name_of_hod, date_co_inv_3,  sign_5, 
          name_of_co_investigator_1,  date_co_inv_1, sign_3, 
          name_of_co_investigator_2, date_co_inv_2, sign_4, email
    } = formData;

    
    const newUser = await pool.query(
      `INSERT INTO declaration( selected_elements, name_of_pi_research, date_pi, sign_1, 
          name_of_co_pi_guide, date_co_pi,  sign_2, 
          name_of_hod, date_co_inv_3,  sign_5, 
          name_of_co_investigator_1,  date_co_inv_1, sign_3, 
          name_of_co_investigator_2, date_co_inv_2, sign_4, 
          email, form_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11, $12, $13, $14, $15, $16, $17, $18)RETURNING id`,
        [
        selected_elements, name_of_pi_research, date_pi, sign_1, 
          name_of_co_pi_guide, date_co_pi,  sign_2, 
          name_of_hod, date_co_inv_3,  sign_5, 
          name_of_co_investigator_1,  date_co_inv_1, sign_3, 
          name_of_co_investigator_2, date_co_inv_2, sign_4, email, formId
        ]
    );
    return newUser;
  } catch (error) {
    console.log("Failed to declaration:", error.message);
    throw error;
  }
};

const expeditedReviewDetails = async (formData, form_type) => {
   const formId = await checkFormDetails(formData.email, form_type);
  const {
    selectedElements,protocol_number,  version_number,principal_investigator_name,    department,   title,   summary,
      name_of_co_investigator_1, date_1,date_2,email
  } = formData;
  // const adminId =
  //   typeof administrativeDetailId === "object" ? administrativeDetailId?.adminId     : administrativeDetailId;
  const result = await pool.query(
    `INSERT INTO expedited_review ( selected_elements,protocol_number, version_number, principal_investigator_name,department, 
      title,summary,name_of_co_investigator_1, date_1,  date_2,email, form_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, $12) RETURNING id`,
    [
      selectedElements, protocol_number,version_number,  principal_investigator_name,   department,    title, summary, name_of_co_investigator_1, 
        date_1,  date_2,email, formId
    ]
  );
  return result;
};

const requestingWaiverDetails = async (formData, form_type) => {
   const formId = await checkFormDetails(formData.email, form_type);
  const {
    selectedElements, principal_investigator_name,department,title,summary,  name_of_co_investigator_1,   date,email
  } = formData;

  // const adminId =typeof administrativeDetailId === "object"  ? administrativeDetailId?.adminId  : administrativeDetailId;
  const result = await pool.query(
    `INSERT INTO requesting_waiver (selected_elements, principal_investigator_name,   department, title,  summary,  name_of_co_investigator_1,  
     date,email, form_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
    [
      selectedElements,principal_investigator_name,  department,   title, summary, name_of_co_investigator_1,date,email, formId
    ]
  );

  return result; // return the inserted data
};
const insertInformedConsent = async (formData, form_type, numericFormId) => {
   const formId = numericFormId;
    try {
      const {
        seeking_waiver_of_consent_type, version_number, date, selectedLanguages, languageDetails, otherLanguageName, 
        PISSelectedItems, PISOtherText, certificates, subject, specify, summary, selected_elements,  email} = formData;
      
      const newUser = await pool.query(
        `INSERT INTO informedd_consent (seeking_waiver_of_consent_type, version_number, date, selectedLanguages, languageDetails, 
          otherLanguageName, PISSelectedItems, PISOtherText, certificates, subject, specify, summary, selected_elements,  email, form_id
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13, $14, $15) RETURNING id`,
        [
          seeking_waiver_of_consent_type, version_number, date, selectedLanguages, languageDetails, otherLanguageName, 
        PISSelectedItems, PISOtherText, certificates, subject, specify, summary, selected_elements,  email, formId
        ]
      );
      return newUser;
    } catch (error) {
      console.error("❌ Failed to insert informed consent:", error.message);
      throw error;
    }
};

const saveInvestigatorDetails = async (investigators, email, form_type, numericFormId) => {
  // const formId = await checkFormDetails(email, form_type); // Use the passed email
  const formId = numericFormId;
  const results = [];

  const principal = investigators.find(inv => inv.investigator_type === "Principal_Investigator" && inv.name);
  
  const allowedEmployees = [];
  for (const inv of investigators) {
    const {name, designation, qualification, department, emp_code, investigator_type, Email = "", contact = "", approved = false, approval_token = ""  } = inv;

    allowedEmployees.push(emp_code);
    const token = uuidv4(); // Or generate JWT if you want secure verification
    if (inv.investigator_type !== "Principal_Investigator" && inv.investigator_type !== "hod"  && inv.Email) {

      // You can store this token in PostgreSQL with expiration and investigator ID

      const approvalLink = `http://localhost:3000/investigator/approval?token=${token}&tableName=${"investigatorss"}`;

      const html = `
        <p>Dear ${inv.name},</p>
        <p>The Principal Investigator <b>${principal.name}</b> has added you to a research project.</p>
        <p>Please click the button below to approve your involvement:</p>
        <a href="${approvalLink}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Approve</a>
        <p>If you did not expect this email, you can ignore it.</p>
      `;

      await sendEmail(principal.Email, inv.Email, "Approval Request for Research Project", html);
    }

    const result = await pool.query(
      `INSERT INTO investigatorss (name, designation, qualification, department,
         investigator_type, gmail, contact, emp_code, approved, approval_token, form_id, email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [
        name, designation, qualification, department, investigator_type, Email, contact, emp_code,
         approved, token, formId, email
      ]
    );
    results.push(result.rows[0]);
  }

  const submittedProject = await pool.query( "SELECT project_ref FROM forms WHERE id = $1",
    [formId] );

  const submittedProject_ref = submittedProject.rows[0]?.project_ref;

  await connectToMongo();
  const projectsCollection = getDB().collection("Projects");

  await projectsCollection.updateOne(
      { project_ref: submittedProject_ref },
      {
          $set: {
              updated_at: new Date(),
              allowedEmployees : allowedEmployees
          }
      }
  );

  return results;
};

// Update research form table data.
const updateResearchForms = async (tableName, fieldsObject, formId, fundingTableName = '') => {
  try {
    let data;
    if(tableName === "funding_budgett_and_details") {
      const filteredFields = Object.fromEntries(
        Object.entries(fieldsObject).filter(([key]) => key !== "funding_FormData")
      ); 
      data = Object.fromEntries(
        Object.entries(fieldsObject).filter(([key]) => key === "funding_FormData")
      ); 
      fieldsObject = filteredFields;
    }
    const updates = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(fieldsObject)) {
      updates.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }

    // Add formId at the end for WHERE clause
    values.push(formId);
    const query = `UPDATE ${tableName} SET ${updates.join(", ")} WHERE form_id = $${i}`;

    const result = await pool.query(query, values);

    if(tableName === "funding_budgett_and_details") {
      const result = await FundingTableUpdate(fundingTableName, formId, data.funding_FormData);
    }

    if(tableName === "administrativee_details") {
      // Update MongoDB
      await connectToMongo();
      const projectsCollection = getDB().collection('Projects');
      const formResult = await projectsCollection.updateOne(
        { form_number: Number(formId) },
        {
          $set: {
            project_title: fieldsObject?.title || "",
            investigator_name: fieldsObject?.name_of_research_principal || "",
            investigator_dep: fieldsObject?.department || ""
          }
        }
      );
    }

    return true;
  } catch (error) {
    console.error("Error updating research form:", error);
    return false;
  }
};


// Update research form table data.
const updateInvestigators = async (investigators, email, numericFormId) => {
  try {
    // Delete existing investigators
    await pool.query(`DELETE FROM investigatorss WHERE form_id = $1`, [numericFormId]);

    const results = [];
    const principal = investigators.find(inv => inv.investigator_type === "Principal_Investigator" && inv.name);

    const allowedEmployees = [];
    for (const inv of investigators) {
      const { name, designation, qualification, department, investigator_type, Email = "",
        emp_code = "", contact = "", approved = false, approval_token = "" } = inv;

      const token = uuidv4();
      allowedEmployees.push(emp_code);
      
      // Send approval email for non-PI investigators
      if (
        investigator_type !== "Principal_Investigator" &&
        investigator_type !== "hod" &&
        Email
      ) {
        const approvalLink = `http://localhost:3000/investigator/approval?token=${token}&tableName=investigatorss`;

        const html = `
          <p>Dear ${name},</p>
          <p>The Principal Investigator <b>${principal.name}</b> has added you to a research project.</p>
          <p>Please click the button below to approve your involvement:</p>
          <a href="${approvalLink}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Approve</a>
          <p>If you did not expect this email, you can ignore it.</p>
        `;

        try {
          await sendEmail(principal.Email, Email, "Approval Request for Research Project", html);
        } catch (emailErr) {
          console.error(`Failed to send email to ${Email}:`, emailErr);
        }
      }

      // Insert into investigatorss table
      try {
        const result = await pool.query(
          `INSERT INTO investigatorss (
            name, designation, qualification, department,
            investigator_type, gmail, contact, emp_code, approved, approval_token, form_id, email
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
          [name, designation, qualification, department, investigator_type, Email, contact, emp_code, 
            approved, token, numericFormId, email]
        );
        results.push(result.rows[0]);
      } catch (insertErr) {
        console.error(`Failed to insert investigator ${name}:`, insertErr);
      }
    }

    const submittedProject = await pool.query( "SELECT project_ref FROM forms WHERE id = $1",
    [numericFormId] );

    const submittedProject_ref = submittedProject.rows[0]?.project_ref;

    await connectToMongo();
    const projectsCollection = getDB().collection("Projects");

    await projectsCollection.updateOne(
        { project_ref: submittedProject_ref },
        {
            $set: {
                updated_at: new Date(),
                allowedEmployees : allowedEmployees
            }
        }
    );

    return true;
  } catch (err) {
    console.error("Error in updateInvestigators:", err);
    return false;
  }
};


const insertAdminFiles = async (files, email, form_type, numericFormId) => {
  try {
    const formId = numericFormId; // Use the passed email
    const insertPromises = files.map(item =>
      pool.query(
        `INSERT INTO administrative_requirements (form_id, label_id, label_name, file_name, email)
         VALUES ($1, $2, $3, $4, $5)`,
        [formId, item.label_id, item.label_name, item.file_name, item.email]
      )
    );
    await Promise.all(insertPromises);
    const pdfUploadResult = await researchPDF(formId);
    return files.length;
  } catch (err) {
    console.error("Insert error:", err.message);
    throw err;
  }
};

const updateAdminFiles = async (files, formId) => {
  try {
    const updatePromises = files.map(item =>
      pool.query(
        `UPDATE administrative_requirements
         SET label_name = $1, file_name = $2
         WHERE form_id = $3 AND label_id = $4`,
        [item.label_name, item.file_name, formId, item.label_id]
      )
    );
    await Promise.all(updatePromises);
    const pdfUploadResult = await researchPDF(formId);
    return files.length;
  } catch (err) {
    console.error("Update error:", err.message);
    throw err;
  }
};

const researchPDF = async (formID) => {
  try {
    const data = {};

    const singleRowTables = {
      administration: "administrativee_details",
      fundingData: "funding_budgett_and_details",
      overviewResearch: "overvieww_research",
      participants : "participantt_related_information",
      benefits: "benefits_and_risk",
      consentData: "informedd_consent",
      paymentState: "payment_compensation",
      storage: "storage_and_confidentiality",
      additional: "additional_information",
      declaration: "declaration"
    };

    for (const [key, table] of Object.entries(singleRowTables)) {
      const result = await pool.query(`SELECT * FROM ${table} WHERE form_id = $1 LIMIT 1`, [formID]);
      data[key] = result.rows[0] || {};
    }

    const researchersResult = await pool.query(`SELECT * FROM investigatorss WHERE form_id = $1`, [formID]);
    data.researchers = researchersResult.rows;

    const checklistResult = await pool.query(`SELECT * FROM administrative_requirements WHERE form_id = $1`, [formID]);
    data.checklist = checklistResult.rows;

    const fundingSourceMap = {
      "self-funding": "self_funded_studies",
      "Pharmaceutical Industry sponsored": "industry_sponsored_studies",
      "institutional": "funding_studies",
      "agency": "funding_studies"
    };

    const funding_source = data.fundingData?.funding_source;
    const tableName = fundingSourceMap[funding_source];

    if (tableName) {
      const result = await pool.query(`SELECT * FROM ${tableName} WHERE form_id = $1 LIMIT 1`, [formID]);
      data.fundingDetails = result.rows[0] || {};
    } else {
      data.fundingDetails = {};
    }

    const fileName = `project_research_${Date.now()}`;
    const pdfPath = await generateResearchPDF(data, fileName);
    // Add pdf path to mongodb.
    if (pdfPath) {
      const submittedFormData = await pool.query(
        `SELECT * FROM forms WHERE id = $1`,
        [formID]
      );

      const project_id = submittedFormData.rows[0]?.project_ref;

      if (project_id) {
        await connectToMongo();

        const projectsCollection = getDB().collection("Projects");
        const projectPDFCollection = getDB().collection("PDF_Versions");

        const projectData = await projectsCollection.findOne({ project_ref: project_id });
        if (!projectData) {
          console.error(`Project not found for project_ref: ${project_id}`);
          return false;
        }

        // Update the current PDF path in main project document
        const updateResult = await projectsCollection.updateOne(
          { project_ref: project_id },
          {
            $set: {
              project_pdf: `media/research/projects/${fileName}`,
            },
          }
        );

        const projectPDFData = await projectPDFCollection.findOne({ project_ref: project_id });

        const pdfPath = `media/research/projects/${fileName}`;

        if (projectPDFData) {
          // Append the new version to existing array
          const result = await projectPDFCollection.updateOne(
            { project_ref: project_id },
            { $push: { project_pdf: pdfPath } }
          );

          return result.modifiedCount > 0;
        } else {
          // Create new version tracking document
          const result = await projectPDFCollection.insertOne({
            project_id: projectData.project_id,
            project_ref: projectData.project_ref,
            project_pdf: [pdfPath],
          });

          return result.acknowledged;
        }
      } else {
        console.error("No project_id found for form:", formID);
        return false;
      }

    }
    return true;
  } catch (error) {
    console.error("Error generating research PDF:", error.message);
    return false;
  }
};


module.exports = {
  administrationDetails, saveInvestigatorDetails, fundingBudgetDetails,  overviewResearchDetails, participantRelatedInformationDetails, 
    benefitsAndRiskDetails,  paymentCompensationDetails, storageAndConfidentialityDetails, additionalInformationDetails,  
      administrativeRequirementsDetails, declarationDetails, expeditedReviewDetails, requestingWaiverDetails,insertInformedConsent, 
      updateResearchForms, updateInvestigators, insertAdminFiles, updateAdminFiles, checkFormDetails
};