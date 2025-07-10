const {reviewerComments, assignReviewers, getReviewedProjectsService, chairMemberComments} = require("../services/ISRCService");

//Get overall project data
const ISRCReviewerController = async (req, res) => {
    try{
        const data = req.body;
        const email = req.user.email;
        data.email = email;
        data.type = req.query?.type;
        const result = await reviewerComments(data);
        if(result) {
            return res.status(200).json("comment successfully added");
        }
        return res.status(400).json("comment failed to add");
    }
    catch(error) {
        console.log("Error occured while fetching project data");
        return res.status(500).json("Internal server error");
    }
}

//Assign Reviewer
const assignReviewerController = async (req, res) => {
    try{
        const data = req.body;
        const result = await assignReviewers(data);
        if(result) {
            return res.status(200).json("Reviewer added successfully");
        }
        return res.status(400).json("Reviewer failed to add");
    }
    catch(error) {
        console.log("Error occured while assigning reviewer");
        return res.status(500).json("Internal server error");
    }
}

//Get all ISRC members reviewed projects
const getISRCProjectsController = async (req, res) => {
    try{
        const email = req.user.email;
        const type = req.query?.type;
        const result = await getReviewedProjectsService(type);
        res.status(200).json(result);
    }
    catch(error) {
        console.log("Error occured while fetching reviewed projects");
        res.status(500).json("Internal server error");
    }
}

//add comment to investigator projects
const ISRCChairController = async (req, res) => {
    try{
        const data = req.body;
        const email = req.user.email;
        data.type = req.query?.type;
        data.email = email;
        const result = await chairMemberComments(data);
        if(result) {
            return res.status(200).json("comment successfully added");
        }
        return res.status(400).json("comment failed to add");
    }
    catch(error) {
        console.log("Error occured while fetching project data");
        return res.status(500).json("Internal server error");
    }
}

module.exports = {ISRCReviewerController, assignReviewerController, getISRCProjectsController, ISRCChairController};