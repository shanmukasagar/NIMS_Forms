const {connectToMongo, getDB} = require("../models/db");
const {pool} = require("../models/db");
const { v4: uuidv4 } = require('uuid');
const sendEmail = require("../config/SendEmail");

//Get projects data
const getProjectsService = async (email, type) => { 
    try{
        await connectToMongo(); //connect to database
        const projectsCollection = getDB().collection("Projects");
        const reviewersCollection = getDB().collection("AssignReviewers");
        let filteredObj = {};
        if(type === "investigators") {
            filteredObj = {emp_code : email};
        }
        else if(type === "isrc_member") {
            // filteredObj = { project_id: { $nin: ["", null] }, emp_code : email };
        }
        else if(type === "isrc_secretary") {
            // filteredObj = { project_id: { $ne: "" } };
            filteredObj = {};
            const reviewersData = await reviewersCollection.find({}).toArray();
            const projectsData = await projectsCollection.find(filteredObj).sort({ created_at: -1 }).toArray();
            return {projects : projectsData, reviewers : reviewersData};
        }
        else if(type === "isrc_chair") {
            filteredObj = {};
        }
        const projectsData = await projectsCollection.find(filteredObj).sort({ created_at: -1 }).toArray();
        return projectsData;
    }
    catch(error) {
        console.log("Error occured while fetching projects");
        throw error;
    }
}

//Get overall project data
const getClinicalProjectData = async (project_ref) => {
    const client = await pool.connect();
    try {
        // Step 1: Get form ID using project_ref
        const formRes = await client.query(
            `SELECT id, email FROM forms WHERE project_ref = $1`, 
            [project_ref]
        );
        if (formRes.rows.length === 0) throw new Error("Form not found");

        const formId = formRes.rows[0].id;
        const email = formRes.rows[0].email;

        // Step 2: Fetch related data using form_id
        const [admin, investigators, participants, benefits, payment, storage, additional, checklist, investigatorCountRes, fundingRes, researchRes, 
            methodologyRes, consentRes, declarationRes] =
            await Promise.all([
                client.query(`SELECT * FROM clinical_administration WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_investigators WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_participants WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_benefits_and_risks WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_payment_compensation WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_storage_confidentiality WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_additional_info WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_checklist_items WHERE form_id = $1`, [formId]),
                client.query("SELECT * FROM clinical_investigators_counts WHERE form_id = $1", [formId]),
                client.query("SELECT * FROM clinical_funding_details WHERE form_id = $1", [formId]),
                client.query("SELECT * FROM clinical_research_overview WHERE form_id = $1", [formId]),
                client.query("SELECT * FROM clinical_methodology WHERE form_id = $1", [formId]),
                client.query("SELECT * FROM clinical_consent_details WHERE form_id = $1", [formId]),
                client.query("SELECT * FROM clinical_declarations WHERE form_id = $1", [formId]),
            ]);

        return {
            administration: admin.rows[0],
            researchers: investigators.rows,
            participants: participants.rows[0],
            benefits: benefits.rows[0],
            paymentState: payment.rows[0],
            storage: storage.rows[0],
            additional: additional.rows[0],
            checkListData: checklist.rows,
            investigatorsCount: investigatorCountRes.rows[0] || {},
            fundingData: fundingRes.rows[0] || {},
            overviewResearch: researchRes.rows[0] || {},
            methodologyData: methodologyRes.rows[0] || {},
            consentData: consentRes.rows[0] || {},
            declaration: declarationRes.rows[0] || {},
        };
    } catch (err) {
        console.error("Error fetching clinical project data:", err.message);
        throw err;
    } finally {
        client.release();
    }
};

const generateAndSendHODApprovalEmails = async (investigators, principal, tableName) => {
    for (const inv of investigators) {
        if ((inv.investigator_type === "hod" || inv.role === "hod") && inv.gmail) {
            const hodToken = inv.approval_token;

            // (Optional) Store HOD token in DB for later validation
            await pool.query(
                `UPDATE ${tableName} SET approval_token = $1 WHERE id = $2`,
                [hodToken, inv.id]
            );

            const hodApprovalLink = `http://localhost:3000/hod/approval?token=${hodToken}&tableName=${tableName}`;

            const html = `
                <p>Dear ${inv.name},</p>
                <p>The Principal Investigator <b>${principal?.name || "Unknown"}</b> has requested your approval as HOD for a research project.</p>
                <p>Please click the button below to approve:</p>
                <a href="${hodApprovalLink}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none;">HOD Approve</a>
                <p>If you did not expect this email, you can ignore it.</p>
            `;

            await sendEmail(principal?.gmail || "", inv.gmail, "HOD Approval Request for Research Project", html);
        }
    }
};


