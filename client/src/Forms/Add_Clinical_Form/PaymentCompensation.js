import React, {useState, useEffect, useRef} from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Typography, Box} from '@mui/material';
import Grid from '@mui/material/Grid';

const PaymentCompensation = ({ setPaymentState, paymentState, isEdit }) => {
  const [previewURL, setPreviewURL] = useState(null);
  const fetchOnce = useRef(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentState({...paymentState, [name] : value});
  };

  return (
    <Grid container spacing={2}>
      <Grid item size = {12}>
        <Typography>Is there a provision for providing treatment free of cost for research related injuries?  </Typography>
      </Grid>
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
      <Grid item size = {8}>
        {paymentState.injury_treatment === "Yes" && (
            <TextField fullWidth label = "If yes provide details" name = "injury_details" required
              value = {paymentState.injury_details } onChange = {handleChange}/>
        )}
      </Grid>
      <Grid item size = {12}>
        <Typography>Is there a provision for compensation of research related SAE?   </Typography>
      </Grid>
      <Grid item size={4}>
        <FormControl fullWidth required>
          <InputLabel >Compensation for SAE</InputLabel>
          <Select label="Compensation for SAE"  name = "sae_compensation" value={paymentState.sae_compensation } onChange={handleChange} >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
            <MenuItem value="NA">NA</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item size = {8}>
        {paymentState.sae_compensation === "Yes" && (
              <TextField fullWidth label = "If yes provide details" name = "sae_details" required value = {paymentState.sae_details } onChange = {handleChange}/>
          )}
      </Grid>
      <Grid item size = {12}>
        <Typography>Has application been reviewed by any other hospital / Institute / DCGI / appropriate regulatory authority  </Typography>
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
        { paymentState.approval === "Yes" && (
            <TextField fullWidth required multiline rows = {3} label="If yes Specify approval Details" variant="outlined" 
            name = "approval_details" value={paymentState.approval_details} onChange={handleChange} />
        )}
      </Grid>
    </Grid>
  );
};

export default React.memo(PaymentCompensation);