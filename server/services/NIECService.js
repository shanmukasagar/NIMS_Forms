const {pool} =require("../models/db");

const NIECFormDetails = async (formData, tableName) => {
    try {
        return true;
    } 
    catch (error) {
        console.log("Failed to insert administration", error.message);
        throw error;
    }  
};

module.exports = {NIECFormDetails};