import React from 'react';
import { MenuItem, Select, InputLabel, FormControl, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';

const StorageAndConfidentiality = ({ setStorage, storage }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStorage({...storage, [name] : value});
  };

  return (
    <Grid container spacing={2}>
      <Grid item size={12}>
        <FormControl fullWidth required>
          <InputLabel >Study Documents Access Control</InputLabel>
          <Select label="Study Documents Access Control" name='docs_control' value={storage.docs_control} onChange={handleChange} >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item size = {12}>
        <TextField fullWidth multiline rows = {3} label = "If yes specify details"
          name = "docs_details" value = {storage.docs_details} onChange = {handleChange}/>
      </Grid>
      <Grid item size={12}>
        <FormControl fullWidth required>
          <InputLabel >Study Drugs/Devices Access Control</InputLabel>
          <Select label="Study Drugs/Devices Access Control" name='drugs_control' value={storage.drugs_control} onChange={handleChange} >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>
     </Grid>
     <Grid item size = {12}>
        <TextField fullWidth multiline rows = {3} label = "If yes specify details"
          name = "drugs_details" value = {storage.drugs_details} onChange = {handleChange}/>
      </Grid>
    </Grid>
  );
};

export default React.memo(StorageAndConfidentiality);