import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Select, MenuItem, Button, FormControl, InputLabel, TextField } from '@mui/material';
import axiosInstance from "../../components/AxiosInstance";

const ReviewerAssignmentGrid = () => {
  const fetchOnce = useRef(false);
  const [projectsData, setProjectsData] = useState({});
  const [assignedReviewers, setAssignedReviewers] = useState({});

  const handleReviewerChange = (index, value) => { // Handle reviewer change
    setAssignedReviewers(prev => ({ ...prev, [index]: value }));
  };

  const handleAssign = async (item, index) => {
    const reviewer = assignedReviewers[index];

    if (!reviewer) {
      alert("Please select a reviewer before assigning.");
      return;
    }

    try {
      const response = await axiosInstance.post("/api/isrc/committee/assignproject", {
        projectData: item,
        reviewer_name: reviewer,
      });

      if (response.status === 200) {
        alert("Reviewer assigned successfully.");
      }
    } catch (error) {
      console.error("Error assigning reviewer:", error);
      alert("Failed to assign reviewer. Please try again.");
    }
  };

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
        <Grid item size={4}><Typography sx={commonTextStyle}>Reviewers Assigned</Typography></Grid>
        <Grid item size={3}><Typography sx={commonTextStyle}>Assign</Typography></Grid>
      </Grid>

      {/* Grid Rows */}
      {Object.keys(projectsData).length > 0 ? projectsData?.projects.map((item, index) => (
        <Grid container spacing={2} alignItems="center" key={index} sx={{ p: 2, border: '0.5px solid #d1cdcd' }}>
          <Grid item size={1}><Typography>{index + 1}</Typography></Grid>
          <Grid item size={4}><Typography>{item.project_title}</Typography></Grid>
          {item.reviewer_name !== "" ? (
            <Grid item size = {4}>
              <TextField fullWidth value = {item.reviewer_name} disabled />
            </Grid>
          ) : (
            <Grid item size={4}>
              <FormControl fullWidth>
                <InputLabel>Select Reviewer</InputLabel>
                <Select key = {index} value={assignedReviewers[index] || ''} label="Select Reviewer" onChange={(e) => handleReviewerChange(index, e.target.value)} >    
                  {projectsData?.reviewers.map((reviewer, ind) => (
                    <MenuItem key={ind} value={reviewer.name}>{reviewer.name}</MenuItem>
                  ))}           
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid item size={3}>
            <Button variant="contained" onClick={() => handleAssign(item, index)} disabled={!assignedReviewers[index]} >Assign </Button>
          </Grid>
        </Grid>
      )): <Box>All projects are assigned to reviewers or No projects exist to assign reviewers</Box>
        }
    </Box>
  );
};

export default ReviewerAssignmentGrid;
