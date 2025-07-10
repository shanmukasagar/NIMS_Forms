const {connectToMongo, getDB} = require("../models/db");
const {pool} = require("../models/db");

//Reviewer comments
const reviewerComments = async (data) => { 
    try{
        await connectToMongo(); //connect to database
        const reviewersCollection = getDB().collection("Reviewers");
        const result = await reviewersCollection.findOne({project_ref : data.project_ref});
        const commonFields = {
            project_title: data.project_title,
            reviewer_id: data.reviewer_id,
            reviewer_name: data.reviewer_name,
            project_pdf: data.project_pdf,
            type : data.type 
        };

        if (result) {
            const updateFields = data.type === "isrc"
                ? {
                    comments: data.comments,
                    status: data.status,
                    type : "isrc",
                    ...commonFields,
                }
                : data.type === "niec" ? {
                    niec_member_comments: data.comments,
                    niec_member_status: data.status,
                    type : "niec",
                    ...commonFields,
                } : {
                    pbac_member_comments: data.comments,
                    pbac_member_status: data.status,
                    type : "pbac",
                    ...commonFields
                };

            await reviewersCollection.updateOne(
                { project_ref: data.project_ref },
                { $set: updateFields }
            );
            return true;
        } 
        else {
            const comments =
                data.type === "isrc" ? { comments: data.comments, status: data.status }
                    : data.type === "niec"
                    ? { niec_member_comments: data.comments, niec_member_status: data.status }
                    : { pbac_member_comments: data.comments, pbac_member_status: data.status };
            const insertData = {
                project_id: data.project_id,
                project_ref: data.project_ref,
                ...commonFields,
                emp_code: data.email,
                ...comments,
                form_type: data.form_type,
                
            };

            const insertResult = await reviewersCollection.insertOne(insertData);
            return insertResult.acknowledged;
        }
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
        let result;
        if(data.type === "pbac") {
            result = await projectsCollection.updateOne( { project_ref: data.projectData?.project_ref }, 
                { $set: { pbac_reviewer_id: data.reviewer_code, pbac_reviewer_name : data.reviewer_name,
                } });
        }
        else if(data.type === "isrc") {
            result = await projectsCollection.updateOne( { project_ref: data.projectData?.project_ref }, 
                { $set: { reviewer_id: data.reviewer_code, reviewer_name : data.reviewer_name,
                } });
        }
        else if(data.type === "niec") {
            result = await projectsCollection.updateOne( { project_ref: data.projectData?.project_ref }, 
                { $set: { niec_reviewer_id: data.reviewer_code, niec_reviewer_name : data.reviewer_name,
                } });
        }

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
const getReviewedProjectsService = async (type) => { 
    try{
        await connectToMongo(); //connect to database
        const ProjectReviewCollection = getDB().collection("Reviewers");
        let filteredObj = {type : type};
        const projectsData = await ProjectReviewCollection.aggregate([
            {
                $match: filteredObj // your filter condition
            },
            {
                $sort: { created_at: -1 }
            },
            {
                $lookup: {
                from: "PDF_Versions",                    // Name of the other collection
                localField: "project_ref",              // Field in ProjectReviewCollection
                foreignField: "project_ref",            // Field in pdf_version
                as: "pdf_info"                          // Output array field
                }
            },
            {
                $addFields: {
                project_pdf_versions: { $arrayElemAt: ["$pdf_info.project_pdf", 0] }
                }
            },
            {
                $project: {
                    pdf_info: 0 // optional: remove the temporary joined array
                }
            }
            ]).toArray();

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
        let result;
        if(data.type === "isrc") {
            result = await projectsCollection.updateOne( { project_ref: data.project_ref },
                { $set: { isrc_inv_comments: data.comments, status : data.status } }
            );
        }
        else if(data.type === "niec") {
            result = await projectsCollection.updateOne( { project_ref: data.project_ref },
                { $set: { niec_inv_comments: data.comments, niec_status : data.status } }
            );
        }
        else if(data.type === "pbac") {
            result = await projectsCollection.updateOne( { project_ref: data.project_ref },
                { $set: { pbac_inv_comments: data.comments, pbac_status : data.status } }
            );
        }
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