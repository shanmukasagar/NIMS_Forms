import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Select, MenuItem, Button, FormControl, InputLabel, TextField } from '@mui/material';
import axiosInstance from "../../components/AxiosInstance";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PreviewPopup from "../../Forms/Add_Clinical_Form/Clinical_Preview";
import {useProject} from "../../components/ResearchContext";

const ReviewerAssignmentGrid = ({setSelectedForm}) => {
  const fetchOnce = useRef(false);
  const [projectsData, setProjectsData] = useState({});
  const [assignedReviewers, setAssignedReviewers] = useState({});
  const [projectView, setProjectView] = useState({});
  const [openPreview, setOpenPreview] = useState(false);

  const navigate = useNavigate();

  // Context
  const { setProjectId, setnewProject } = useProject();

  const handleReviewerChange = (index, value) => { // Handle reviewer change
    setAssignedReviewers(prev => ({ ...prev, [index]: value }));
  };

  const handleAssign = async (item, index) => {
    const reviewer_code = assignedReviewers[index];
    let reviewer_name;
    if (projectsData?.reviewers?.length > 0) {
      const reviewer = projectsData.reviewers.find( (item) => item.emp_code === reviewer_code );
      if (reviewer) {
        reviewer_name = reviewer.name;
      }
    }
    if (!reviewer_code) {
      alert("Please select a reviewer before assigning.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/isrc/committee/assignproject", {
        projectData: item,
        reviewer_code: reviewer_code,
        reviewer_name : reviewer_name
      });

      if (response.status === 200) {
        alert("Reviewer assigned successfully.");
      }
    } catch (error) {
      console.error("Error assigning reviewer:", error);
      alert("Failed to assign reviewer. Please try again.");
    }
  };

  const handleViewIcon = async (item) => { // Handle view icon
        try {
            if(item.form_type === "biomedical-1") {
                setSelectedForm("biomedical-1");
                setProjectId(item.form_number);
                setnewProject(null);
                navigate("/basic/administrative")
            }
            else if(item.form_type === "biomedical-2") {
                setSelectedForm("biomedical-2");
                setProjectId(item.form_number);
                setnewProject(null);
                navigate("/basic/administrative")
            }
            else{
                const result = await handleGetProjectDetails(item.project_ref);
                setProjectView(result);
                setOpenPreview(true);
            }
        } catch (error) {
            console.log("Error occurred while fetching project data", error.message);
        }
  };

  const handleGetProjectDetails = async (project_ref) => { //Get project details
      try {
          const response = await axiosInstance.get("/api/investigator/projectdata", {
              params: { project_ref }  // <-- add `params`
          });
          return response.data;
          
      } catch (error) {
          console.log("Error occurred while fetching project data", error.message);
      }
  }

  const commonTextStyle = { fontSize: '16px' };

  const fetchData = async () => { //Get all projects
    if (fetchOnce.current) return;
    try{
      if(!fetchOnce.current) {
        fetchOnce.current = true;
        const response = await axiosInstance.get('/api/investigator/projects', {params : {type : "isrc_secretary"}});
        setProjectsData(response.data);
      }
    }
    catch(error) {
        console.log("Error occured while fetching projects");
    }
  };

  useEffect(() => {
      fetchData();
    }, []);

  return (
    <Box>
      <Typography sx={{ fontSize: '22px', fontWeight: 'bold', mb: 2 }}>
        Reviewer Assignment
      </Typography>

      {/* Grid Header */}
      <Grid container spacing={2} sx={{ backgroundColor: '#4b1d77', color: 'white', p: 2, borderRadius: '5px 5px 0 0' }}>
        <Grid item size={1}><Typography sx={commonTextStyle}>S.No</Typography></Grid>
        <Grid item size={4}><Typography sx={commonTextStyle}>Project Title</Typography></Grid>
        <Grid item size={2}><Typography sx={commonTextStyle}>View</Typography></Grid>
        <Grid item size={3}><Typography sx={commonTextStyle}>Reviewers Assigned</Typography></Grid>
        <Grid item size={2}><Typography sx={commonTextStyle}>Assign</Typography></Grid>
      </Grid>

      {/* Grid Rows */}
      {Object.keys(projectsData).length > 0 ? projectsData?.projects.map((item, index) => (
        <Grid container spacing={2} alignItems="center" key={index} sx={{ p: 2, border: '0.5px solid #d1cdcd' }}>
          <Grid item size={1}><Typography>{index + 1}</Typography></Grid>
          <Grid item size={4}><Typography>{item.project_title}</Typography></Grid>
          <Grid item size={1} sx = {{display : "flex", gap : "25px"}}>
            {item.form_type !== "biomedical-1" &&  item.form_type !== "biomedical-2" && (
              <Visibility sx={{ fontSize: 24, cursor: "pointer" }} onClick = {() => handleViewIcon(item)} /> 
            )}
            <PictureAsPdfIcon sx={{ fontSize: 24, cursor: "pointer", color: 'red' }}
                  onClick={() => window.open(`http://localhost:4000/${item.project_pdf}.pdf`, "_blank")} />
          </Grid>
          {item.reviewer_name !== "" ? (
            <Grid item size = {3}>
              <TextField fullWidth value = {item.reviewer_name} disabled />
            </Grid>
          ) : (
            <Grid item size={3}>
              <FormControl fullWidth>
                <InputLabel>Select Reviewer</InputLabel>
                <Select key = {index} value={assignedReviewers[index] || ''} label="Select Reviewer" onChange={(e) => handleReviewerChange(index, e.target.value)} >    
                  {projectsData?.reviewers.map((reviewer, ind) => (
                    <MenuItem key={ind} value={reviewer.emp_code}>{reviewer.name}</MenuItem>
                  ))}           
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item size={2}>
            <Button variant="contained" onClick={() => handleAssign(item, index)} disabled={!assignedReviewers[index]} >Assign </Button>
          </Grid>
        </Grid>
      )): <Box>All projects are assigned to reviewers or No projects exist to assign reviewers</Box>
        }

      {Object.keys(projectView).length > 0 && (
        <PreviewPopup open={openPreview} onClose={() => setOpenPreview(false)}
            formData={{
            administration: projectView?.administration,
            researchers: projectView?.researchers,
            participants: projectView?.participants,
            benefits: projectView?.benefits,
            paymentState: projectView?.paymentState,
            storage: projectView?.storage,
            additional: projectView?.additional,
            checkListData: projectView?.checkListData,
            investigatorsCount: projectView.investigatorsCount,
            fundingData: projectView.fundingData,
            overviewResearch: projectView.overviewResearch,
            methodologyData: projectView.methodologyData,
            consentData: projectView.consentData,
            declaration: projectView.declaration,
            funding_FormData : projectView.fundingDetails
        }}/>
        )}
    </Box>
  );
};

export default ReviewerAssignmentGrid;
