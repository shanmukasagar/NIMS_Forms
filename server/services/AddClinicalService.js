const {pool} = require("../models/db");
const {connectToMongo, getDB} = require("../models/db");
const { v4: uuidv4 } = require('uuid');
const {sendEmail} = require("../config/SendEmail");
const {FundingTableInsertion, FundingTableUpdate} = require("../config/FundingTableConfig");

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
        else if ((inv.type === "guide" || inv.type === "co-investigator" || inv.role === "guide" || 
            inv.role === "co-investigator" || inv.type === "hod" || inv.role === "co-hod") && inv.name?.trim()) {
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
        const { administration, researchers, investigatorsCount, fundingData, overviewResearch, methodologyData, participants, benefits, consentData, 
            paymentState, storage, additional, declaration, checklist, email, funding_FormData, fundingTableName } = formData;
        const client = await pool.connect();

        const project_ref = uuidv4(); //Generate project reference id

        await client.query("BEGIN"); //begin
        const formResult = await client.query(
            "INSERT INTO forms (form_type, created_at, email, status, project_ref) VALUES ($1, NOW(), $2, $3, $4) RETURNING id",
            ['clinical', email, "pending", project_ref]
        );
        const formId = formResult.rows[0].id;

        const modified_investigators = await flattenInvestigators(researchers, formId);
        
        await client.query(  //Insert Administration details
            `INSERT INTO clinical_administration (form_id, name, department, submission_date, review_type, study_title, short_title, protocol, version, date, email)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [ formId, administration.name, administration.department, administration.submission_date,
                administration.review_type, administration.study_title, administration.short_title,
                administration.protocol, administration.version, administration.date, email ]);

        //Email sent to all filled co-investigators and guide

        const principal = modified_investigators.find(inv => inv.role === "principal" && inv.name);
        const allowedEmployees = [];

        for (const inv of modified_investigators) {
            const {name, designation, qualification, emp_code, department, role,  contact = "", gmail, approved = false, approval_token = ""  } = inv;
            const token = uuidv4(); // Or generate JWT if you want secure verification
            if (inv.role !== "principal" && inv.role !== "hod" && inv.gmail) {

                // You can store this token in PostgreSQL with expiration and investigator ID

                const approvalLink = `http://localhost:3000/investigator/approval?token=${token}&tableName=${"clinical_investigators"}`;

                const html = `
                    <p>Dear ${inv.name},</p>
                    <p>The Principal Investigator <b>${principal.name}</b> has added you to a research project.</p>
                    <p>Please click the button below to approve your involvement:</p>
                    <a href="${approvalLink}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Approve</a>
                    <p>If you did not expect this email, you can ignore it.</p>
                `;

                await sendEmail(principal.gmail, inv.gmail, "Approval Request for Research Project", html);
            }

            allowedEmployees.push(emp_code);

            const result = await client.query(
                `INSERT INTO clinical_investigators (
                    name, designation, qualification, department, emp_code,
                    role, gmail, contact, approved, approval_token, email, form_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id`,
                [ name, designation, qualification, department, emp_code, role, gmail,
                    contact, approved, token, email, formId ]
            );

        }

        await client.query( //Insert investigator counts
            `INSERT INTO clinical_investigators_counts (form_id, pi_count, co_pi_count, duration, email)
             VALUES ($1,$2,$3,$4,$5)`,
            [ formId, investigatorsCount.pi_count, investigatorsCount.co_pi_count, investigatorsCount.duration, email ]);

        await client.query( //Insert funding details
            `INSERT INTO clinical_funding_details (form_id, estimated_budget, funding_source, other_funding_details, email)
             VALUES ($1,$2,$3,$4,$5)`,
            [ formId, fundingData.estimated_budget, fundingData.funding_source, fundingData.other_funding_details, email ]);
        
        //Funding details
        const fundingResult = await FundingTableInsertion(formData.fundingTableName, formId, email, formData.funding_FormData);

        await client.query( //Insert research overview
            `INSERT INTO clinical_research_overview (form_id, overview_summary, study_type, other_study_type, email)
             VALUES ($1,$2,$3,$4,$5)`,
            [ formId, overviewResearch.overview_summary, overviewResearch.study_type, overviewResearch.other_study_type, email ]);

        await client.query( //Insert methodology data
            `INSERT INTO clinical_methodology (form_id, total_sample_size, site_participants, lab_outsourcing, lab_details, email)
             VALUES ($1,$2,$3,$4,$5,$6)`,
            [ formId, methodologyData.total_sample_size, methodologyData.site_participants, methodologyData.lab_outsourcing,
                 methodologyData.lab_details, email ]);
              
        
        await client.query( //Insert participant details
            `INSERT INTO clinical_participants (form_id, participant_type, vulnerable_groups, reimbursement, 
            reimbursement_details, email, other_participant, additional_safeguards, justification)
             VALUES ($1,$2,$3,$4,$5,$6,$7, $8, $9)`,
            [ formId, participants.participant_type, participants.vulnerable_groups,
              participants.reimbursement, participants.reimbursement_details, email, participants.other_participant, 
              participants.additional_safeguards, participants.justification]);
                
        //Benefits and risks
        await client.query(
            `INSERT INTO clinical_benefits_and_risks (form_id, any_risk, is_adv, risk_details, risk_strategy, participant_benefits, social_benefits, science_benefits, adv_details, email)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8, $9, $10)`,
            [ formId, benefits.any_risk, benefits.is_adv, benefits.risk_details, benefits.risk_strategy,
                benefits.participant_benefits, benefits.social_benefits, benefits.science_benefits,
                benefits.adv_details, email ]);

        await client.query(
            `INSERT INTO clinical_consent_details (form_id, waiver_consent, english_version_number, english_date, translated_languages,
                 translation_cert_provided, understanding_tools, understanding_tools_specify, pis_elements, language_details, email, 
                 reason_for_waiver, other_reason) 
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`, 
                 [formId, consentData.waiver_consent, consentData.english_version_number, consentData.english_date, 
                    consentData.translated_languages, consentData.translation_cert_provided, consentData.understanding_tools, 
                    consentData.understanding_tools_specify, consentData.pis_elements, consentData.languageDetails, email,
                     consentData.reason_for_waiver, consentData.other_reason]);

                
        //Payment compensation
        await client.query(
            `INSERT INTO clinical_payment_compensation (form_id, injury_treatment, injury_details, sae_compensation, approval, approval_details, sae_details, email)
                VALUES ($1,$2,$3,$4,$5, $6, $7, $8)`,
            [formId, paymentState.injury_treatment, paymentState.injury_details, paymentState.sae_compensation, paymentState.approval, 
                paymentState.approval_details, paymentState.sae_details, email]);
        
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

        //Declaration
        await client.query(
            `INSERT INTO clinical_declarations (
                form_id, email, declarations,
                pi_name, pi_signature, pi_date,
                guide_name, guide_signature, guide_date,
                hod_name, hod_signature, hod_date,
                co1_name, co1_signature, co1_date,
                co2_name, co2_signature, co2_date
            ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9,
                $10, $11, $12, $13, $14, $15, $16, $17, $18
            )`,
            [
                formId, email, declaration.declarations,
                declaration.pi_name, declaration.pi_signature, declaration.pi_date,
                declaration.guide_name, declaration.guide_signature, declaration.guide_date,
                declaration.hod_name, declaration.hod_signature, declaration.hod_date,
                declaration.co1_name, declaration.co1_signature, declaration.co1_date,
                declaration.co2_name, declaration.co2_signature, declaration.co2_date
            ]
        );

        //Checklist
        for (const item of checklist) {
            await client.query(
                `INSERT INTO clinical_checklist_items (form_id, label, label_id, file_name, email)
                VALUES ($1, $2, $3, $4, $5)`,
                [formId, item.label, item.label_id, item.file_name, email]
            );
        }

        
        await client.query("COMMIT"); //commit all inserts

        await connectToMongo();
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
            "reviewer_id" : "",
            "reviewer_name" : "", isrc_inv_comments: '', pbac_inv_comments: '', niec_inv_comments: '',
            "project_pdf" : "",
            type : "clinical",
            form_type : "Principal/CoInvestigator",
            investigator_name : administration.name,
            investigator_dep : administration.department,
            "allowedEmployees" : allowedEmployees,
            form_number : formId
        }

        const result = await projectsCollection.insertOne(newProjectData);
        if(result.acknowledged) {
            return {"isSuccess" : true, "project_ref" : project_ref};
        }
        return {"isSuccess" : false, "project_ref" : project_ref};
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
    const { submittedFormId, administration, researchers, investigatorsCount, fundingData, overviewResearch, methodologyData, participants, benefits, consentData, 
            paymentState, storage, additional, declaration, checklist, email } = formData;

    const formId = submittedFormId;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const modified_investigators = await flattenInvestigators(researchers, formId);

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
            administration.protocol, administration.version, administration.date, email]
        );

        // Update investigators (delete + insert)
        await client.query(`DELETE FROM clinical_investigators WHERE form_id = $1`, [formId]);

        //Email sent to all filled co-investigators and guide

        const principal = modified_investigators.find(inv => inv.role === "principal" && inv.name);
        const allowedEmployees = [];

        for (const inv of modified_investigators) {
            const {name, designation, qualification, department, role, emp_code,  contact = "", gmail, approved = false, approval_token = ""  } = inv;
            const token = uuidv4(); // Or generate JWT if you want secure verification
            if (inv.role !== "principal" && inv.role !== "hod" && inv.gmail) {

                // You can store this token in PostgreSQL with expiration and investigator ID

                const approvalLink = `http://localhost:3000/investigator/approval?token=${token}&tableName=${"clinical_investigators"}`;

                const html = `
                    <p>Dear ${inv.name},</p>
                    <p>The Principal Investigator <b>${principal.name}</b> has added you to a research project.</p>
                    <p>Please click the button below to approve your involvement:</p>
                    <a href="${approvalLink}" style="padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Approve</a>
                    <p>If you did not expect this email, you can ignore it.</p>
                `;

                await sendEmail(principal.gmail, inv.gmail, "Approval Request for Research Project", html);
            }

            allowedEmployees.push(emp_code);

            const result = await client.query(
                `INSERT INTO clinical_investigators (
                    name, designation, qualification, department, emp_code,
                    role, gmail, contact, approved, approval_token, email, form_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
                [ name, designation, qualification, department, emp_code,
                    role, gmail, contact, approved, token, email, formId
                ]
            );
        }

        //Update Investigators count
        await client.query( `UPDATE clinical_investigators_counts  SET pi_count = $1, co_pi_count = $2, duration = $3, email = $4
            WHERE form_id = $5`, [ investigatorsCount.pi_count, investigatorsCount.co_pi_count, investigatorsCount.duration, email, formId ] );

        //Update funding details
        await client.query( `UPDATE clinical_funding_details
                SET estimated_budget = $1, funding_source = $2, other_funding_details = $3, email = $4 WHERE form_id = $5`,
            [ fundingData.estimated_budget, fundingData.funding_source, fundingData.other_funding_details, email, formId ]
        );

        //Update funding details
        const fundingResult = await FundingTableUpdate(formData.fundingTableName, formId, 
            formData.funding_FormData);

        //Research overview
        await client.query( `UPDATE clinical_research_overview
            SET overview_summary = $1, study_type = $2, other_study_type = $3, email = $4 WHERE form_id = $5`,
            [ overviewResearch.overview_summary, overviewResearch.study_type, overviewResearch.other_study_type, email, formId ]
        );

        //Methodology
        await client.query( `UPDATE clinical_methodology SET  total_sample_size = $1, site_participants = $2,
            lab_outsourcing = $3, lab_details = $4, email = $5 WHERE form_id = $6`,
            [  methodologyData.total_sample_size, methodologyData.site_participants,
                methodologyData.lab_outsourcing, methodologyData.lab_details, email, formId ]
        );


        // Update participants
        await client.query( `UPDATE clinical_participants
            SET participant_type = $1, vulnerable_groups = $2, 
                reimbursement = $3, reimbursement_details = $4, email = $5, other_participant = $6, 
                additional_safeguards = $7, justification = $8 WHERE form_id = $9`,
            [ participants.participant_type, participants.vulnerable_groups, 
                participants.reimbursement, participants.reimbursement_details, email, participants.other_participant, 
                participants.additional_safeguards, participants.justification, formId ]
        );


        // Update benefits
        await client.query( `UPDATE clinical_benefits_and_risks SET any_risk = $1, is_adv = $2, risk_details = $3, risk_strategy = $4,
                participant_benefits = $5, social_benefits = $6, science_benefits = $7, adv_details = $8, email = $9
            WHERE form_id = $10`,
            [ benefits.any_risk, benefits.is_adv, benefits.risk_details, benefits.risk_strategy,
                benefits.participant_benefits, benefits.social_benefits, benefits.science_benefits, benefits.adv_details, email, formId ]
        );

        //Informed consent details
        await client.query(`UPDATE clinical_consent_details SET waiver_consent=$1, english_version_number=$2, english_date=$3, 
            translated_languages=$4, translation_cert_provided=$5, understanding_tools=$6, understanding_tools_specify=$7, 
            pis_elements=$8, language_details=$9, email=$10, reason_for_waiver=$11, other_reason=$12 WHERE form_id=$13`, 
            [consentData.waiver_consent, consentData.english_version_number, consentData.english_date, consentData.translated_languages,
                 consentData.translation_cert_provided, consentData.understanding_tools, consentData.understanding_tools_specify, 
                 consentData.pis_elements, consentData.languageDetails, email, consentData.reason_for_waiver, consentData.other_reason, 
                 formId]
        );


        // Update payment compensation
        await client.query( `UPDATE clinical_payment_compensation
            SET injury_treatment = $1, sae_compensation = $2, approval = $3, approval_details = $4,
                sae_details = $5, injury_details = $6, email = $7 WHERE form_id = $8`,
            [
                paymentState.injury_treatment, paymentState.sae_compensation, paymentState.approval,
                paymentState.approval_details, paymentState.sae_details, paymentState.injury_details,
                email, formId
            ]
        );


        // Update storage
        await client.query( `UPDATE clinical_storage_confidentiality
            SET docs_control = $1, docs_details = $2, drugs_control = $3, drugs_details = $4, email = $5
            WHERE form_id = $6`,
            [ storage.docs_control, storage.docs_details, storage.drugs_control, storage.drugs_details, email, formId ]
        );


        // Update additional info
        await client.query(`UPDATE clinical_additional_info
            SET any_additional = $1, additional_info = $2, email = $3 WHERE form_id = $4`,
            [ additional.any_additional, additional.additional_info, email, formId ]
        );

        //Declarations
        await client.query(
            `UPDATE clinical_declarations SET
                declarations = $1, pi_name = $2, pi_signature = $3, pi_date = $4,
                guide_name = $5, guide_signature = $6, guide_date = $7,
                hod_name = $8, hod_signature = $9, hod_date = $10,
                co1_name = $11, co1_signature = $12, co1_date = $13,
                co2_name = $14, co2_signature = $15, co2_date = $16,
                email = $17 WHERE form_id = $18`,
            [
                declaration.declarations,
                declaration.pi_name, declaration.pi_signature, declaration.pi_date,
                declaration.guide_name, declaration.guide_signature, declaration.guide_date,
                declaration.hod_name, declaration.hod_signature, declaration.hod_date,
                declaration.co1_name, declaration.co1_signature, declaration.co1_date,
                declaration.co2_name, declaration.co2_signature, declaration.co2_date,
                email, formId
            ]
        );

        // Update checklist items (delete + insert)
        await client.query(`DELETE FROM clinical_checklist_items WHERE form_id = $1`, [formId]);
        for (const item of checklist) {
            await client.query(
                `INSERT INTO clinical_checklist_items (form_id, label, label_id, file_name, email)
                VALUES ($1, $2, $3, $4, $5)`,
                [formId, item.label, item.label_id, item.file_name, item.email]
            );
        }

        // Update MongoDB project
        await connectToMongo();
        const projectsCollection = getDB().collection("Projects");

        await projectsCollection.updateOne(
            { project_ref: submittedFormInfo.project_ref },
            {
                $set: {
                    project_title: administration.study_title,
                    updated_at: new Date(),
                    allowedEmployees : allowedEmployees
                }
            }
        );

        await client.query("COMMIT");
       return {"isSuccess" : true, "project_ref" : submittedFormInfo.project_ref};
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
                storageRes, additionalRes, checklistRes, investigatorCountRes, fundingRes, researchRes, methodologyRes,
            consentRes, declarationRes ] = await Promise.all([
                    client.query("SELECT * FROM clinical_administration WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_participants WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_investigators WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_benefits_and_risks WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_payment_compensation WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_storage_confidentiality WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_additional_info WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_checklist_items WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_investigators_counts WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_funding_details WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_research_overview WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_methodology WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_consent_details WHERE form_id = $1", [formId]),
                    client.query("SELECT * FROM clinical_declarations WHERE form_id = $1", [formId]),

            ]);
    
            // Convert investigators into required format
            const investigatorsData = investigatorsRes.rows;
        
            const principal = investigatorsData.find(i => i.role === "principal") || {};
        
            const coInvestigators = investigatorsData
                .filter(i => i.role === "co")
                    .map(i => ({ name: i.name, designation: i.designation, qualification: i.qualification,
                        department: i.department, gmail: i.gmail, contact: i.contact 
            }));
    
            const investigators = {
                investigators: { principal: {
                    name: principal.name || "", designation: principal.designation || "",
                    qualification: principal.qualification || "", department: principal.department || "", 
                    gmail: principal.gmail || "", contact: principal.contact || ""
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
                investigatorsCount: investigatorCountRes.rows[0] || {},
                fundingData: fundingRes.rows[0] || {},
                overviewResearch: researchRes.rows[0] || {},
                methodologyData: methodologyRes.rows[0] || {},
                consentData: consentRes.rows[0] || {},
                declaration: declarationRes.rows[0] || {},

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
        const projectsData = await projectsCollection.find({}).toArray();
        return projectsData;
    }
    catch(error) {
        console.log("Error occured while fetching invetigator projects");
        throw error;
    }
}

module.exports = {addClinicalService, getClinicalService, getProjectsService, updateClinicalService}