import React from 'react';
import { Grid, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const ResearchProjectDetails = ({ overviewResearch, setOverviewResearch }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOverviewResearch({ ...overviewResearch, [name]: value });
    };

    return (
        <Grid container spacing={2}>
            <Grid item size={12}> 
                <TextField fullWidth required multiline minRows={4} label="Summary of Research Project (within 300 words)" 
                    variant="outlined" name="overview_summary" value={overviewResearch.overview_summary || ""} 
                        onChange={handleChange} inputProps={{ maxLength: 300 }} />
            </Grid>

            <Grid item size={6}>
                <FormControl fullWidth required>
                    <InputLabel>Type of Study</InputLabel>
                    <Select label="Type of Study" name="study_type" value={overviewResearch.study_type || ""} 
                        onChange={handleChange}>
                        <MenuItem value="Regulatory clinical trials">Regulatory clinical trials</MenuItem>
                        <MenuItem value="Academic clinical trials">Academic clinical trials</MenuItem>
                        <MenuItem value="BA/BE studies">BA/BE studies</MenuItem>
                        <MenuItem value="Other">Any other type of trial (Specify)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {overviewResearch.study_type === "Other" && (
                <Grid item size={6}>
                    <TextField
                        fullWidth
                        required
                        label="Specify Other Type of Study"
                        variant="outlined"
                        name="other_study_type"
                        value={overviewResearch.other_study_type || ""}
                        onChange={handleChange}
                    />
                </Grid>
            )}
        </Grid>
    );
};

export default React.memo(ResearchProjectDetails);
