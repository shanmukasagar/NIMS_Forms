const express = require("express");
const { NIECFormDetails} = require("../services/NIECService");

const NIECFormController = async (req, res) => {
    try {
        const formData = req.body;
        const email = req.user.email;
        const tableName = req.query.tableName;
        const result = await NIECFormDetails(formData, email, tableName);
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

module.exports = {NIECFormController};