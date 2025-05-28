import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Typography, IconButton, Paper, Box,  Dialog, DialogTitle, DialogContent, DialogActions,
    Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import axiosInstance from "../../components/AxiosInstance";

const ClinicalFormFeedback = () => {
    const [projectsData, setProjectsData] = useState([]); //Store projectsData
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedData, setSelectedData] = useState({});
    const [openComment, setOpenComment] = useState(false);
    const [selectedComment, setSelectedComment] = useState("");

    const navigate = useNavigate();
    const fetchOnce = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!fetchOnce.current) {
                try {
                    fetchOnce.current = true;
                    const response = await axiosInstance.get("/api/clinical/projects");
                    setProjectsData(response.data);
                } catch (err) {
                    console.error("Error occurred while fetching projects data:", err);
                }
            }
        };
        fetchData();
    }, []);

    // Static data
    const staticData = [
        {
            project_id: "PID2025-001",
            project_title: "Effect of Drug A in Diabetes",
            sub_date: "2025-05-10",
            status: "Approved",
            comment: "Please provide the sample size justification."
        },
        {
            project_id: "PID2025-002",
            project_title: "COVID-19 Vaccine Trial Phase III",
            sub_date: "2025-05-12",
            status: "Under Review",
            comment: "More information is required regarding informed consent process."
        }
    ];

    const handleView = (item) => {
        setSelectedData(item);
        setOpenPreview(true); // You can hook this to a modal if needed
    };

    const handleComment = (item) => {
        setSelectedComment(item.comment || "No comment available");
        setOpenComment(true);
    };

    const handleEdit = (item) => {
        navigate(`/edit-form/${item.project_id}`);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <Typography sx={{ fontSize: "25px", fontWeight: "500" }}>Clinical Trial List</Typography>

            <Box>
                <Grid container spacing={2} style={{ backgroundColor: '#4b1d77', color: 'white', padding: "15px", borderRadius: "5px 5px 0px 0px" }}>
                    <Grid item size={5}><Typography sx={{ fontSize: "18px" }}>Study Title</Typography></Grid>
                    <Grid item size={2}><Typography sx={{ fontSize: "18px" }}>Submission Date</Typography></Grid>
                    <Grid item size={2}><Typography sx={{ fontSize: "18px" }}>Status</Typography></Grid>
                    <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>View</Typography></Grid>
                    <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Comments</Typography></Grid>
                    <Grid item size={1}><Typography sx={{ fontSize: "18px" }}>Edit</Typography></Grid>
                </Grid>

                {projectsData.length > 0 && projectsData.map((item, index) => (
                    <Paper key={index} elevation={2}>
                        <Grid container spacing={2} alignItems="center" sx={{ padding: "9px", border: "0.5px solid #e3dddd" }}>
                            <Grid item size={5}>
                                <Typography sx={{ fontSize: "18px" }}>{item.project_title}</Typography>
                            </Grid>
                            <Grid item size={2}>
                                <Typography sx={{ fontSize: "18px" }}>{item.sub_date}</Typography>
                            </Grid>
                            <Grid item size={2}>
                                <Typography sx={{ fontSize: "18px" }}>{item.status}</Typography>
                            </Grid>
                            <Grid item size={1}>
                                <IconButton onClick={() => handleView(item)}>
                                    <VisibilityIcon sx={{ color: "rebeccapurple" }} />
                                </IconButton>
                            </Grid>
                            <Grid item size={1}>
                                <IconButton onClick={() => handleComment(item)}>
                                    <CommentIcon sx={{ color: "#1976d2" }} />
                                </IconButton>
                            </Grid>
                            <Grid item size={1}>
                                <IconButton onClick={() => handleEdit(item)}>
                                    <EditIcon sx={{ color: "#f57c00" }} />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Box>

            {/* Comment Popup */}
            <Dialog open={openComment} onClose={() => setOpenComment(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Reviewer Comment</DialogTitle>
                <DialogContent>
                    <Typography>{selectedComment}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenComment(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ClinicalFormFeedback;
