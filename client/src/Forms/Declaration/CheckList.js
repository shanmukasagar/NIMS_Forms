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
  const secondFetch = useRef(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [consentData, setConsentData] =  useState([]);
  const [formId, setFormId] = useState(-1);


  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

    //context
  const { projectId } = useProject();

  //Check waiver consent type is ticked or not. If yes not mandatory to upload PIS file
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get("/api/research/waiverconsent/type", { 
  //         params : { formId : projectId }
  //       });
  //       if(Object.keys(response.data).length > 0) {
  //         const consentResult = response.data;
  //         if(consentResult.seeking_waiver_of_consent_type === "Yes") {
  //           setUploads((prevUploads) =>
  //             prevUploads.map((item) =>
  //               item.id === 7 ? { ...item, required: false } : item
  //             )
  //           );
  //         }
  //         else{
  //           const selectedLanguages = consentResult.selectedlanguages;
  //           const newUploadItems = [];
  //           let nextId = uploads.length + 1;

  //           selectedLanguages.forEach((lang) => {
  //             newUploadItems.push(
  //               {
  //                 id: nextId++,
  //                 label: `Participant Information Sheet (PIS) and Informed Consent Form (ICF) - ${lang}`,
  //                 file: null,
  //                 required: true,
  //               },
  //               {
  //                 id: nextId++,
  //                 label: `Translation Certificate - ${lang}`,
  //                 file: null,
  //                 required: true,
  //               }
  //             );
  //           });
  //           setUploads((prevUploads) => [...prevUploads, ...newUploadItems]);
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Fetch error:", err);
  //     }
  //   }
  //   if(!secondFetch.current) {
  //     secondFetch.current = true;
  //     fetchData();
  //   }
  // },[])

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
        const WaiverResponse = await axiosInstance.get("/api/research/waiverconsent/type", { 
          params : { formId : projectId }
        });
        setConsentData(WaiverResponse.data)
        
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"administrative_requirements",// or hardcoded for now
            formId : projectId
          }
        });
        if (response.data.length > 0) {
          const existingUploads = response.data.map((item) => ({
            ...item,
            required: item.file_name ? true : false,
          }));

          setFormId(response.data[0].form_id);
          setUploads(existingUploads); // You probably meant setExistData, not setExistData
          setShowPreview(true);
          setIsEdit(true);
        }
        else {
          if(WaiverResponse.data?.seeking_waiver_of_consent_type === "Yes") {
            setUploads((prevUploads) =>
              prevUploads.map((item) =>
                item.id === 7 ? { ...item, required: false } : item
              )
            );
          }
          else{
            const selectedLanguages = WaiverResponse.data?.selectedlanguages;
            const newUploadItems = [];
            let nextId = uploads.length + 1;

            selectedLanguages.forEach((lang) => {
              newUploadItems.push(
                {
                  id: nextId++,
                  label: `Participant Information Sheet (PIS) and Informed Consent Form (ICF) - ${lang}`,
                  file: null,
                  required: true,
                },
                {
                  id: nextId++,
                  label: `Translation Certificate - ${lang}`,
                  file: null,
                  required: true,
                }
              );
            });
            setUploads((prevUploads) => [...prevUploads, ...newUploadItems]);
          }
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
    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      e.target.value = null; // Reset the input
      return;
    }
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

  const handleEdit = async () => {
    setShowPreview(false);

    // Get the default uploads (with id or label_id <= 11)
    const defaultUploads = uploads.filter(item =>
      Number(item.id) <= 11 || Number(item.label_id) <= 11
    );

    if (consentData.seeking_waiver_of_consent_type === "Yes") {
      // If waiver is 'Yes', set item with id or label_id 7 to not required
      const updatedUploads = defaultUploads.map(item =>
        Number(item.id) === 7 || Number(item.label_id) === 7
          ? { ...item, required: false }
          : item
      );
      setUploads(updatedUploads);
    } else {
      // If waiver is 'No', append selected language-specific items
      const selectedLanguages = consentData.selectedlanguages || [];
      let nextId = defaultUploads.length + 1;

      const newUploadItems = selectedLanguages.flatMap(lang => ([
        {
          id: nextId++,
          label: `Participant Information Sheet (PIS) and Informed Consent Form (ICF) - ${lang}`,
          file: null,
          required: true,
        },
        {
          id: nextId++,
          label: `Translation Certificate - ${lang}`,
          file: null,
          required: true,
        }
      ]));

      setUploads([...defaultUploads, ...newUploadItems]);
    }
  };

  const handleSubmit = async () => {
    let missingRequired = false;
    if(!isEdit) {
      missingRequired = uploads.find(item => item.required && !item.file);
    }
    else{
      missingRequired = uploads.find(item => item.required && (!item?.file_name && !item.file) );
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
      setIsSubmitting(true); // Show loading
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
    finally {
      setIsSubmitting(false); // Hide loading
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
            <Button variant="outlined" color="secondary" onClick={handleEdit}>Edit</Button>
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default UploadChecklist;
