import React from 'react';
import { Grid, TextField, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';

const MethodologyDetails = ({ methodologyData, setMethodologyData }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMethodologyData({ ...methodologyData, [name]: value });
    };

    return (
        <Grid container spacing={2}>
            <Grid item size={12}>
                <Typography>Sample size:</Typography>
            </Grid>
            <Grid item size={4}>
                <TextField
                    fullWidth
                    required
                    label="Total Estimated Sample Size for the Study"
                    variant="outlined"
                    name="total_sample_size"
                    value={methodologyData.total_sample_size || ""}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item size={4}>
                <TextField
                    fullWidth
                    required
                    label="No. of Participants to be Enrolled at the Site"
                    variant="outlined"
                    name="site_participants"
                    value={methodologyData.site_participants || ""}
                    onChange={handleChange}
                />
            </Grid>
            <Grid item size = {12}>
                <Typography>Is there an external laboratory / outsourcing involved for investigations? </Typography>
            </Grid>

            <Grid item size={4}>
                <FormControl fullWidth required>
                    <InputLabel>Is there an external lab / outsourcing involved?</InputLabel>
                    <Select
                        label="Is there an external lab / outsourcing involved?"
                        name="lab_outsourcing"
                        value={methodologyData.lab_outsourcing || ""}
                        onChange={handleChange}
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                        <MenuItem value="NA">NA</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {methodologyData.lab_outsourcing === "Yes" && (
                <Grid item size={12}>
                    <TextField required
                        fullWidth
                        multiline
                        minRows={3}
                        label="If yes, specify"
                        variant="outlined"
                        name="lab_details"
                        value={methodologyData.lab_details || ""}
                        onChange={handleChange}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default React.memo(MethodologyDetails);
