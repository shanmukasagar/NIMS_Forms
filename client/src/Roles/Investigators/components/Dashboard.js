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
import {  Table, TableHead, TableBody, TableRow, TableCell, 
     Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useProject} from "../../../components/ResearchContext";
import { List, ListItem, Link } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from '@mui/icons-material/Info';

const Dashboard = ({user, setSelectedForm}) => {
    const [projectsData, setProjectsData] = useState([]);
    const [selectedComment, setSelectedComment] = useState('');
    const [open, setOpen] = useState(false);
    const [projectView, setProjectView] = useState({});
    const [openPreview, setOpenPreview] = useState(false);
    const [openChangesComments, setOpenChangescomments] = useState(false);
    const [projectId, setProjectRef] = useState('');

    const [projectChanges, setProjectChanges] = useState([{ change: '', description: '' }]);
    const [selectedOption, setSelectedOption] = useState(''); // default option
    const [selectedOrg, setSelectedOrg] = useState('');
    const [selectedProject, setSelectedProject] = useState({});

    const [openProjectStatus, setOpenProjectStatus] = useState(false);
    const [statusSelection, setStatusSelection] = useState('');
    const [projectStatus, setProjectStatus] = useState('');
    const [investigatorsData, setInvestigatorsData] = useState([]);
  

    const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
    const [selectedProjectForVersions, setSelectedProjectForVersions] = useState(null);

    const navigate = useNavigate();
    const fetchOnce = useRef(false);

    // Context
    const { setProjectId, setnewProject } = useProject();

    const statusColors = { pending : "orange", reviewed : "blue", approved : "green", rejected : "red"};

    useEffect(() => {
        const handleGetProjects = async () => {
            try{
                if(!fetchOnce.current) {
                    fetchOnce.current = true;
                    const response = await axiosInstance.get('/api/investigator/projects', 
                        {params : {type : "investigators"}});
                    setProjectsData(response.data);
                }
            }
            catch(error) {
                console.log("Error occured while fetching projects");
            }
        }
        handleGetProjects();
    },[])

    const openPdfVersionDialog = (projectItem) => { //Open pdf dialog
        setSelectedProjectForVersions(projectItem);
        setIsVersionDialogOpen(true);
    };
 
    const closePdfVersionDialog = () => { //Close pdf dialog
        setIsVersionDialogOpen(false);
        setSelectedProjectForVersions(null);
    };

    //Show comments of isrc, niec, pbac
    const handleSelectChange = (event) => {
        setSelectedOrg(event.target.value);
    };

    const handleNewProject = () => { //Handle new project
        navigate("/investigator/studylist");
    }

    const handleOpenComment = (projectItem) => { //Open comment
        setSelectedProject(projectItem);
        setOpen(true);
    };

    const handleOpenStatus = (projectItem) => { //Open project status
        setSelectedProject(projectItem);
        setOpenProjectStatus(true);
    }

    const handleProjectStatusSelection = async (e) => { //Handle project status
        const selection = e.target.value;
        if(selection === "Investigators") {
            const response = await axiosInstance.get("/api/investigator/approvedstatus", {
                params: {
                    tableName: selectedProject.form_type === "Principal/CoInvestigator"
                    ? "clinical_investigators"
                    : "investigatorss",
                    formId: selectedProject.form_number,
                },
            });
            setInvestigatorsData(response.data);
        } 
        else if(selection === "PBAC") {
            setProjectStatus(selectedProject?.pbac_status);
        }
        else if(selection === "NIEC") {
            setProjectStatus(selectedProject?.niec_status);
        }
        else if(selection === "ISRC") {
            setProjectStatus(selectedProject?.status);
        }
        setStatusSelection(selection);
    }

    const handleClose = () => { //Close comment
        setOpen(false); 
    }

    const handleStatusClose = () => { // Handle close project status
        setOpenProjectStatus(false);
        setStatusSelection('');
        setProjectStatus('');
        setInvestigatorsData([]);
    } 

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

    const handleEditIcon = async (item) => { // Handle Edit icon
        if((item.isrc_inv_comments === "" && 
            item.niec_inv_comments === "" && item.pbac_inv_comments === "") && item.project_id !== "") {
                alert("Editing is only allowed when comments are provided.");
                return;
        }
        else{
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
        setProjectRef(item.project_ref)
        setProjectChanges([{ change: '', description: '' }]);
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
                projectId : projectId,
                type: selectedOption,
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

    // 🔧 Handle field value changes
    const handleChange = (index, field, value) => {
        const updated = [...projectChanges];
        updated[index][field] = value;
        setProjectChanges(updated);
    };

    // ➕ Add a new row
    const addRow = () => {
        setProjectChanges([...projectChanges, { change: '', description: '' }]);
    };

    // ❌ Delete a row
    const deleteRow = (index) => {
        const updated = [...projectChanges];
        updated.splice(index, 1);
        setProjectChanges(updated);
    };

    // 🔄 Handle dropdown change
    const handleDropdownChange = (e) => {
        setSelectedOption(e.target.value);
    };

    //Status colors
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'green';
            case 'rejected':
                return 'red';
            case 'reviewed':
                return 'blue';
            case 'pending':
                return 'orange';
            default:
                return 'orange';
        }
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
                        {/* <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Status</Typography></Grid> */}
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>View</Typography></Grid>
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Comments</Typography></Grid>
                        <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Status</Typography></Grid>
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
                                {/* <Grid item size={1}><Typography sx={{ fontSize: "18px", color : `${statusColors[item.status]}` }}>{item.status}</Typography></Grid> */}
                                <Grid item size={1} sx = {{display : "flex", gap : "15px"}}>
                                    <Visibility sx={{ fontSize: 24, cursor: "pointer" }} onClick={() => openPdfVersionDialog(item)} /> 
                                    {item.project_pdf !== "" && (
                                        <PictureAsPdfIcon sx={{ fontSize: 24, cursor: "pointer", color: 'red' }}
                                            onClick={() => window.open(`http://localhost:4000/${item.project_pdf}.pdf`, "_blank")} />
                                    )}
                                </Grid>
                                <Grid item size={1}>
                                    <Comment sx={{ fontSize: 24, cursor: "pointer" }}  onClick={() => handleOpenComment(item)}/>
                                </Grid>
                                <Grid item size={1}>
                                    <InfoIcon sx={{ fontSize: 24, cursor: "pointer" }}  onClick={() => handleOpenStatus(item)}/>
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
                <DialogTitle>Add review remarks </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="org-select-label">Select Organization</InputLabel>
                        <Select labelId="org-select-label" value={selectedOrg}
                            label="Select Organization" onChange={handleSelectChange} >
                            <MenuItem value="NIEC">NIEC</MenuItem>
                            <MenuItem value="ISRC">ISRC</MenuItem>
                            <MenuItem value="PBAC">PBAC</MenuItem>
                        </Select>
                    </FormControl>
                    {selectedOrg &&  selectedOrg === "NIEC" && (
                        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 2,
                                backgroundColor: '#fafafa' }} >
                            <Typography variant="body1" mb={1}>
                                {selectedProject?.pbac_inv_comments || 'No comment available.'}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" textTransform="capitalize"
                                color={getStatusColor(selectedProject?.niec_status || "pending")} >
                                {selectedProject?.niec_status || 'Pending'}
                            </Typography>
                        </Box>
                    )}
                    {selectedOrg &&  selectedOrg === "ISRC" && (
                        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 2,
                                backgroundColor: '#fafafa' }} >
                            <Typography variant="body1" mb={1}>
                                {selectedProject?.isrc_inv_comments || 'No comment available.'}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" textTransform="capitalize"
                                color={getStatusColor(selectedProject?.status || "pending")} >
                                {selectedProject?.status || 'Pending'}
                            </Typography>
                        </Box>
                    )}
                    {selectedOrg &&  selectedOrg === "PBAC" && (
                        <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mt: 2,
                                backgroundColor: '#fafafa' }} >
                            <Typography variant="body1" mb={1}>
                                {selectedProject?.pbac_inv_comments || 'No comment available.'}
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" textTransform="capitalize"
                                color={getStatusColor(selectedProject?.pbac_status || "pending")} >
                                {selectedProject?.pbac_status || 'Pending'}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
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
            <Dialog open={openChangesComments} onClose={() => setOpenChangescomments(false)} maxWidth="md" fullWidth>
                <DialogTitle>Project Changes</DialogTitle>
                <DialogContent>

                    {/* 🔽 Dropdown */}
                    <FormControl fullWidth margin="normal">
                    <InputLabel id="change-select-label">Select Change Type</InputLabel>
                    <Select
                        labelId="change-select-label"
                        value={selectedOption}
                        onChange={handleDropdownChange}
                        label="Select Change Type"
                    >
                        <MenuItem value="NIEC">NIEC</MenuItem>
                        <MenuItem value="ISRC">ISRC</MenuItem>
                        <MenuItem value="PBAC">PBAC</MenuItem>
                    </Select>
                    </FormControl>

                    {/* 📋 Editable Table */}
                    <Table>
                    <TableHead>
                        <TableRow>
                        <TableCell><strong>Modifications suggested</strong></TableCell>
                        <TableCell><strong>Modifications done</strong></TableCell>
                        <TableCell><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {projectChanges.map((change, index) => (
                        <TableRow key={index}>
                            <TableCell>
                            <TextField
                                value={change.change}
                                onChange={(e) => handleChange(index, 'change', e.target.value)}
                                placeholder="Enter change"
                                fullWidth
                            />
                            </TableCell>
                            <TableCell>
                            <TextField
                                value={change.description}
                                onChange={(e) => handleChange(index, 'description', e.target.value)}
                                placeholder="Enter description"
                                fullWidth
                            />
                            </TableCell>
                            <TableCell>
                            <IconButton onClick={() => deleteRow(index)} color="error">
                                <DeleteIcon color = "error"/>
                            </IconButton>
                            </TableCell>
                        </TableRow>
                        ))}
                        <TableRow>
                        <TableCell colSpan={3} align="right">
                            <Button onClick={addRow} variant="contained" color="primary">
                            Add Row
                            </Button>
                        </TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenChangescomments(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleChangesSubmit} variant="contained" color="primary">Send</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isVersionDialogOpen} onClose={closePdfVersionDialog} maxWidth="md" fullWidth>
                <DialogTitle> PDF Versions for Project 
                    <IconButton onClick={closePdfVersionDialog} sx={{ position: "absolute", right: 8, top: 8 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedProjectForVersions?.all_project_pdfs?.length > 0 ? (
                        <List>
                            {[...selectedProjectForVersions.all_project_pdfs].reverse().map((pdfUrl, index) => (
                                <ListItem key={index}>
                                    <Link href={`http://localhost:4000/${pdfUrl}.pdf`}
                                        target="_blank" rel="noopener noreferrer" underline="hover" >
                                            Version {selectedProjectForVersions.all_project_pdfs.length - index}
                                    </Link>
                                </ListItem>
                            ))}
                        </List>
                        ) : (
                            <Typography>No PDF versions available.</Typography>
                        )}
                </DialogContent>
            </Dialog>
            {/* Status Dialog box popup*/}
            <Dialog open={openProjectStatus} onClose={handleStatusClose} fullWidth maxWidth="sm">
                <DialogTitle>Approval Status</DialogTitle>

                <DialogContent dividers>
                    <FormControl fullWidth sx={{ marginBottom: 2 }}>
                    <InputLabel>Select Group</InputLabel>
                    <Select value={statusSelection} label="Select Group" onChange={handleProjectStatusSelection}>
                        <MenuItem value="Investigators">Investigators</MenuItem>
                        <MenuItem value="ISRC">ISRC</MenuItem>
                        <MenuItem value="NIEC">NIEC</MenuItem>
                        <MenuItem value="PBAC">PBAC</MenuItem>
                    </Select>
                    </FormControl>
                    {statusSelection === "Investigators" ?
                        investigatorsData.map((item, index) => (
                            <Typography key={index} variant="subtitle1" sx={{ mt: 2 }}>
                            {`${item.name} : ${item.approved ? "Approved" : "Pending"}`}
                            </Typography>
                    )) : (
                        <Typography variant="subtitle1" sx={{ mt: 2 }}>Status: {projectStatus || "Pending"}</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStatusClose} variant="contained" color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default Dashboard;
