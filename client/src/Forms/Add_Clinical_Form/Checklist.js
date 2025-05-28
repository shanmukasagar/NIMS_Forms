import React, { useCallback } from 'react';
import { Grid, Typography, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

// ✅ Memoized Row Component
const ChecklistRow = React.memo(({ item, index, handleChange }) => (
  <Grid container spacing={2}>
    <Grid item size = {3}>
      <Typography>{`${index + 1}. ${item.label}`}</Typography>
    </Grid>
    <Grid item size = {3}>
      <FormControl fullWidth required>
        <InputLabel>Status</InputLabel>
        <Select label="Status" value={item.status} onChange={(e) => handleChange(e, index, 'status')}>
          <MenuItem value="Yes">Yes</MenuItem>
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="NA">NA</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    <Grid item size = {3} >
      <TextField fullWidth label="Enclosure No" value={item.enclosure_no || item.enclosure_no} onChange={(e) => handleChange(e, index, 'enclosure_no')} />
    </Grid>
    <Grid item size = {3}>
      <TextField fullWidth label="Remarks" value={item.remarks} onChange={(e) => handleChange(e, index, 'remarks')} />
    </Grid>
  </Grid>
));

// ✅ Main Checklist Component
const Checklist = ({ setCheckListData, checkListData }) => {
  const handleChange = useCallback((e, index, field) => {
    const value = e.target.value;
    setCheckListData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }, [setCheckListData]);

  return (
    <React.Fragment>
      {checkListData.map((item, index) => (
        <ChecklistRow key={item.id} item={item} index={index} handleChange={handleChange} />
      ))}
    </React.Fragment>
  );
};

export default React.memo(Checklist);
