import React, {useState, useEffect, useRef} from 'react';
import { Grid, Typography, IconButton, Paper, Box } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import PreviewPopup from "../Forms/Add_Clinical_Form/Clinical_Preview";
import axiosInstance from "../components/AxiosInstance";
import {formatDateTime} from "../data/Clinical_CheckList";

const ClinicalFormGrid = () => {
    const [data, setData] = useState([]);
    const fetchOnce = useRef(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [selectedData, setSelectedData] = useState({});

    const handleView = (item) => {
        setOpenPreview(true);
        setSelectedData(item);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!fetchOnce.current) {
                try {
                    fetchOnce.current = true;
                    const response = await axiosInstance.get("/api/clinical/list"
                    );
                    if (response.status === 200) {
                        setData(response.data);
                    }
                } catch (err) {
                    console.log("Error occured while fetching data", err.message);
                    alert("Error occured while fetching data");
                }
            }
        };
    
        fetchData();
    }, []);

    return (
        <Box sx = {{display : "flex", flexDirection : "column", gap : "25px"}}>
            <Typography sx = {{fontSize : "25px", fontWeight : "500"}}>Clinical Trail List</Typography>
            <Box>
                <Grid container spacing = {2} style={{ backgroundColor: '#4b1d77', color: 'white', padding: "15px", borderRadius : "5px 5px 0px 0px" }}>
                    <Grid item size={2}><Typography sx = {{fontSize : "18px"}}>Study Title</Typography></Grid>
                    <Grid item size={2}><Typography sx = {{fontSize : "18px"}}>Investigator Name</Typography></Grid>
                    <Grid item size={2}><Typography sx = {{fontSize : "18px"}}>Department</Typography></Grid>
                    <Grid item size={2}><Typography sx = {{fontSize : "18px"}}>Submission Date</Typography></Grid>
                    <Grid item size={3}><Typography sx = {{fontSize : "18px"}}>Email</Typography></Grid>
                    <Grid item size={1}><Typography sx = {{fontSize : "18px"}}>View</Typography></Grid>
                </Grid>
                {/* Data Rows */}
                {data.length > 0 ? (
                    data.map((item, index) => (
                        <Paper key={item.id} elevation={2}>
                            <Grid container spacing={2} alignItems="center" sx={{ padding: "9px", border: "0.5px solid #e3dddd" }}>
                                <Grid item size={2}>
                                <Typography sx={{ fontSize: "18px" }}>{item.administration.study_title}</Typography>
                                </Grid>
                                <Grid item size={2}>
                                <Typography sx={{ fontSize: "18px" }}>{item.administration.name}</Typography>
                                </Grid>
                                <Grid item size={2}>
                                <Typography sx={{ fontSize: "18px" }}>{item.administration.department}</Typography>
                                </Grid>
                                <Grid item size={2}>
                                <Typography sx={{ fontSize: "18px" }}>{formatDateTime(item.administration.submission_date)}</Typography>
                                </Grid>
                                <Grid item size={3}>
                                <Typography sx={{ fontSize: "18px" }}>{item.administration.email}</Typography>
                                </Grid>
                                <Grid item size={1}>
                                <IconButton onClick={() => handleView(item)}>
                                    <VisibilityIcon sx={{ color: "rebeccapurple" }} />
                                </IconButton>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))
                    ) : (
                    <Typography sx = {{ fontSize : "18px", fontWeight : "600", textAlign : "center",
                        padding : "20px"
                    }}>Data does not exist for the user</Typography>
                )}

                {Object.keys(selectedData).length > 0 && (<PreviewPopup open={openPreview}  onClose={() => setOpenPreview(false)}
                    formData={{ administration: selectedData.administration,
                        researchers: selectedData.researchers, 
                        participants: selectedData.participants,
                        benefits: selectedData.benefits,
                        paymentState: selectedData.paymentState,
                        storage: selectedData.storage,
                        additional: selectedData.additional,
                        checkListData: selectedData.checkListData
                    }}
                /> )}
            </Box>
        </Box>
    );
};

export default React.memo(ClinicalFormGrid);
