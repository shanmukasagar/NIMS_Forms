const express = require("express");
const { NIECFormDetails, NIECFormData} = require("../services/NIECService");

const NIECFormController = async (req, res) => {
    try {
        let imageUrl = null; // Optional image
        if (req.files.length > 0) {
            imageUrl = req.files[0].path; // This matches the filename saved in diskStorage
        }
        const formData = req.body;
        const email = req.user.email;
        const tableName = req.query.tableName;
        const result = await NIECFormDetails(formData, email, tableName, imageUrl);
        if (result) {
            return res.status(200).json("Form submitted successfully");
        }
        return res.status(400).json("Error occured while submitting form");
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).json("Internal server error");
    }
}

const getNIECFormData = async (req, res) => {
    try {
        const email = req.user.email;
        const tableName = req.query.tableName;
        const result = await NIECFormData( email, tableName);
        if (result) {
            return res.status(200).json(result);
        }
        return res.status(400).json("Error occured while fetching niec form data");
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).json("Internal server error");
    }
}

module.exports = {NIECFormController, getNIECFormData};