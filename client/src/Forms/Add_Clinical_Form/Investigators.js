import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';

const Investigators = ({researchers, setResearchers}) => {

  const fieldNames = ['name', 'designation', 'qualification', 'department', 'address', 'contact'];

  const handleCoChange = (e, index) => { // Co-Investigators change
    const { name, value } = e.target;
    const updated = [...researchers.investigators.coInvestigators];
    updated[index][name] = value;
    setResearchers(prev => ({
      ...prev,
      investigators: {
        ...prev.investigators,
        coInvestigators: updated
      }
    }));
  };

  const handlePrincipalChange = (e) => { //Principal investigators change
    const { name, value } = e.target;
    setResearchers(prev => ({
      ...prev,
      investigators: {
        ...prev.investigators,
        principal: {
          ...prev.investigators.principal,
          [name]: value
        }
      }
    }));
  };
  

  return (
    <Grid container spacing={2}>
      {fieldNames.map((item, index) => (
        <Grid item xs={4} key={index}>
          <TextField fullWidth required label={item.charAt(0).toUpperCase() + item.slice(1)}
            variant="outlined" name={item} value={researchers.investigators.principal[item] || ""}
            onChange={handlePrincipalChange} />
        </Grid>
      ))}
      <Grid item size = {12}>
        <Typography>Co-Investigators:</Typography>
      </Grid>
      {researchers.investigators.coInvestigators.map((co, index) => (
        fieldNames.map((item, itemIndex) => (
          <Grid item size={2} md={4} key={`${index}-${itemIndex}`}>
            <TextField fullWidth label={item.charAt(0).toUpperCase() + item.slice(1)}
              variant="outlined" name={item} value={co[item] || ""}
              onChange={(e) => handleCoChange(e, index)}  />
          </Grid>
        ))
      ))}
    </Grid>
  );
};

export default React.memo(Investigators);