const {pool} =require("../models/db");
const {connectToMongo, getDB} = require("../models/db");
const { v4: uuidv4 } = require('uuid');

const checkFormDetails = async (email) => {
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
      project_id: '',
      project_ref: project_ref,
      status: 'pending',
      emp_code: email,
      sub_date: '',
      created_at: new Date(),
      comments: '',
      project_title: '',
      reviewer_id: ''
    };
    await projectsCollection.insertOne(newProjectData);

    return formId;
  } else {
    // Return existing form ID if already present (optional handling)
    return formResult.rows[0].id;
  }
};

const administrationDetails = async (formData) => {
  try {
    const formId = await checkFormDetails(formData.email);
    const { name_of_research_principal,  department,title,  review_requested,protocol_number, 
      version_number,date, email,date_1 } = formData;

    // Check if email exists in the "forms" table
    const formResult = await pool.query(`SELECT * FROM forms WHERE id = $1`, [formId]);

    const newUser = await pool.query(
      "INSERT INTO administrativee_details (name_of_research_principal,department,title,review_requested,protocol_number,version_number,date,email,date_1, form_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, $10) RETURNING idd", // Returning only the id
      [
        name_of_research_principal, department,title,review_requested, protocol_number,version_number,date,email,date_1, formId
      ]
    );
    // Insert into MongoDB
    await connectToMongo();
    const projectsCollection = getDB().collection('Projects');

    const updateProjects = await projectsCollection.updateOne(
      { project_ref: formResult.rows[0].project_ref },
      {
        $set: {
          project_title: title,
          sub_date: new Date(date)
        }
      }
    );
    return newUser;
  } catch (error) {
    console.log("Failed to insert administration", error.message);
    throw error;
  }  
};

const fundingBudgetDetails = async (formData) => {
  try {
    const formId = await checkFormDetails(formData.email);
    const {total_estimated_budget,funding_source,email} = formData;
    // const adminId =   typeof administrativeDetailId === "object"? administrativeDetailId.adminId: administrativeDetailId;
    const newUser = await pool.query(
      `INSERT INTO funding_budgett_and_details (total_estimated_budget, funding_source, email, form_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id`, // Returning only the id
      [total_estimated_budget, funding_source, email, formId]
    );

    return newUser; // Add this
  } catch (error) {
    console.log("Failed to insert funding budget details:", error.message);
    throw error;
  }
};

const overviewResearchDetails = async (formData) => {
  const formId = await checkFormDetails(formData.email);
  try {
    const {
      summary,  type_of_study,external_laboratory,specify,email // camel‑case from front‑end
    } = formData;
    // const adminId = typeof administrativeDetailId === "object"? administrativeDetailId.adminId : administrativeDetailId;
    const newUser = await pool.query(
      `INSERT INTO overvieww_research(  summary, type_of_study,external_laboratory,specify,email, form_id)VALUES 
      ($1, $2, $3,$4,$5, $6)RETURNING id`,
      [summary, type_of_study, external_laboratory, specify,email, formId]
    );
return newUser;
  } catch (error) {
    console.log("Failed to insert overview:", error.message);
    throw error;
  }
};

const participantRelatedInformationDetails = async (formData) => {
  const formId = await checkFormDetails(formData.email);
  try {
    const {type_of_participants, justification,specifiy,  additional_safeguards,reimbursement_details,
      advertisement_type,advertisement_details,   payment_type,
      email, // camel‑case from front‑end
    } = formData;
    // const adminId =typeof administrativeDetailId === "object"  ? administrativeDetailId.adminId  : administrativeDetailId;
    const newUser = await pool.query(
      `INSERT INTO participantt_related_information(  type_of_participants,  justification,specifiy,additional_safeguards,reimbursement_details, 
      advertisement_type,advertisement_details,payment_type,email, form_id)VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9, $10)RETURNING idd`,
      [
        type_of_participants, justification,specifiy,additional_safeguards, 
        ,advertisement_type,advertisement_details,payment_type,email, formId
      ]
    );
    return newUser;
  } catch (error) {
    console.log("Failed to insert overview:", error.message);
    throw error;
  }
};

