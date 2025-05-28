const {pool} = require("../models/db");
const {connectToMongo, getDB} = require("../models/db");
const { v4: uuidv4 } = require('uuid');

const formatDateForPostgres = (dateStr) => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`; // YYYY-MM-DD
};

/**
 * Modified investigators object according to our need and checking empty not to put in database 
 */
async function flattenInvestigators(data, formId) { 
    const result = [];

    for (const inv of data) {
        const hasData = Object.values(inv).some(value => value?.trim?.() !== "");
        if (!hasData) continue;

        // Only push principal if name is missing => throw error
        if (inv.type === "principal" || inv.role === "principal") {
            if (!inv.name?.trim()) {
                throw new Error("Principal investigator name is required.");
            }
            result.push({ ...inv, role: "principal", form_id: formId });
        }

        // Add optional types if they contain at least a name or meaningful data
        else if ((inv.type === "guide" || inv.type === "co-investigator" || inv.role === "guide" || inv.role === "co-investigator") && inv.name?.trim()) {
            result.push({ ...inv, role: inv.type, form_id: formId });
        }
    }

    return result;
}

/**
 * Add clinical trail service 
 */
const addClinicalService = async(formData) => {
    try{
        const { administration, researchers, participants, benefits, paymentState, 
            storage, additional, checkListData, email } = formData;
        const client = await pool.connect();

        const project_ref = uuidv4(); //Generate project reference id

        await client.query("BEGIN"); //begin
        const formResult = await client.query(
            "INSERT INTO forms (form_type, created_at, email, status, project_ref) VALUES ($1, NOW(), $2, $3, $4) RETURNING id",
            ['clinical', email, "pending", project_ref]
        );
        const formId = formResult.rows[0].id;

        const modified_investigators = await flattenInvestigators(researchers, formId);
        const studyDate = formatDateForPostgres(administration.date);
        
        await client.query(  //Insert Administration details
            `INSERT INTO clinical_administration (form_id, name, department, submission_date, review_type, study_title, short_title, protocol, version, date, email)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [ formId, administration.name, administration.department, administration.submission_date,
                administration.review_type, administration.study_title, administration.short_title,
                administration.protocol, administration.version, studyDate, email ]);
        
        for (const inv of modified_investigators) {  // Insert Principal and co investigators
            await client.query(`
                INSERT INTO clinical_investigators 
                (form_id, name, role, designation, department, qualification, contact, address, email)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    inv.form_id, inv.name, inv.role, inv.designation || '', inv.department || '',
                    inv.qualification || '', inv.contact || '', inv.address || '', inv.email || ''
                ]
            );
        }
        
        await client.query( //Insert participant details
            `INSERT INTO clinical_participants (form_id, participant_type, justification, safeguards, reimbursement, reimbursement_details, email)
             VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [ formId, participants.participant_type, participants.justification, participants.safeguards,
              participants.reimbursement, participants.reimbursement_details, email ]);
                
        //Benefits and risks
        await client.query(
            `INSERT INTO clinical_benefits_and_risks (form_id, any_risk, risk_details, risk_strategy, participant_benefits, social_benefits, science_benefits, adv_details, email)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9)`,
            [ formId, benefits.any_risk, benefits.risk_details, benefits.risk_strategy,
                benefits.participant_benefits, benefits.social_benefits, benefits.science_benefits,
                benefits.adv_details, email ]);
                
        //Payment compensation
        await client.query(
            `INSERT INTO clinical_payment_compensation (form_id, injury_treatment, sae_compensation, approval, approval_details, email)
                VALUES ($1,$2,$3,$4,$5, $6)`,
            [formId, paymentState.injury_treatment, paymentState.sae_compensation, paymentState.approval, paymentState.approval_details, email]);
        
        //Storage Confidentiality
        await client.query(
            `INSERT INTO clinical_storage_confidentiality (form_id, docs_control, docs_details, drugs_control, drugs_details, email)
                VALUES ($1,$2,$3,$4,$5, $6)`,
            [formId, storage.docs_control, storage.docs_details, storage.drugs_control, storage.drugs_details, email]);
        
        //Additional Information
        await client.query(
            `INSERT INTO clinical_additional_info (form_id, any_additional, additional_info, email)
                VALUES ($1,$2,$3, $4)`,
            [formId, additional.any_additional, additional.additional_info, email]);

        //Checklist Information
        for (const item of checkListData) {
            await client.query(
              `INSERT INTO clinical_checklist_items (form_id, label, status, enclosure_no, remarks, email)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [formId, item.label, item.status, item.enclosure_no, item.remarks, email]
            );
        }

        await client.query("COMMIT"); //commit all inserts

        // Add new project in mongodb simple data 
        await connectToMongo(); //connect to database
        const projectsCollection = getDB().collection("Projects");

        const newProjectData = {
            "project_id" : "",
            "project_ref" : project_ref,
            "status" : "pending",
            "emp_code" : email,
            "sub_date" : administration.submission_date,
            "created_at" : new Date(),
            "comments" : "",
            "project_title" : administration.study_title,
            "reviewer_id" : ""
        }

        const result = await projectsCollection.insertOne(newProjectData);
        if(result.acknowledged) {
            return true;
        }
        return false;
    }
    catch(error) {
        await client.query("ROLLBACK");
        console.log(error.message);
        throw error;
    }
}
/**
 * Update clinical trail service 
 */
const updateClinicalService = async (formData) => {
    const {
        submittedFormId, administration, researchers, participants, benefits, paymentState,
        storage, additional, checkListData, email
    } = formData;

    const formId = submittedFormId;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const modified_investigators = await flattenInvestigators(researchers, formId);
        const studyDate = formatDateForPostgres(administration.date);

        const formInfo = await client.query("SELECT * FROM forms WHERE id = $1",  [formId]);
        const submittedFormInfo = formInfo.rows[0];

        // Update clinical_administration
        await client.query(
            `UPDATE clinical_administration SET
                name = $2, department = $3, submission_date = $4, review_type = $5,
                study_title = $6, short_title = $7, protocol = $8, version = $9,
                date = $10, email = $11
            WHERE form_id = $1`,
            [formId, administration.name, administration.department, administration.submission_date,
            administration.review_type, administration.study_title, administration.short_title,
            administration.protocol, administration.version, studyDate, email]
        );

        // Update investigators (delete + insert)
        await client.query(`DELETE FROM clinical_investigators WHERE form_id = $1`, [formId]);
        for (const inv of modified_investigators) {
            await client.query(
                `INSERT INTO clinical_investigators
                (form_id, name, role, designation, department, qualification, contact, address, email)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [
                    inv.form_id, inv.name, inv.role, inv.designation || '', inv.department || '',
                    inv.qualification || '', inv.contact || '', inv.address || '', inv.email || ''
                ]
            );
        }

        // Update participants
        await client.query(
            `UPDATE clinical_participants SET
                participant_type = $2, justification = $3, safeguards = $4,
                reimbursement = $5, reimbursement_details = $6, email = $7
            WHERE form_id = $1`,
            [formId, participants.participant_type, participants.justification, participants.safeguards,
            participants.reimbursement, participants.reimbursement_details, email]
        );

        // Update benefits
        await client.query(
            `UPDATE clinical_benefits_and_risks SET
                any_risk = $2, risk_details = $3, risk_strategy = $4,
                participant_benefits = $5, social_benefits = $6, science_benefits = $7,
                adv_details = $8, email = $9
            WHERE form_id = $1`,
            [formId, benefits.any_risk, benefits.risk_details, benefits.risk_strategy,
            benefits.participant_benefits, benefits.social_benefits, benefits.science_benefits,
            benefits.adv_details, email]
        );

        // Update payment compensation
        await client.query(
            `UPDATE clinical_payment_compensation SET
                injury_treatment = $2, sae_compensation = $3, approval = $4,
                approval_details = $5, email = $6
            WHERE form_id = $1`,
            [formId, paymentState.injury_treatment, paymentState.sae_compensation,
            paymentState.approval, paymentState.approval_details, email]
        );

        // Update storage
        await client.query(
            `UPDATE clinical_storage_confidentiality SET
                docs_control = $2, docs_details = $3, drugs_control = $4,
                drugs_details = $5, email = $6
            WHERE form_id = $1`,
            [formId, storage.docs_control, storage.docs_details,
            storage.drugs_control, storage.drugs_details, email]
        );

        // Update additional info
        await client.query(
            `UPDATE clinical_additional_info SET
                any_additional = $2, additional_info = $3, email = $4
            WHERE form_id = $1`,
            [formId, additional.any_additional, additional.additional_info, email]
        );

        // Update checklist items (delete + insert)
        await client.query(`DELETE FROM clinical_checklist_items WHERE form_id = $1`, [formId]);
        for (const item of checkListData) {
            await client.query(
                `INSERT INTO clinical_checklist_items
                 (form_id, label, status, enclosure_no, remarks, email)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [formId, item.label, item.status, item.enclosure_no, item.remarks, email]
            );
        }

        
        // Update MongoDB project
        await connectToMongo();
        const projectsCollection = getDB().collection("Projects");

        await projectsCollection.updateOne(
            { project_ref: submittedFormInfo.project_ref },
            {
                $set: {
                    sub_date: administration.submission_date,
                    project_title: administration.study_title,
                    updated_at: new Date()
                }
            }
        );

        await client.query("COMMIT");
        return true;
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Update Error:", error.message);
        throw error;
    } finally {
        client.release();
    }
};



const getClinicalService = async(email) => {
    try{
        const client = await pool.connect();

        await client.query("BEGIN"); //begin

        const formsResult = await client.query( "SELECT * FROM forms WHERE email = $1", [email] );
    
        const fullForms = [];
    
        for (const form of formsResult.rows) {
            const formId = form.id;
    
            const [ adminRes, participantsRes, investigatorsRes, benefitsRes, paymentRes,
                storageRes, additionalRes, checklistRes ] = await Promise.all([
                    client.query("SELECT * FROM clinical_administration WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_participants WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_investigators WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_benefits_and_risks WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_payment_compensation WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_storage_confidentiality WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_additional_info WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_checklist_items WHERE form_id = $1", [formId])
            ]);
    
            // Convert investigators into required format
            const investigatorsData = investigatorsRes.rows;
        
            const principal = investigatorsData.find(i => i.role === "principal") || {};
        
            const coInvestigators = investigatorsData
                .filter(i => i.role === "co")
                    .map(i => ({ name: i.name, designation: i.designation, qualification: i.qualification,
                        department: i.department, address: i.address, contact: i.contact 
            }));
    
            const investigators = {
                investigators: { principal: {
                    name: principal.name || "", designation: principal.designation || "",
                    qualification: principal.qualification || "", department: principal.department || "", 
                    address: principal.address || "", contact: principal.contact || ""
                },
                coInvestigators
                }
            };
        
            fullForms.push({
                form_id: form.id, form_type: form.form_type, created_at: form.created_at,
                administration: adminRes.rows[0] || {}, 
                participants: participantsRes.rows[0] || {},
                researchers: investigators, 
                benefits: benefitsRes.rows[0] || {},
                paymentState: paymentRes.rows[0] || {},
                storage: storageRes.rows[0] || {},
                additional: additionalRes.rows[0] || {},
                checkListData: checklistRes.rows || [],
            });
        }
        await client.query("COMMIT");
        return fullForms;
    }
    catch(error) {
        await client.query("ROLLBACK");
        console.log(error.message);
        throw error;
    }
} 

const getProjectsService = async(emp_code) => {
    try{
        await connectToMongo(); //connect to database
        const projectsCollection = getDB().collection("Projects");
        const projectsData = await projectsCollection.find({emp_code : emp_code}).toArray();
        return projectsData;
    }
    catch(error) {
        console.log("Error occured while fetching invetigator projects");
        throw error;
    }
}

module.exports = {addClinicalService, getClinicalService, getProjectsService, updateClinicalService}