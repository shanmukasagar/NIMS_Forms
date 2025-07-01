const {getProjectsService, getClinicalProjectData, approvalService, approveHODService, projectChanges

} = require("../services/InvestigatorService");

//Get all projects
const getProjectsController = async (req, res) => {
    try{
        const email = req.user.email;
        const type = req.query.type;
        const result = await getProjectsService(email, type);
        res.status(200).json(result);
    }
    catch(error) {
        console.log("Error occured while fetching projects");
        res.status(500).json("Internal server error");
    }
}

//Get overall project data
const getOverallProjectController = async (req, res) => {
    try{
        const { project_ref } = req.query;
        const result = await getClinicalProjectData(project_ref);
        res.status(200).json(result);
    }
    catch(error) {
        console.log("Error occured while fetching project data");
        res.status(500).json("Internal server error");
    }
}

//Check all investigators approved the project or not
const checkInvestigatorApproval = async (req, res) => {
    try{
        const token = req.query.token;
        const tableName = req.query.tableName;
        const result = await approvalService(token, tableName);
        if(result) {
            return res.status(200).json("Approval");
        }
        return res.status(400).json("Error occured");
    }
    catch(error) {
        console.log("Error occured while fetching project data");
        res.status(500).json("Internal server error");
    }
}

//HOD approval controller
const approveHOD = async (req, res) => {
    const { token, tableName } = req.query;

    try {
        const result = await approveHODService(token, tableName);
        res.status(200).json({ message: result });
    } catch (err) {
        console.error('HOD Approval Error:', err.message);
        res.status(500).json({ message: err.message || "Server error" });
    }
};

//Project changes controller
const projectChangesController = async (req, res) => {
    const data = req.body;
    try {
        const result = await projectChanges(data);
        res.status(200).json({ message: result });
    } catch (err) {
        console.error('Project changes Error:', err.message);
        res.status(500).json({ message: err.message || "Server error" });
    }
};


module.exports = {getProjectsController, getOverallProjectController, checkInvestigatorApproval, 
    approveHOD, projectChangesController};