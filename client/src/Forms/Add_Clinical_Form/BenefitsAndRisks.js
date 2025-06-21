import React from 'react';
import { TextField, MenuItem, InputLabel, FormControl, Select, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const BenefitsAndRisks = ({ benefits, setBenefits }) => {

  const handleChange = (e) => { //Handle Change
    const { name, value } = e.target;
    setBenefits({...benefits, [name] : value});
  };

  return (
    <Grid container spacing={2}>
      <Grid item size = {12}>
        <Typography>Are there any anticipated physical / social / psychological discomforts / risk to participants</Typography>
      </Grid>
      <Grid item size={4}>
        <FormControl fullWidth required>
          <InputLabel >Risk to Participants</InputLabel>
          <Select label="Risk to Participants" name='any_risk' value={benefits.any_risk || ""} onChange={handleChange}  >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {benefits.any_risk === "Yes" && (
        <React.Fragment>
          <Grid item size={8}>
            <TextField fullWidth required label="If yes specify risk" variant="outlined" name='risk_details' value={benefits.risk_details || ""} onChange={handleChange}/>
          </Grid>
          <Grid item size={12}>
            <TextField required fullWidth label="Risk Management Strategy" multiline rows={4} variant="outlined" name='risk_strategy' value={benefits.risk_strategy || ""} onChange={handleChange}/>
          </Grid>
        </React.Fragment>
      )}
      
      <Grid item size = {12}>
        <Typography>What are Potential benefits from study participation?</Typography>
      </Grid>
      <Grid item size={4}>
        <FormControl fullWidth required  >
          <InputLabel >Participant Benefits</InputLabel>
          <Select label="Potential Benefits" name='participant_benefits' value={benefits.participant_benefits || ""} onChange={handleChange}  >
            <MenuItem value="Direct">Direct</MenuItem>
            <MenuItem value="Indirect">Indirect</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item size={4}>
        <FormControl fullWidth required>
          <InputLabel >Society Benefits</InputLabel>
          <Select label="Society Benefits" name='social_benefits' value={benefits.social_benefits || ""} onChange={handleChange}  >
            <MenuItem value="Direct">Direct</MenuItem>
            <MenuItem value="Indirect">Indirect</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item size={4}>
        <FormControl fullWidth required>
          <InputLabel >Science Benefits</InputLabel>
          <Select label="Science Benefits" name='science_benefits' value={benefits.science_benefits || ""} onChange={handleChange}  >
            <MenuItem value="Direct">Direct</MenuItem>
            <MenuItem value="Indirect">Indirect</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item size={4}>
        <FormControl fullWidth required>
          <InputLabel >Will advertisement be used to recruit subjects?</InputLabel>
          <Select label="Will advertisement be used to recruit subjects?" name='is_adv' value={benefits.is_adv || ""} onChange={handleChange}  >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {
        benefits.is_adv === "Yes" && (
          <Grid item size={8}>
            <TextField fullWidth required label="Specify Advertisements Details(If any)" variant="outlined" name='adv_details' value={benefits.adv_details || ""} onChange={handleChange}/>
          </Grid>
        )
      }
      
    </Grid>
  );
};

export default React.memo(BenefitsAndRisks);