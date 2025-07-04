import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import axiosInstance from "../../components/AxiosInstance";
import { useNavigate } from 'react-router-dom';
import PreviewPopup from "../../Forms/Add_Clinical_Form/Clinical_Preview";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {useProject} from "../../components/ResearchContext";

const ProjectReviewGrid = ({setSelectedForm}) => {
    const [selectedData, setSelectedData] = useState({});
    const [projectsData, setProjectsData] = useState([]);
    const [projectView, setProjectView] = useState({});
    const [openReviewerMessage, setOpenReviewerMessage] = useState(false);
    const [reviewerMessage, setReviewerMessage] = useState("");
    const [openComment, setOpenComment] = useState(false);
    const [comment, setComment] = useState('');
    const [status, setStatus] = useState('');
    const [openPreview, setOpenPreview] = useState(false);
    const fetchOnce = useRef(false);
    const navigate = useNavigate();

    // Context
    const { setProjectId, setnewProject } = useProject();

    const fetchData = async () => {
        if (fetchOnce.current) return;
        try{
            if(!fetchOnce.current) {
                fetchOnce.current = true;
                const response = await axiosInstance.get('/api/isrc/chair/projects');
                setProjectsData(response.data);
            }
        }
        catch(error) {
            console.log("Error occured while fetching projects");
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

    useEffect(() => {
        fetchData();
    }, []);

    const handleSend = async () => {
        if (!comment || !status) {
            alert("Please enter a comment and select status");
            return;
        }
        const data = { 
            project_ref : selectedData?.project_ref,
            comments : comment,
            status : status,
        };
        try{
            const response = await axiosInstance.post('/api/isrc/chair/comment', data);
            alert("Comment added successfully");
        }
        catch(error) {
            alert("comment failed to add");
        }
        setComment('');
        setStatus('');
        setOpenComment(false)
        return ;
    };

    const handleViewReviewerMessage = (item) => {
        setOpenReviewerMessage(true);
        setReviewerMessage(item.comments);
    }

    const handleComment = (item) => {
        setOpenComment(true);
        setSelectedData(item);
    }

    const handleViewIcon = async (item) => { // Handle view icon
        try {
            if(item.form_type === "biomedical-1") {
                setSelectedForm("biomedical-1");
                setProjectId(item.form_number);
                setnewProject(null);
                navigate("/basic/administrative");
            }
            else if(item.form_type === "biomedical-2") {
                setSelectedForm("biomedical-2");
                setProjectId(item.form_number);
                setnewProject(null);
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

    return (
        <Box>
            <Typography sx={{ fontSize: '22px', fontWeight: 'bold', mb: 2 }}>Project Review Grid</Typography>
            <Grid container spacing={2} sx={{ backgroundColor: '#4b1d77', color: 'white', p: 2, borderRadius: '5px 5px 0 0' }}>
                <Grid item size={4}><Typography>Project Title</Typography></Grid>
                <Grid item size={2}><Typography>Reviewer ID</Typography></Grid>
                <Grid item size={2}><Typography>Reviewer Name</Typography></Grid>
                <Grid item size={2}><Typography>Reviewer Comments</Typography></Grid>
                <Grid item size={1}><Typography>Comments</Typography></Grid>
                <Grid item size={1}><Typography>View</Typography></Grid>
            </Grid>
            {projectsData.map((proj, idx) => (
                <Grid container spacing={2} key={idx} alignItems="center" sx={{ borderBottom: '1px solid #ccc', p: 2 }}>
                    <Grid item size={4}><Typography>{proj.project_title}</Typography></Grid>
                    <Grid item size={2}><Typography>{proj.reviewer_id}</Typography></Grid>
                    <Grid item size={2}><Typography>{proj.reviewer_name}</Typography></Grid>
                    <Grid item size={2}>
                        <IconButton onClick = {() => handleViewReviewerMessage(proj)}>
                            <CommentIcon sx={{ color: "rebeccapurple" }} />
                        </IconButton>
                    </Grid>
                    <Grid item size={1}>
                        <IconButton onClick = {() => handleComment(proj)}>
                            <CommentIcon sx={{ color: "rebeccapurple" }} />
                        </IconButton>
                    </Grid>
                    <Grid item size={1} sx = {{display : "flex", gap : "25px", alignItems : "center"}}>
                        {proj.form_type !== "biomedical-1" &&  proj.form_type !== "biomedical-2" && (
                            <IconButton onClick = {() => handleViewIcon(proj)}>
                                <VisibilityIcon sx={{ color: "rebeccapurple" }} />
                            </IconButton>
                        )}
                        <PictureAsPdfIcon sx={{ fontSize: 24, cursor: "pointer", color: 'red' }}
                            onClick={() => window.open(`http://localhost:4000/${proj.project_pdf}.pdf`, "_blank")} />
                        </Grid>
                </Grid>
            ))}

            {/* Dialog */}
            <Dialog open={openReviewerMessage} onClose={() => setOpenReviewerMessage(false)} fullWidth maxWidth="sm">
                <DialogTitle>Reviewer Comment</DialogTitle>
                <DialogContent>
                    <Typography>{reviewerMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReviewerMessage(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openComment} onClose={() => setOpenComment(false)} fullWidth maxWidth="sm">
                <DialogTitle>Enter Comment</DialogTitle>
                <DialogContent>
                    <TextField fullWidth multiline rows={4} label="Type Comment" value={comment} onChange={(e) => setComment(e.target.value)} sx={{ my: 2 }} />
                    <RadioGroup row value={status} onChange={(e) => setStatus(e.target.value)} >
                        <FormControlLabel value="approved" control={<Radio />} label="Approved" />
                        <FormControlLabel value="rejected" control={<Radio />} label="Rejected" />
                        <FormControlLabel value="reviewed" control={<Radio />} label="Reviewed" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenComment(false)} color="error">Cancel</Button>
                    <Button onClick={handleSend} variant="contained">Send</Button>
                </DialogActions>
            </Dialog>
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
                }}/>
            )}
            
        </Box>
    );
};

export default ProjectReviewGrid;
