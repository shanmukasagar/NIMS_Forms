const {addClinicalService} = require("../services/AddClinicalService");

const addClinical = async(req, res) => {
    const formData = req.body;
    try{
        const result = await addClinicalService(formData);
        if(result) {
            res.status(200).json("success");
            return;
        }
        return res.status(400).json("Form submission failed");
    }
    catch(error) {
        res.status(500).json("Internal Server Error");
    }
}

module.exports = {addClinical};