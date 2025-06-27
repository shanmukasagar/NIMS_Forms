import React from 'react';
import { TextField, MenuItem, InputLabel, FormControl, Select, Checkbox, ListItemText,  Box,  OutlinedInput, Typography, } from '@mui/material';
import Grid from '@mui/material/Grid';
const Participants = ({participants, setParticipants}) => {

  const vulnerableOptions = [
    "Economically and socially disadvantaged",
    "Unduly influenced due to fear/benefits",
    "Children (up to 18 years)",
    "Women in special situations",
    "Tribals and marginalized communities",
    "Refugees, migrants, homeless, etc.",
    "Mentally ill / cognitively impaired / disabled",
    "Terminally ill / rare disease patients",
    "Persons with diminished autonomy",
] ;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParticipants({...participants, [name] : value});
  };

  // Handle vulnerable group
  const handleVulnerableGroupChange = (option) => {
    setParticipants((prev) => {
      const selected = prev.vulnerable_groups || [];
      const isChecked = selected.includes(option);
      return {
        ...prev,
        vulnerable_groups: isChecked
          ? selected.filter((item) => item !== option)
          : [...selected, option],
      };
    });
  };


  return (
    <Grid container spacing={2}>
      <Grid item size={4}>
        <FormControl fullWidth required>
          <InputLabel >Type of Participants</InputLabel>
          <Select label="Type of Participants" required name='participant_type' value={participants.participant_type || ""} onChange={handleChange} >
            <MenuItem value="Healthy volunteer">Healthy Volunteer</MenuItem>
            <MenuItem value="Patient">Patient</MenuItem>
            <MenuItem value="Vulnerable person">Vulnerable Person</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {
        participants.participant_type === "Others" && (
          <Grid item size={4}>
            <TextField fullWidth label="Specify other participant" variant="outlined" name='other_participant'  required
              value={participants.other_participant} onChange={handleChange} />
          </Grid>
        )
      }
      {participants.participant_type === "Vulnerable person" && ( 
        <React.Fragment>
          <Grid item size={12}>
          </Grid>
          <Grid item size = {12}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "8px",  }} >
              {participants.participant_type === "Vulnerable person" && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: "8px",  }}>
                  <h4>Select Vulnerable Populations</h4>
                  {vulnerableOptions.map((option, index) => (
                    <label key={index} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 10px", borderRadius: "6px",
                        border: "1px solid #ccc", cursor: "pointer", backgroundColor: "#f9f9f9", transition: "background-color 0.3s", }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "rgba(25,118,210,0.08)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9f9f9")
                      }
                    >
                    <input type="checkbox" value={option} checked={participants.vulnerable_groups?.includes(option)}
                      onChange={() => handleVulnerableGroupChange(option)}
                      style={{ width: "18px", height: "18px", accentColor: "#1976d2", cursor: "pointer", }} /> {option} </label>
                    ))}
                </Box>
            )}
            </Box>
          </Grid>
          <Grid item size = {12}>
            <Typography>If study includes Vulnerable population: </Typography>
          </Grid>
          <Grid item size = {12}>
            <TextField fullWidth label="Provide justification for inclusion:" required variant="outlined" name='justification' 
              value={participants.justification} onChange={handleChange} />
          </Grid>
          <Grid item size = {12}>
            <TextField fullWidth label="Are there any additional safeguards to protect research participants?" required 
              variant="outlined" name='additional_safeguards'  value={participants.additional_safeguards} onChange={handleChange} />
          </Grid>
        </React.Fragment>
      )}
      <Grid item size = {12}>
        <Typography>Is there any reimbursement / payment to the subject for participation? </Typography>
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
      {
        participants.reimbursement === "Yes" && (
          <Grid item size = {12}>
            <TextField fullWidth multiline rows = {3} label = "If yes provide details" name = "reimbursement_details" required
              value = {participants.reimbursement_details} onChange = {handleChange}/>
          </Grid>
        )

      }
      
    </Grid>
  );
};

export default React.memo(Participants);