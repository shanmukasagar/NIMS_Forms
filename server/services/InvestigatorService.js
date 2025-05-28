const {connectToMongo, getDB} = require("../models/db");
const {pool} = require("../models/db");

//Get projects data
const getProjectsService = async () => { 
    try{
        await connectToMongo(); //connect to database
        const projectsCollection = getDB().collection("Projects");
        const projectsData = await projectsCollection.find({}).sort({ created_at: -1 }).toArray();
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
        const [admin, investigators, participants, benefits, payment, storage, additional, checklist] =
            await Promise.all([
                client.query(`SELECT * FROM clinical_administration WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_investigators WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_participants WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_benefits_and_risks WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_payment_compensation WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_storage_confidentiality WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_additional_info WHERE form_id = $1`, [formId]),
                client.query(`SELECT * FROM clinical_checklist_items WHERE form_id = $1`, [formId]),
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
        };
    } catch (err) {
        console.error("Error fetching clinical project data:", err.message);
        throw err;
    } finally {
        client.release();
    }
};


module.exports = {getProjectsService, getClinicalProjectData};