import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Tooltip, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useProject} from "../../components/ResearchContext";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import axiosInstance from "../../components/AxiosInstance.js";

const UploadChecklist = ({selectedForm}) => {
  const [uploads, setUploads] = useState([
    { id: 1, label: "Cover letter enlisting all documents enclosed", file: null, required: true },
    { id: 2, label: "Brief CV of all Investigators (updated, signed and dated)", file: null, required: true },
    { id: 3, label: "Good Clinical Practice (GCP) training of investigators in last 3 years", file: null, required: true },
    { id: 4, label: "EC clearance of other centers", file: null, required: false },
    { id: 5, label: "MOU between collaborating partners", file: null, required: false },
    { id: 6, label: "Copy of the detailed protocol (clearly identified numbered and dated) and synopsis", file: null, required: true },
    { id: 7, label: "Participant Information Sheet (PIS) and Informed Consent Form (ICF)", file: null, required: true },
    { id: 8, label: "Assent form for minors (12-18 years)", file: null, required: false },
    
    { id: 9, label: "CRF / Interview guides / Focused Group Discussions (English and translated)", file: null, required: true },
    { id: 10, label: "Advertisement / material to recruit participants", file: null, required: false },
    { id: 11, label: "Insurance policy / participant coverage details", file: null, required: false }
  ]);

  
  const fetchOnce = useRef(false);
  const initialFetch = useRef(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [submittedData, setSubmittedData] =  useState([]);
  const [formId, setFormId] = useState(-1);
  const navigate = useNavigate();

    //context
  const { projectId } = useProject();

  useEffect(() => {
    if(!initialFetch.current) {
      initialFetch.current = true;
      if (!projectId) { // Redirect to dashboard if project id is not there filled
        alert("Administrative Details must be filled first. The project reference is missing due to page refresh. To continue editing, please use the 'Edit' button from the dashboard.");
        navigate('/investigator');
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"administrative_requirements",// or hardcoded for now
            formId : projectId
          }
        });
        if (response.data.length > 0) {
          const existingUploads = [];
          for(let item of uploads) {
            for(let existingItem of response.data) {
              if(Number(item.id) === Number(existingItem.label_id)) {
                existingUploads.push({...existingItem, required : item.required});
                break;
              }
            }
          }

          setFormId(response.data[0].form_id);
          setUploads(existingUploads); // You probably meant setExistData, not setExistData
          setShowPreview(true);
          setIsEdit(true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    if(!fetchOnce.current) {
      fetchOnce.current = true;
      fetchData();
    }
  },[])

  const handleFileChange = (e, id) => {
    const file = e.target.files?.[0] || null;
    if(isEdit) {
      setUploads(prev =>
        prev.map(item =>
          Number(item.label_id) === Number(id) ? { ...item, file } : item
        )
      );
    }
    else{
      setUploads(prev =>
          prev.map(item =>
            item.id === id ? { ...item, file } : item
          )
    );
    }
  };


  const handleSubmit = async () => {
    let missingRequired = false;
    if(!isEdit) {
      missingRequired = uploads.find(item => item.required && !item.file);
    }

    if (missingRequired) {
      alert(`Please upload document for: "${missingRequired.label}"`);
      return;
    }
    const formData = new FormData();
    // Simulate backend submission
    uploads.forEach(item => {
      const id = isEdit ? Number(item.label_id) : item.id;
      const label = isEdit ? item.label_name : item.label;

      // Append the label name to the form data
      formData.append(`label_name_${id}`, label || "");

      // Append the file only if a new one is present
      if (item.file) {
        formData.append(`file_${id}`, item.file);
      } else if (isEdit && item.file_name) {
        // Optionally include the existing filename if editing and no new file
        formData.append(`existingFile_${id}`, item.file_name);
      }
    });


    try {
      const res = await axiosInstance.post("/api/research/administrative_requirements", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: {
          isEdit: isEdit,
          formId: isEdit ? formId : projectId,
          selectedForm : selectedForm

        }
      });
      console.log("Upload response:", res.data);
      alert("checklist form added successfully");
      navigate("/basic/administrative");
      return;
    } catch (err) {
      console.error("Upload failed:", err);
      alert("checklist form failed");
      return;
    }
  };

  return (
    <div>
      {!showPreview ? (
        <>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, color: '#8b4fc1' }}>
            ADMINISTRATIVE REQUIREMENTS
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {uploads.map((item, index) => (
              <Box key={item.id} sx={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                <Typography sx={{ flex: 1, maxWidth: "700px" }}>{item.label || item.label_name}
                  {item.required && <span style={{ color: 'red' }}> *</span>} </Typography>
                <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, item.label_id || item.id)} required={item.required}
                  style={{
                    padding: "6px 16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: "#f5f5f5"
                  }}
                />
                {item.file ? (
                  <Tooltip title="View uploaded PDF">
                    <IconButton
                      onClick={() => {
                        const fileURL = URL.createObjectURL(item.file);
                        window.open(fileURL, "_blank");
                      }}
                    >
                      <PictureAsPdfIcon color="error" />
                    </IconButton>
                  </Tooltip>
                ) : item.file_name && (
                    <Tooltip title="View uploaded PDF">
                      <IconButton
                        onClick={() => window.open(`http://localhost:4000/media/research/checklist/${item.file_name}`, "_blank")}
                      >
                        <PictureAsPdfIcon color="error" />
                      </IconButton>
                    </Tooltip>
                )}
              </Box>
            ))}
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowPreview(true)}
            sx={{ mt: 3 }}
          >
            Show Preview
          </Button>
        </>
      ) : (
        <Box sx={{ mt: 3, border: "1px solid #ccc", borderRadius: 2, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Checklist Preview</Typography>
          <div style = {{display : "flex", flexDirection : "column", gap : "15px"}}>
            {}
            {uploads.map((item) => (
              <Box
                key={item.id}
                sx={{ display: "flex", alignItems: "center", mb: 1, gap: 5 }}
              >
                <Typography sx={{ flex: 1 }}>{item.label || item.label_name}</Typography>
                {item.file ? (
                  <Tooltip title="View uploaded PDF">
                    <IconButton
                      onClick={() => {
                        const fileURL = URL.createObjectURL(item.file);
                        window.open(fileURL, "_blank");
                      }}
                    >
                      <PictureAsPdfIcon color="error" />
                    </IconButton>
                  </Tooltip>
                ) : item.file_name ? (
                  <Tooltip title="View uploaded PDF">
                    <IconButton
                      onClick={() => window.open(`http://localhost:4000/media/research/checklist/${item.file_name}`, "_blank")}
                    >
                      <PictureAsPdfIcon color="error" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Typography color="text.secondary" fontStyle="italic">
                    Not Uploaded
                  </Typography>
                )}

              </Box>
            ))}
          </div>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button variant="outlined" color="secondary" onClick={() => setShowPreview(false)}>Edit</Button>
            <Button variant="contained" color="success" onClick={handleSubmit}>Submit</Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default UploadChecklist;
