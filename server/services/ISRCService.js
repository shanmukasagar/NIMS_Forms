const {connectToMongo, getDB} = require("../models/db");
const {pool} = require("../models/db");

//Reviewer comments
const reviewerComments = async (data) => { 
    try{
        await connectToMongo(); //connect to database
        const reviewersCollection = getDB().collection("Reviewers");
        const result = await reviewersCollection.findOne({project_ref : data.project_ref});
        if(result) {
            const result = await reviewersCollection.updateOne( { project_ref: data.project_ref },
                { $set: { comments: data.comments, status : data.status } }
            );
            return true;
        }
        else{
            const result = await reviewersCollection.insertOne({
                project_id : data.project_id,
                project_ref : data.project_ref,
                project_title : data.project_title,
                reviewer_id : data.reviewer_id,
                emp_code : data.email,
                comments : data.comments,
                status : data.status,
                form_type : data.form_type
            });
            if(result.acknowledged) {
                return true;
            }
        }
        return false;
    }
    catch(error) {
        console.log("Error occured while fetching projects");
        throw error;
    }
}

//Assign Reviewer 
const assignReviewers = async (data) => { 
    try{
        await connectToMongo(); //connect to database
        const projectsCollection = getDB().collection("Projects");
        const result = await projectsCollection.updateOne( { project_ref: data.projectData?.project_ref }, { $set: { reviewer_name: data.reviewer_name } });

        if(result.modifiedCount > 0) {
            return true;
        }
        return false;
    }
    catch(error) {
        console.log("Error occured while assigning reviewers");
        throw error;
    }
}

//Get projects data
const getReviewedProjectsService = async () => { 
    try{
        await connectToMongo(); //connect to database
        const projectsCollection = getDB().collection("Reviewers");
        let filteredObj = {};
        const projectsData = await projectsCollection.find(filteredObj).sort({ created_at: -1 }).toArray();
        return projectsData;
    }
    catch(error) {
        console.log("Error occured while fetching isrc reviewer projects");
        throw error;
    }
}

//Reviewer comments
const chairMemberComments = async (data) => { 
    try{
        await connectToMongo(); //connect to database
        const projectsCollection = getDB().collection("Projects");
        const result = await projectsCollection.updateOne( { project_ref: data.project_ref },
            { $set: { comments: data.comments, status : data.status } }
        );
        if(result.modifiedCount >= 0) {
            return true;
        }
        return false;
    }
    catch(error) {
        console.log("Error occured while fetching projects");
        throw error;
    }
}

module.exports = {reviewerComments, assignReviewers, getReviewedProjectsService, chairMemberComments}