const approvalService = async (token, tableName) => {
    const client = await pool.connect();
    try {
        let checkRes, formsRes, allApproved;
        let result, form_id;

        if (tableName === "investigatorss") {
            result = await client.query(
                `UPDATE investigatorss SET approved = true WHERE approval_token = $1 RETURNING form_id`,
                [token]
            );
            if (result.rowCount === 0) return false;

            form_id = result.rows[0].form_id;

            checkRes = await client.query(`
                SELECT * FROM investigatorss 
                WHERE form_id = $1 
                AND investigator_type NOT IN ('Principal_Investigator', 'hod')`,
                [form_id]
            );
            formsRes = await client.query(`SELECT * FROM forms WHERE id = $1`, [form_id]);
            allApproved = checkRes.rows.every(row => row.approved);

            if (allApproved) {
                const investigatorsResult = await client.query(
                    `SELECT * FROM investigatorss WHERE form_id = $1`,
                    [form_id]
                );
                const investigators = investigatorsResult.rows;
                const principal = investigators.find(inv => inv.investigator_type === "Principal_Investigator");

                await generateAndSendHODApprovalEmails(investigators, principal, "investigatorss");
            }

        } else if (tableName === "clinical_investigators") {
            result = await client.query(
                `UPDATE clinical_investigators SET approved = true WHERE approval_token = $1 RETURNING form_id`,
                [token]
            );
            if (result.rowCount === 0) return false;

            form_id = result.rows[0].form_id;

            checkRes = await client.query(`
                SELECT * FROM clinical_investigators 
                WHERE form_id = $1 
                AND role NOT IN ('principal', 'hod')`,
                [form_id]
            );
            formsRes = await client.query(`SELECT * FROM forms WHERE id = $1`, [form_id]);
            allApproved = checkRes.rows.every(row => row.approved);

            if (allApproved) {
                const investigatorsResult = await client.query(
                    `SELECT * FROM clinical_investigators WHERE form_id = $1`,
                    [form_id]
                );
                const investigators = investigatorsResult.rows;
                const principal = investigators.find(inv => inv.role === "principal");

                await generateAndSendHODApprovalEmails(investigators, principal, "clinical_investigators");
            }
        }
        return true;
    } catch (err) {
        console.error("Error in approvalService:", err.message);
        throw err;
    } finally {
        client.release();
    }
};

//HOD approval service
const approveHODService = async (token, tableName) => {
  const client = await pool.connect();

  try {
    let approvalRes;

    if(tableName === "clinical_investigators") {
        approvalRes = await client.query(
                `UPDATE clinical_investigators SET approved = true WHERE approval_token = $1 RETURNING form_id`,
                [token]
            );
    }
    else if(tableName === "investigatorss") {
        approvalRes = await client.query(
                `UPDATE investigatorss SET approved = true WHERE approval_token = $1 RETURNING form_id`,
                [token]
            );
    }

    if (approvalRes.rowCount === 0) {
      throw new Error("Invalid or already approved token");
    }

    const { form_id } = approvalRes.rows[0];

    // 2. Get project_ref from forms table
    const formRes = await client.query(`SELECT project_ref FROM forms WHERE id = $1`, [form_id]);
    const projectRef = formRes?.rows?.[0]?.project_ref;

    if (!projectRef) throw new Error("Project reference not found");

    // 3. Update MongoDB
    await connectToMongo();
    const projectsCollection = getDB().collection('Projects');

    const updateRes = await projectsCollection.updateOne(
      { project_ref: projectRef },
      { $set: { project_id: uuidv4() } }
    );

    if (updateRes.modifiedCount === 0) {
      throw new Error("Failed to update project_id in MongoDB");
    }

    return "HOD approved and project_id updated successfully";
  } finally {
    client.release();
  }
};

module.exports = {getProjectsService, getClinicalProjectData, approvalService, approveHODService};