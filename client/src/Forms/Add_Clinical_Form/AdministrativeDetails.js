import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const AdministrativeDetails = ({setAdministration, administration}) => {

  const formatDateForInput = (date) => { //Date Display
    if (!date) return '';
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const formatDateForState = (date) => { //Date formation for database
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleChange = (e) => { // Handle Textfield change
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === 'submissionDate' || name === 'Date') { // Convert date value to dd/mm/yyyy format if it's a date field
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
            <TextField fullWidth label="Date of Submission to NIEC " type="date" InputLabelProps={{ shrink: true }}
                name='submissionDate' variant="outlined" required
                    value={formatDateForInput(administration.submissionDate)} onChange={handleChange} />
        </Grid>
        <Grid item size={12}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <FormControl fullWidth required>
                    <InputLabel >Type of Review</InputLabel>
                    <Select label="Type of Review" required  value={administration.reviewType} onChange={handleChange} name='reviewType' >
                        <MenuItem value="Expedited Review">Expedited Review</MenuItem>
                        <MenuItem value="Full Committee Review">Full Committee Review</MenuItem>
                    </Select>
                </FormControl>
                <Typography>If applying for Expedited Review, Kindly also fill the Expedited review application form</Typography>
            </Box>
        </Grid>
        <Grid item size={8}>
            <TextField fullWidth required label="Title of Study" variant="outlined" name='studyTitle' value={administration.studyTitle} onChange={handleChange} />
        </Grid>
        <Grid item size={4}>
            <TextField fullWidth label="Short Title(If any)" variant="outlined" name='shortTitle' value={administration.shortTitle} onChange={handleChange} />
        </Grid>
        <Grid item size={4}>
            <TextField fullWidth type = "number" required label="Protocol Number" variant="outlined" name='protocol' value={administration.protocol} onChange={handleChange} />
        </Grid>
        <Grid item size={4}>
            <TextField fullWidth type = "number" required label="Version Number" variant="outlined" name='version' value={administration.version} onChange={handleChange} />
        </Grid>
        <Grid item size={4}>
            <TextField fullWidth label="Dated" type="date" required InputLabelProps={{ shrink: true }}
                variant="outlined" name='Date'
                value={formatDateForInput(administration.Date)} onChange={handleChange}/>
        </Grid>
    </Grid>
  );
};

export default React.memo(AdministrativeDetails);