const benefitsAndRiskDetails = async (formData) => {
  const formId = await checkFormDetails(formData.email);
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

const paymentCompensationDetails = async (formData) => {
  const formId = await checkFormDetails(formData.email);
  try {
    const {waiver_consent_type, specify,  compensation_research_of_type,   specific,email
      // camel‑case from front‑end
    } = formData;
    // const adminId =
    //   typeof administrativeDetailId === "object"? administrativeDetailId.adminId   : administrativeDetailId;
    const newUser = await pool.query(
      `INSERT INTO payment_compensation(  waiver_consent_type,  specify,compensation_research_of_type,
       specific,email, form_id)VALUES ($1, $2, $3,$4,$5, $6)RETURNING id`,
      [
        waiver_consent_type,specify,compensation_research_of_type,specific,email, formId
      ]
    );
    return newUser;
  } catch (error) {
    console.log("Failed to paymentcompensation:", error.message);
    throw error;
  }
};

const storageAndConfidentialityDetails = async (formData) => {
  const formId = await checkFormDetails(formData.email);
  try {
    const {
      document_access_type, access_details,  drugs_access_type,control_details,  sample_access_type, sample_details, email
    } = formData;
    // const adminId =
    //   typeof administrativeDetailId === "object"
    //     ? administrativeDetailId.adminId
    //     : administrativeDetailId;
    const newUser = await pool.query(
      `INSERT INTO storage_and_confidentiality(  document_access_type,access_details,drugs_access_type,control_details, sample_access_type, 
      sample_details,email, form_id)VALUES ($1, $2, $3,$4,$5,$6,$7, $8)RETURNING id`,
      [
        document_access_type,access_details, drugs_access_type, control_details, sample_access_type,sample_details,email, formId
      ]
    );
    return newUser;
  } catch (error) {
    console.log("Failed to storageandconfidentiality:", error.message);
    throw error;
  }
};
const additionalInformationDetails = async (formData) => {
  try {
     const formId = await checkFormDetails(formData.email);
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

const administrativeRequirementsDetails = async (formData) => {
  try {
     const formId = await checkFormDetails(formData.email);
    const {
      documents, enclosure1,remarks1,investigator, enclosure2,remarks2, clinic, enclosure3, remarks3, clearance,   enclosure4,  
       remarks4,partners,    enclosure5,remarks5, protocol, enclosure6,  remarks6,  translate, enclosure7,  remarks7, minors, 
          enclosure8, remarks8, proforma,   enclosure10,   remarks10,  advertise,enclosure11,  remarks11, insurance,   enclosure12,
          remarks12,email
    } = formData;
    // const adminId =
    //   typeof administrativeDetailId === "object"  ? administrativeDetailId?.adminId   : administrativeDetailId;
    const result = await pool.query(
      `INSERT INTO administrative_requirements(   documents, enclosure1, remarks1,investigator, enclosure2,remarks2,clinic,enclosure3,  
      remarks3,   clearance,enclosure4,    remarks4, partners,enclosure5,remarks5, protocol, enclosure6, remarks6,translate,enclosure7,remarks7,
      minors,enclosure8,remarks8,proforma,enclosure10, remarks10,advertise,enclosure11,remarks11,
        insurance,enclosure12,remarks12,email, form_id)
      VALUES ( $1, $2, $3, $4, $5, $6,  $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18,  
        $19, $20, $21, $22, $23, $24,$25, $26, $27, $28, $29, $30, $31, $32,$33,$34, $35)RETURNING id`,
      [
        documents, enclosure1, remarks1, investigator,enclosure2, remarks2,clinic,enclosure3,remarks3,clearance,  
         enclosure4,  remarks4, partners,  enclosure5, remarks5,     protocol, enclosure6,    remarks6,  
           translate, enclosure7, remarks7,   minors,   enclosure8,    remarks8, proforma,enclosure10,remarks10,
             advertise,     enclosure11,  remarks11,  insurance,  enclosure12,   remarks12,email, formId
      ]
    );
    return result;
  } catch (error) {
    console.log("Failed to administrativeerequirments:", error.message);
    throw error;
  }
};

const declarationDetails = async (formData) => {
  try {
     const formId = await checkFormDetails(formData.email);
    const {
      selectedElements,name_of_pi_research, date_pi, name_of_co_pi_guide, date_co_pi, name_of_co_investigator_1, 
       date_co_inv_1, name_of_co_investigator_2,   date_co_inv_2,email
    } = formData;

    // const adminId = typeof administrativeDetailId === "object"
    //     ? administrativeDetailId?.adminId
    //     : administrativeDetailId;

    const newUser = await pool.query(
      `INSERT INTO declaration( selected_elements, name_of_pi_research, date_pi,  name_of_co_pi_guide, 
        date_co_pi,name_of_co_investigator_1,  date_co_inv_1, name_of_co_investigator_2,date_co_inv_2,
          email, form_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11)RETURNING id`,
        [
        selectedElements, name_of_pi_research, date_pi,  name_of_co_pi_guide,  date_co_pi,  name_of_co_investigator_1, 
         date_co_inv_1,name_of_co_investigator_2, date_co_inv_2,email, formId
      ]
    );
    return newUser;
  } catch (error) {
    console.log("Failed to declaration:", error.message);
    throw error;
  }
};

const expeditedReviewDetails = async (formData) => {
   const formId = await checkFormDetails(formData.email);
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

const requestingWaiverDetails = async (formData) => {
   const formId = await checkFormDetails(formData.email);
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
const insertInformedConsent = async (formData) => {
   const formId = await checkFormDetails(formData.email);
  try {
    const {
      seeking_waiver_of_consent_type,  languages,   version_number,  date,version_1,   date_1, version_2,  date_2,version_3,   date_3, 
       specify,  certificates, subject,  selectedElements,email
    } = formData;
    // const adminId = typeof administrativeDetailId === "object"? administrativeDetailId?.adminId: administrativeDetailId;
    // if (!adminId || isNaN(parseInt(adminId))) {
    //   throw new Error(`Invalid administrativeDetailId: ${adminId}`);
    // }
    // console.log("🛠️ Parsed adminId:", adminId);
    console.log("➡️ Input values:", [
      seeking_waiver_of_consent_type, languages, version_number,  date,  version_1,   date_1,version_2,  date_2,  version_3,   date_3,   specify,    certificates,  
         subject, selectedElements,email
      
    ]);
    
    const newUser = await pool.query(
      `INSERT INTO informedd_consent (seeking_waiver_of_consent_type,languages,version_number,date,version_1,date_1,version_2,date_2,
      version_3,date_3,specify,
      certificates,subject,selected_elements,email, form_id
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, $16) RETURNING id`,
      [
        seeking_waiver_of_consent_type, languages,version_number, date, version_1,  date_1,version_2,date_2,version_3,date_3,  specify,  certificates,subject,
        selectedElements,email, formId
      ]
    );
    return newUser;
  } catch (error) {
    console.error("❌ Failed to insert informed consent:", error.message);
    throw error;
  }
};

const saveInvestigatorDetails = async (investigators, email) => {
  const formId = await checkFormDetails(email); // Use the passed email
  const results = [];

  for (const inv of investigators) {
    const {
      name, designation, qualification, department,
      institution = "", address = "", // fallback to empty string if not provided
      investigator_type, email: userEmail, gmail = "", contact = ""
    } = inv;

    const result = await pool.query(
      `INSERT INTO investigatorss (
        name, designation, qualification, department, institution,
        address, investigator_type, email, gmail, contact, form_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
      [
        name, designation, qualification, department, institution,
        address, investigator_type, userEmail, gmail, contact, formId
      ]
    );
    results.push(result.rows[0]);
  }

  return results;
};


module.exports = {
  administrationDetails,saveInvestigatorDetails, fundingBudgetDetails,  overviewResearchDetails, participantRelatedInformationDetails, benefitsAndRiskDetails,  paymentCompensationDetails,storageAndConfidentialityDetails, additionalInformationDetails,  administrativeRequirementsDetails, declarationDetails, expeditedReviewDetails, requestingWaiverDetails,insertInformedConsent,
};
