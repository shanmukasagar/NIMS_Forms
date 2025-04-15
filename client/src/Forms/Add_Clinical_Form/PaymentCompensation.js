import React from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import Grid from '@mui/material/Grid';

const PaymentCompensation = ({ setPaymentState, paymentState }) => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentState({...paymentState, [name] : value});
  };

  return (
    <Grid container spacing={2}>
      <Grid item size={4}>
        <FormControl fullWidth required>
          <InputLabel >Treatment for Injuries</InputLabel>
          <Select label="Treatment for Injuries" name = "injury_treatment" value={paymentState.injury_treatment} onChange={handleChange}  >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="NA">NA</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item size={4}>
        <FormControl fullWidth required>
          <InputLabel >Compensation for SAE</InputLabel>
          <Select label="Compensation for SAE"  name = "SAE_compensation" value={paymentState.SAE_compensation} onChange={handleChange} >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="NA">NA</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item size={4}>
        <FormControl fullWidth required>
            <InputLabel >Regulatory Approval Details</InputLabel>
            <Select label="Regulatory Approval Details"  name = "approval" value={paymentState.approval} onChange={handleChange} >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="underreview">Under Review</MenuItem>
              <MenuItem value="NA">NA</MenuItem>
            </Select>
        </FormControl>
      </Grid>
      <Grid item size={12}>
        <TextField fullWidth multiline rows = {3} label="If yes Specify approval Details" variant="outlined" name = "approval_details" value={paymentState.approval_details} onChange={handleChange} />
      </Grid>
    </Grid>
  );
};

export default React.memo(PaymentCompensation);