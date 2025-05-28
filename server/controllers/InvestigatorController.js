const {getProjectsService, getClinicalProjectData} = require("../services/InvestigatorService");

//Get all projects
const getProjectsController = async (req, res) => {
    try{
        const result = await getProjectsService();
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

module.exports = {getProjectsController, getOverallProjectController};