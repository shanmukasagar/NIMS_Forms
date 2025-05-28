const {addClinicalService, getClinicalService, getProjectsService, updateClinicalService} = require("../services/AddClinicalService");

const addClinical = async(req, res) => {
    const formData = req.body;
    formData.email = req.user.email;
    const isEdit = req.query.isEdit === 'true';
    try{
        let result;
        if (isEdit) {
            result = await updateClinicalService(formData);
        }
        else{
            result = await addClinicalService(formData);
        }
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

const clinicalList = async(req, res) => {
    const email = req.user.email;
    try{
        const result = await getClinicalService(email);
        return res.status(200).json(result);
    }
    catch(error) {
        console.log("Error occured while fetching clinical trails", error.message);
        res.status(500).json("Internal Server Error");
    }
}

const getProjects = async(req, res) => { //Get all projects
    const emp_code = "12345";
    try{
        const result = await getProjectsService(emp_code);
        return res.status(200).json(result);
    }
    catch(error) {
        console.log("Error occured while fetching projects", error.message);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = {addClinical, clinicalList, getProjects};