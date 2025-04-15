import React from 'react';
import { MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';

const AdditionalDetails = ({ additional, setAdditional }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdditional({...additional, [name] : value});
  };

  return (
    <Grid container spacing={2}>
        <Grid item size={12}>
            <FormControl fullWidth required>
                <InputLabel >Any Addition Information</InputLabel>
                <Select label="Any Addition Information" name='any_additional' value={additional.any_additional} onChange={handleChange} >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                </Select>
            </FormControl>
        </Grid>
        <Grid item size = {12}>
            <TextField fullWidth multiline rows = {3} label = "If yes provide details"
              name = "additional_info" value = {additional.additional_info} onChange = {handleChange}/>
        </Grid>
    </Grid>
  );
};

export default React.memo(AdditionalDetails);