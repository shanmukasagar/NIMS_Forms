import React, {useState, useEffect} from "react";
import { Grid, TextField, Button, Typography } from "@mui/material";

const DeclarationForm = ({ declaration, setDeclaration, isEdit }) => {

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setDeclaration((prev) => ({
      ...prev,
      declarations: { ...prev.declarations, [name]: checked },
    }));
  };

  const handleFieldChange = (e, field) => {
    const { value } = e.target;
    setDeclaration((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatSubmissionDate = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0]; // returns 'yyyy-MM-dd'
  };

  const renderUploadField = (label, nameField, fileField, dateField) => (
    <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
      <Grid item size={4}>
        <TextField
          fullWidth
          label={label}
          name={nameField}
          value={declaration[nameField] || ""}
          onChange={(e) => handleFieldChange(e, nameField)}
        />
      </Grid>
      <Grid item size={4}>
        <TextField fullWidth label="Signature" name={fileField} value={declaration[fileField] || ""}
          onChange={(e) => handleFieldChange(e, fileField)}
        />
      </Grid>
      <Grid item size={4}>
        <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} 
          value={ isEdit ? formatSubmissionDate(declaration[dateField]) : declaration[dateField] || new Date().toISOString().split("T")[0]}
          onChange={(e) => handleFieldChange(e, dateField)} />
      </Grid>
    </Grid>
  );

  const checkboxLabels = [
    "I/We certify that the information provided in this application is complete and correct.",
    "I/We confirm that all investigators have approved the submitted version of proposal / related documents.",
    "I/We confirm that this study will be conducted in accordance with the latest NDCT RULES, ICMR National Ethical Guidelines for Biomedical and Health Research involving Human Participants and other applicable regulatory guidelines.",
    "I/We will comply with all policies and guidelines of the institute and affiliated / collaborating institutions wherever applicable.",
    "I/We will ensure that personnel performing this study are qualified, appropriately trained and will adhere to the provisions of the EC approved protocol.",
    "I/We declare that the expenditure in case of injury related to the study will be taken care of.",
    "I/We agree to inform all trial subject, that the drugs are being used for investigational purposes.",
    "I/we ensure that the requirements relating to obtaining informed consent and ethics committee review and approval specified in the New Drugs and Clinical Trials Rules, 2019 and Good Clinical Practices guidelines are met.",
    "I/We confirm that we shall submit any protocol amendments, serious adverse events report, significant deviations from protocols, regular progress reports and a final report and also participate in any audit of the study if needed.",
    "I/We confirm that we will maintain accurate and complete records of all aspects of the study.",
    "I/We will protect the privacy of participants and assure safety and confidentiality of study data and biological samples.",
    "I/We hereby declare that I / any of the investigators, researchers and / or close relative(s), have no conflict of interest (Financial / Non-Financial) with the sponsor(s) and outcome of study.",
    "If Conflict of interest is present, kindly declare and specify details",
    "I/We declare / confirm that all necessary regulatory approvals will be obtained as per requirements wherever applicable.",
  ];

  return (
    <div>
      {checkboxLabels.map((label, index) => (
        <div key={index} style={{ marginBottom: 8 , display : "flex", flexDirection : "column", gap : "8px"}}>
          <label>
            <input
              type="checkbox"
              name={`checkbox_${index}`}
              checked={declaration.declarations?.[`checkbox_${index}`] || false}
              onChange={handleCheckboxChange}
              style={{ marginRight: 8 }}
            />
            {label}
          </label>
        </div>
      ))}

      <Typography variant="h6" sx={{ mt: 3 }}>
        Signatures
      </Typography>

      {renderUploadField("Name of Principal Investigator", "pi_name", "pi_signature", "pi_date")}
      {renderUploadField("Name of Guide", "guide_name", "guide_signature", "guide_date")}
      {renderUploadField("Name of HOD", "hod_name", "hod_signature", "hod_date")}
      {renderUploadField("Name of Co-investigator 1", "co1_name", "co1_signature", "co1_date")}
      {renderUploadField("Name of Co-investigator 2", "co2_name", "co2_signature", "co2_date")}
    </div>
  );
};

export default React.memo(DeclarationForm);
