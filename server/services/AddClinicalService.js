const {pool} = require("../models/db");

async function flattenInvestigators(data, formId) {
    const { principal, coInvestigators } = data.investigators;
    const result = [];
  
    // Add principal with role
    if (principal?.name?.trim()) {
        result.push({ ...principal, role: "principal", form_id: formId });
    }
  
    // Add valid co-investigators only
    for (const co of coInvestigators) {
        const hasData = Object.values(co).some(value => value?.trim?.() !== "");
        if (hasData) {
            result.push({ ...co, role: "co", form_id: formId });
        }
    }
    return result;
}

const addClinicalService = async(formData) => {
    try{
        const { administration, researchers, participants, benefits, paymentState, 
            storage, additional, checkListData, email } = formData;
        const client = await pool.connect();

        await client.query("BEGIN"); //begin
        const formResult = await client.query(
            "INSERT INTO forms (form_type, created_at, email) VALUES ($1, NOW(), $2) RETURNING id",
            ['clinical', email]
        );
        const formId = formResult.rows[0].id;

        const modified_investigators = await flattenInvestigators(researchers, formId);
        
        //Insert Administration details
        await client.query( 
            `INSERT INTO clinical_administration (form_id, name, department, submission_date, review_type, study_title, short_title, protocol, version, date, email)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [ formId, administration.name, administration.department, administration.submissionDate,
                administration.reviewType, administration.studyTitle, administration.shortTitle,
                administration.protocol, administration.version, administration.Date, email ]);
        
        // Insert Principal and co investigators
        for (const inv of modified_investigators) {
            await client.query( `INSERT INTO clinical_investigators 
                (form_id, name, role, designation, department, qualification, contact, address, email)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                [ inv.form_id, inv.name, inv.role, inv.designation, inv.department,
                inv.qualification, inv.contact, inv.address, email ]   );
        }
        
        //Insert participant details
        await client.query(
            `INSERT INTO clinical_participants (form_id, participant_type, justification, safeguards, reimbursement, reimbursement_details, email)
             VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [ formId, participants.participantType, participants.justification, participants.safeguards,
              participants.reimbursement, participants.reimbursementDetails, email ]);
                
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
            [formId, paymentState.injury_treatment, paymentState.SAE_compensation, paymentState.approval, paymentState.approval_details, email]);
        
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
              [formId, item.label, item.status, item.enclosureNo, item.remarks, email]
            );
        }

        await client.query("COMMIT"); //commit all inserts
        return true;
    }
    catch(error) {
        await client.query("ROLLBACK");
        console.log(error.message);
        throw error;
    }
}

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

module.exports = {addClinicalService, getClinicalService}