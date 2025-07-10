import React, { useState, useEffect, useRef } from 'react';
import {Grid, Typography, IconButton, Paper, Box, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import PreviewPopup from "../../Forms/Add_Clinical_Form/Clinical_Preview";
import axiosInstance from "../../components/AxiosInstance";
import { useNavigate } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const ISRC_Member = ({setSelectedForm}) => {
  const fetchOnce = useRef(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [projectsData, setProjectsData] = useState([]);
  const [projectView, setProjectView] = useState({});
  const [changes, setChanges] = useState({projectChanges : [], open : false});

  const navigate = useNavigate();

  const commonTextStyle = { fontSize: "18px" };

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

  const handleViewIcon = async (item) => { // Handle view icon
    try {
      if(item.form_type === "biomedical-1") {
          setSelectedForm("biomedical-1");
          navigate("/basic/administrative");
      }
      else if(item.form_type === "biomedical-2") {
          setSelectedForm("biomedical-2");
          navigate("/basic/administrative");
      }
      else{
          const result = await handleGetProjectDetails(item.project_ref);
          setSelectedForm("");
          setProjectView(result);
          setOpenPreview(true);
      }
    } catch (error) {
        console.log("Error occurred while fetching project data", error.message);
    }
  };

  //Open project changes
  const openProjectChanges = (item) => {
    setChanges((prev) => ({
    ...prev, projectChanges: item?.inv_isrc_comments || '', open: true,
    }));
  }

  //Close project changes
  const closeProjectChanges = () => {
    setChanges((prev) => ({
    ...prev, projectChanges: [], open: false,
    }));
  }


  const handleCommentClick = (item) => {
    setSelectedData(item);
    setComment('');
    setStatus('');
    setCommentDialogOpen(true);
  };

  const handleCommentSubmit = async () => {
    if (!comment || !status) {
        alert("Please enter a comment and select status");
        return;
    }
    const data = {
      project_id : selectedData?.project_id,
      project_ref : selectedData?.project_ref,
      project_title : selectedData?.project_title,
      reviewer_id : selectedData?.reviewer_id,
      reviewer_name : selectedData?.reviewer_name,
      comments : comment,
      status : status,
      form_type : selectedData?.form_type,
      project_pdf : selectedData?.project_pdf,
    };
    try{
      const response = await axiosInstance.post('/api/isrc/committee/comment', data);
      alert("Comment added successfully");
    }
    catch(error) {
      alert("comment failed to add");
    }
    setCommentDialogOpen(false);
    return ;
  };

  const fetchData = async () => {
    if (fetchOnce.current) return;
    try{
      if(!fetchOnce.current) {
        fetchOnce.current = true;
        const response = await axiosInstance.get('/api/investigator/projects', {params : {type : "isrc_member"}});
        setProjectsData(response.data);
      }
    }
    catch(error) {
        console.log("Error occured while fetching projects");
    }
  };

  const formatSubmitDate = (isoString) => { //Format submission date
      const date = new Date(isoString);
      const formattedDate = date.toLocaleDateString('en-GB'); // e.g., 24/05/2025
      const formattedTime = date.toLocaleTimeString('en-GB'); // e.g., 09:12:00
      return `${formattedDate}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
      <Typography sx={{ fontSize: "25px", fontWeight: 500 }}>Projects List</Typography>

      <Box>
        {/* Header */}
        <Grid container spacing={2} sx={{ backgroundColor: '#4b1d77', color: 'white', p: 2, borderRadius: "5px 5px 0 0" }}>
          <Grid item size={3}><Typography sx={commonTextStyle}>Study Title</Typography></Grid>
          <Grid item size={2}><Typography sx={commonTextStyle}>Submission Date</Typography></Grid>
          <Grid item size={2}><Typography sx={commonTextStyle}>Investigator</Typography></Grid>
          <Grid item size={1}><Typography sx={commonTextStyle}>changes</Typography></Grid>
          <Grid item size={1}><Typography sx={commonTextStyle}>Status</Typography></Grid>
          <Grid item size={2}><Typography sx={commonTextStyle}>View</Typography></Grid>
          <Grid item size={1}><Typography sx={commonTextStyle}>Comment</Typography></Grid>
        </Grid>


        {/* Data Rows */}
        {projectsData.length > 0 ? (
          projectsData.map((item, index) => (
            <Paper key={index} elevation={2}>
              <Grid container spacing={2} alignItems="center" sx={{ p: 1.2, border: "0.5px solid #e3dddd" }}>
                <Grid item size={3}><Typography sx={commonTextStyle}>{item.project_title || ""}</Typography></Grid>
                <Grid item size={2}><Typography sx={commonTextStyle}>{formatSubmitDate(item.sub_date) || ""}</Typography></Grid>
                <Grid item size={2}><Typography sx={commonTextStyle}>{item.investigator_name || ""}</Typography></Grid>
                <Grid item size={1}>
                  <CommentIcon sx={{ fontSize: 24, cursor: "pointer" }}  onClick={() => openProjectChanges(item)}/>
                </Grid>
                <Grid item size={1}><Typography sx={commonTextStyle}>{item.status || ""}</Typography></Grid>
                <Grid item size={2} sx = {{display : "flex", gap : "25px", alignItems : "center"}}>
                  {item.form_type !== "biomedical-1" &&  item.form_type !== "biomedical-2" && (
                    <IconButton onClick={() => handleViewIcon(item)}>
                      <VisibilityIcon sx={{ color: "rebeccapurple" }} />
                    </IconButton>
                  )}
                  <PictureAsPdfIcon sx={{ fontSize: 24, cursor: "pointer", color: 'red' }}
                      onClick={() => window.open(`http://localhost:4000/${item.project_pdf}.pdf`, "_blank")} />
                </Grid>
                <Grid item size={1}>
                  <IconButton onClick={() => handleCommentClick(item)}>
                    <CommentIcon sx={{ color: "rebeccapurple" }} />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : (
          <Typography sx={{ ...commonTextStyle, fontWeight: 600, textAlign: "center", py: 2 }}>
            Data does not exist for the user
          </Typography>
        )}

        {/* Preview Popup */}
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
              funding_FormData : projectView?.fundingDetails
          }}/>
        )}

        {/* Comment Dialog */}
        <Dialog open={commentDialogOpen} onClose={() => setCommentDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Comment" multiline rows={4} value={comment} onChange={(e) => setComment(e.target.value)}
              fullWidth
            />
            <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)}>
              <FormControlLabel value="approved" control={<Radio />} label="Approved" />
              <FormControlLabel value="rejected" control={<Radio />} label="Rejected" />
              <FormControlLabel value="reviewed" control={<Radio />} label="Review" />
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCommentSubmit}>Send</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={changes.open} onClose={closeProjectChanges} maxWidth="md" fullWidth>
          <DialogTitle>Project Changes</DialogTitle>
          <DialogContent>
            {changes.projectChanges.length === 0 ? (
              <Typography>No changes available.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Change</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {changes.projectChanges.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.change}</TableCell>
                      <TableCell>{item.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default React.memo(ISRC_Member);
