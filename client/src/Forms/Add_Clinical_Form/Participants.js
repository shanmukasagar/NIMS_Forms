import React from 'react';
import { TextField, MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import Grid from '@mui/material/Grid';
const Participants = ({participants, setParticipants}) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParticipants({...participants, [name] : value});
  };

  return (
    <Grid container spacing={2}>
      <Grid item size={4}>
        <FormControl fullWidth required>
          <InputLabel >Type of Participants</InputLabel>
          <Select label="Type of Participants" required name='participant_type' value={participants.participant_type || participants.participant_type || ""} onChange={handleChange} >
            <MenuItem value="Healthy volunteer">Healthy Volunteer</MenuItem>
            <MenuItem value="Patient">Patient</MenuItem>
            <MenuItem value="Vulnerable person">Vulnerable Person</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item size={4}>
        <TextField fullWidth label="Vulnerable Population Justification" variant="outlined" name='justification' value={participants.justification || participants.justification} onChange={handleChange}/>
      </Grid>
      <Grid item size={4}>
        <TextField fullWidth label="Additional Safeguards" variant="outlined" name='safeguards' value={participants.safeguards} onChange={handleChange} />
      </Grid>
      <Grid item size={12}>
        <FormControl fullWidth required>
            <InputLabel >Select reimbursement option</InputLabel>
            <Select label="Select reimbursement option" name='reimbursement' value={participants.reimbursement} onChange={handleChange} >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
            </Select>
        </FormControl>
      </Grid>
      <Grid item size = {12}>
        <TextField fullWidth multiline rows = {3} label = "If yes provide details" name = "reimbursement_details"
          value = {participants.reimbursement_details || participants.reimbursement_details} onChange = {handleChange}/>
      </Grid>
    </Grid>
  );
};

export default React.memo(Participants);