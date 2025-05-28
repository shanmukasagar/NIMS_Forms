import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const AdministrativeDetails = ({setAdministration, administration}) => {

    const formatDateForInput = (date) => { //Date Display
        if (!date) return '';
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
    };

    const formatSubmissionDate = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0]; // returns 'yyyy-MM-dd'
    };


    const formatDateForState = (date) => { //Date formation for database
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleChange = (e) => { // Handle Textfield change
        const { name, value } = e.target;
        let updatedValue = value;
        if (name === 'submission_date' || name === 'date') { // Convert date value to dd/mm/yyyy format if it's a date field
            updatedValue = formatDateForState(value);
        }
        setAdministration({...administration, [name] : updatedValue});
    };

    return (
        <Grid container spacing={2}>
            <Grid item size={4}>
                <TextField fullWidth required label="Principal Investigator Name " variant="outlined" name="name" value={administration.name || "" } onChange={handleChange}/>
            </Grid>
            <Grid item size={4}>
                <TextField fullWidth required label="Department" variant="outlined" name="department" value={administration.department || ""} onChange={handleChange} />
            </Grid>
            <Grid item size={4}>
                <TextField fullWidth label="Date of Submission to NIEC" type="date" InputLabelProps={{ shrink: true }}
                    name="submission_date" variant="outlined" required disabled 
                    value={formatSubmissionDate(administration.submission_date || administration.submission_date)} onChange={handleChange}
                />
            </Grid>
            <Grid item size={12}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <FormControl fullWidth required>
                        <InputLabel >Type of Review</InputLabel>
                        <Select label="Type of Review" required  value={administration.review_type || administration.review_type} onChange={handleChange} name='review_type' >
                            <MenuItem value="Expedited Review">Expedited Review</MenuItem>
                            <MenuItem value="Full Committee Review">Full Committee Review</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography>If applying for Expedited Review, Kindly also fill the Expedited review application form</Typography>
                </Box>
            </Grid>
            <Grid item size={8}>
                <TextField fullWidth required label="Title of Study" variant="outlined" name='study_title' 
                    value={administration.study_title || administration.study_title} onChange={handleChange} />
            </Grid>
            <Grid item size={4}>
                <TextField fullWidth label="Short Title(If any)" variant="outlined" name='short_title' 
                    value={administration.short_title || administration.short_title} onChange={handleChange} />
            </Grid>
            <Grid item size={4}>
                <TextField fullWidth type = "number" required label="Protocol Number" variant="outlined" 
                name='protocol' value={administration.protocol} onChange={handleChange} />
            </Grid>
            <Grid item size={4}>
                <TextField fullWidth type = "number" required label="Version Number" variant="outlined" 
                name='version' value={administration.version} onChange={handleChange} />
            </Grid>
            <Grid item size={4}>
                <TextField fullWidth label="Dated" type="date" required InputLabelProps={{ shrink: true }}
                    variant="outlined" name='date' value={administration.date.split('T')[0] || ""} onChange={handleChange}/>
            </Grid>
        </Grid>
    );
};

export default React.memo(AdministrativeDetails);