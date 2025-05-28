import React, {useState, useEffect, useRef} from 'react';
import {Box, Typography, Button} from "@mui/material";
import "../../../styles/Investigators/dashboard.css";
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../components/AxiosInstance";
import { Visibility, Edit, Comment } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, IconButton, Tooltip} from '@mui/material';
import PreviewPopup from "../../../Forms/Add_Clinical_Form/Clinical_Preview";
import AddClinicalTrails from '../../../components/AddClinicalTrails';

const Dashboard = ({user}) => {
    const [projectsData, setProjectsData] = useState([]);
    const [selectedComment, setSelectedComment] = useState('');
    const [open, setOpen] = useState(false);
    const [projectView, setProjectView] = useState({});
    const [openPreview, setOpenPreview] = useState(false);
    const [edit, setEdit] = useState(false);


    const navigate = useNavigate();
    const fetchOnce = useRef(false);

    useEffect(() => {
        const handleGetProjects = async () => {
            if(!fetchOnce.current) {
                fetchOnce.current = true;
                const response = await axiosInstance.get('/api/investigator/projects');
                setProjectsData(response.data);
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

    const handleViewIcon = async (project_ref) => { // Handle view icon
        try {
            const result = await handleGetProjectDetails(project_ref);
            setProjectView(result);
            setOpenPreview(true);
        } catch (error) {
            console.log("Error occurred while fetching project data", error.message);
        }
    };

    const handleEditIcon = async (project_ref) => { // Handle Edit icon
        try {
            const result = await handleGetProjectDetails(project_ref);
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
            }
            navigate("/addclinicaltrails", { state: { initialData: initialData, user : user } });
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

    return (
        <React.Fragment>
            <Box className = "dashboard_main">
                <Box className = "header_main">
                    <Typography className = "page_title">Investigators</Typography>
                    <Button className = "button_style" onClick = {handleNewProject}>New Project Submission</Button>
                </Box>
                <Box>
                    <Grid container spacing={3} style={{ backgroundColor: '#4b1d77', color: 'white', padding: "15px", borderRadius: "5px 5px 0px 0px" }}>
                        <Grid item size={5}><Typography sx={{ fontSize: "18px" }}>Study Title</Typography></Grid>
                        <Grid item size={2}><Typography sx={{ fontSize: "18px" }}>Submission Date</Typography></Grid>
                        <Grid item size={2}><Typography sx={{ fontSize: "18px" }}>Status</Typography></Grid>
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>View</Typography></Grid>
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Comments</Typography></Grid>
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Edit</Typography></Grid>
                    </Grid>
                    <Grid container spacing={3} style={{ backgroundColor: 'white', color: '#4b1d77', padding: "15px", borderRadius: "5px 5px 0px 0px" }}>
                        {projectsData.length > 0 && projectsData.map((item, key) => (
                            <React.Fragment>
                                <Grid item size={5}><Typography sx={{ fontSize: "18px" }}>{item.project_title}</Typography></Grid>
                                <Grid item size={2}><Typography sx={{ fontSize: "18px" }}>{formatSubmitDate(item.sub_date)}</Typography></Grid>
                                <Grid item size={2}><Typography sx={{ fontSize: "18px" }}>{item.status}</Typography></Grid>
                                <Grid item size={1}>
                                    <Visibility sx={{ fontSize: 24, cursor: "pointer" }} onClick = {() => handleViewIcon(item.project_ref)} /> 
                                </Grid>
                                <Grid item size={1}>
                                    <Comment sx={{ fontSize: 24, cursor: "pointer" }}  onClick={() => handleOpenComment(item.comments)}/>
                                </Grid>
                                <Grid item size={1}> 
                                    <Edit sx={{ fontSize: 24, cursor: "pointer" }} onClick = {() => handleEditIcon(item.project_ref)} />
                                </Grid>
                            </React.Fragment>
                        ))}
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
                    checkListData: projectView?.checkListData
                }}/>
            )}
        </React.Fragment>
    )
}

export default Dashboard;
