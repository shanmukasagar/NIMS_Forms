const {addClinicalService, getClinicalService, getProjectsService, updateClinicalService} = require("../services/AddClinicalService");
const generateConsentPdf = require("../config/PdfGenerator");

//Add clinical trail
const addClinical = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    data.email = req.user.email;
    const isEdit = req.query.isEdit === 'true';

    // 1. Map uploaded files by fieldname for easy access
    const uploadedFilesMap = {};
    req.files.forEach(file => {
      uploadedFilesMap[file.fieldname] = file;
    });

    // 2. Parse all labels from form body, even if file is not present
    const checklist = [];

    for (const key in req.body) {
      if (key.startsWith('label_')) {
        const id = key.replace('label_', '');
        const label = req.body[key];
        const file = uploadedFilesMap[`file_${id}`];
        const existingFile = req.body[`existingFile_${id}`]; 

        checklist.push({
          label_id: parseInt(id),
          label,
          file_name: file 
            ? file.filename // new file uploaded
            : isEdit
            ? existingFile || null // use existing file if edit and not replaced
            : null, // new entry, no file
          email: data.email,
        });
      }
    }

    // 3. Assign full checklist (including those without files)
    data.checklist = checklist;
    const result = (isEdit)? await updateClinicalService(data) : await addClinicalService(data);
    if (result) {
      const fileName = `project_clinical_${Date.now()}`;
      const pdfPath = await generateConsentPdf(data, fileName);
      return res.status(200).json("success");
    } 
    res.status(400).json("Form submission failed");
  } catch (error) {
    console.error("Submission Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



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