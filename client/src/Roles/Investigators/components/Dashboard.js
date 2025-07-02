import React, {useState, useEffect, useRef} from 'react';
import {Box, Typography, Button, TextField, } from "@mui/material";
import "../../../styles/Investigators/dashboard.css";
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../components/AxiosInstance";
import { Visibility, Edit, Comment } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, IconButton, Tooltip, DialogActions} from '@mui/material';
import PreviewPopup from "../../../Forms/Add_Clinical_Form/Clinical_Preview";
import AddClinicalTrails from '../../../components/AddClinicalTrails';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const Dashboard = ({user, setSelectedForm}) => {
    const [projectsData, setProjectsData] = useState([]);
    const [selectedComment, setSelectedComment] = useState('');
    const [open, setOpen] = useState(false);
    const [projectView, setProjectView] = useState({});
    const [openPreview, setOpenPreview] = useState(false);
    const [openChangesComments, setOpenChangescomments] = useState(false);
    const [projectChanges, setProjectChanges] = useState('');
    const [projectId, setProjectId] = useState('');

    const navigate = useNavigate();
    const fetchOnce = useRef(false);

    const statusColors = { pending : "orange", reviewed : "blue", approved : "green", rejected : "red"};

    useEffect(() => {
        const handleGetProjects = async () => {
            try{
                if(!fetchOnce.current) {
                    fetchOnce.current = true;
                    const response = await axiosInstance.get('/api/investigator/projects', {params : {type : "investigators"}});
                    setProjectsData(response.data);
                }
            }
            catch(error) {
                console.log("Error occured while fetching projects");
            }
        }
        handleGetProjects();
    },[])

    const handleNewProject = () => { //Handle new project
        navigate("/investigator/studylist");
    }

    const handleOpenComment = (comment) => { //Open comment
        setSelectedComment(comment || 'No comments available.');
        setOpen(true);
    };

    const handleClose = () => setOpen(false); //Close comment

    const formatSubmitDate = (isoString) => { //Format submission date
        const date = new Date(isoString);
        const formattedDate = date.toLocaleDateString('en-GB'); // e.g., 24/05/2025
        const formattedTime = date.toLocaleTimeString('en-GB'); // e.g., 09:12:00
        return `${formattedDate} ${formattedTime}`;
    };

    const handleViewIcon = async (item) => { // Handle view icon
        try {
            if(item.form_type === "biomedical-1") {
                setSelectedForm("biomedical-1");
                navigate("/basic/administrative")
            }
            else if(item.form_type === "biomedical-2") {
                setSelectedForm("biomedical-2");
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

    const handleEditIcon = async (item) => { // Handle Edit icon
        if(item.comments === "") {
            alert("Editing is only allowed when comments are provided.");
            return;
        }
        else{
            try {
                if(item.form_type === "biomedical-1") {
                    setSelectedForm("biomedical-1");
                    navigate("/basic/administrative")
                }
                else if(item.form_type === "biomedical-2") {
                    setSelectedForm("biomedical-2");
                    navigate("/basic/administrative")
                }
                else{
                    const result = await handleGetProjectDetails(item.project_ref);
                    setProjectView(result);
                    const initialData = {
                        administration: result?.administration,
                        researchers: result?.researchers,
                        participants: result?.participants,
                        benefits: result?.benefits,
                        paymentState: result?.paymentState,
                        storage: result?.storage,
                        additional: result?.additional,
                        checkListData: result?.checkListData,
                        submittedFormId : result?.administration?.form_id || "",
                        investigatorsCount: result?.investigatorsCount,
                        fundingData: result?.fundingData,
                        overviewResearch: result?.overviewResearch,
                        methodologyData: result?.methodologyData,
                        consentData: result?.consentData,
                        declaration: result?.declaration,
                        funding_FormData : result?.fundingDetails
                    }
                    navigate("/addclinicaltrails", { state: { initialData: initialData, user : user } });
                }
            } catch (error) {
                console.log("Error occurred while fetching project data", error.message);
            }
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

    // Handle investigator changes comments
    const handlePIComments = async (item) => {
        setOpenChangescomments(true);
        setProjectId(item.project_ref)
        setProjectChanges('');
    }

    // Send principal investigator project changes
    const handleChangesSubmit = async () => {
        if (!projectChanges) {
            alert("Please enter project changes before sending");
            return;
        }
        try{
            const data = {
                projectChanges : projectChanges,
                projectId : projectId
            }
            const response = await axiosInstance.post('/api/investigator/changes', data);
            alert(response?.data?.message);
        }
        catch(error) {
            alert("project changes failed to send");
        }
        setOpenChangescomments(false);
        return ;
    };

    return (
        <React.Fragment>
            <Box className = "dashboard_main">
                <Box className = "header_main">
                    <Typography className = "page_title">Investigators</Typography>
                    <Button className = "button_style" onClick = {handleNewProject}>New Project Submission</Button>
                </Box>
                <Box>
                    <Grid container spacing={3} style={{ backgroundColor: '#4b1d77', color: 'white', padding: "15px", borderRadius: "5px 5px 0px 0px" }}>
                        <Grid item size={4}><Typography sx={{ fontSize: "18px" }}>Study Title</Typography></Grid>
                        <Grid item size={2}><Typography sx={{ fontSize: "18px" }}>Change Log</Typography></Grid>
                        <Grid item size={2}><Typography sx={{ fontSize: "18px" }}>Submission Date</Typography></Grid>
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Status</Typography></Grid>
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>View</Typography></Grid>
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Comments</Typography></Grid>
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Edit</Typography></Grid>
                    </Grid>
                    <Grid container spacing={3} style={{ backgroundColor: 'white', color: '#4b1d77', padding: "15px", borderRadius: "5px 5px 0px 0px" }}>
                        {projectsData.length > 0 ? projectsData.map((item, index) => (
                            <React.Fragment key = {index}>
                                <Grid item size={4}><Typography sx={{ fontSize: "18px" }}>{item.project_title}</Typography></Grid>
                                <Grid item size={2}>
                                    <Comment sx={{ fontSize: 24, cursor: "pointer" }}  onClick={() => handlePIComments(item)}/>
                                </Grid>
                                <Grid item size={2}><Typography sx={{ fontSize: "18px" }}>{formatSubmitDate(item.sub_date)}</Typography></Grid>
                                <Grid item size={1}><Typography sx={{ fontSize: "18px", color : `${statusColors[item.status]}` }}>{item.status}</Typography></Grid>
                                <Grid item size={1} sx = {{display : "flex", gap : "25px"}}>
                                    <Visibility sx={{ fontSize: 24, cursor: "pointer" }} onClick = {() => handleViewIcon(item)} /> 
                                    <PictureAsPdfIcon sx={{ fontSize: 24, cursor: "pointer", color: 'red' }}
                                        onClick={() => window.open(`http://localhost:4000/${item.project_pdf}.pdf`, "_blank")} />
                                </Grid>
                                <Grid item size={1}>
                                    <Comment sx={{ fontSize: 24, cursor: "pointer" }}  onClick={() => handleOpenComment(item.comments)}/>
                                </Grid>
                                <Grid item size={1}> 
                                    <Edit sx={{ fontSize: 24, cursor: "pointer" }} onClick = {() => handleEditIcon(item)} />
                                </Grid>
                            </React.Fragment>
                        )) : <Typography style = {{textAlign : "center", fontSize : "20px", color : "#5a4c4c"}}>No projects to display</Typography>
                        }
                    </Grid>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Comment</DialogTitle>
                <DialogContent><Typography>{selectedComment}</Typography></DialogContent>
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
                    funding_FormData : projectView?.fundingDetails
                }}/>
            )}
            <Dialog open={openChangesComments} onClose={() => setOpenChangescomments(false)} 
                maxWidth={false}
                PaperProps={{
                    sx: { width: '800px', maxWidth: '90%' }
                }}
             fullWidth>
                <DialogTitle>Add Project Changes</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Changes" multiline rows={4} value={projectChanges} onChange={(e) => setProjectChanges(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenChangescomments(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleChangesSubmit}>Send</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default Dashboard;
