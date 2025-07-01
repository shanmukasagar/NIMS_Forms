import React from 'react';
import { Box, Button, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow, IconButton, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SelfFundedStudyForm = ({ funding_FormData, setFundingFormData }) => {
  const { proposedBudget, costPerPatient, totalProjectCost, nimsInvestigations, 
    isOutsourced, outsourcedInvestigations } = funding_FormData;

  const handleChange = (field, value) => setFundingFormData(prev => ({ ...prev, [field]: value }));

  const handleNimsChange = (i, field, val) => {
    const updated = [...nimsInvestigations]; updated[i][field] = val;
    handleChange('nimsInvestigations', updated);
  };

  const addNimsRow = () => handleChange('nimsInvestigations', [...nimsInvestigations, { name: '', cost: '' }]);
  
  const deleteNimsRow = (i) => {
    if (nimsInvestigations.length > 1) {
      const updated = [...nimsInvestigations]; updated.splice(i, 1);
      handleChange('nimsInvestigations', updated);
    }
  };

  const handleOutsourcedChange = (i, field, val) => {
    const updated = [...outsourcedInvestigations]; updated[i][field] = val;
    handleChange('outsourcedInvestigations', updated);
  };

  const addOutsourcedRow = () => handleChange('outsourcedInvestigations', [...outsourcedInvestigations, { name: '', cost: '', lab: '', nabl: '' }]);
  
  const deleteOutsourcedRow = (i) => {
    if (outsourcedInvestigations.length > 1) {
      const updated = [...outsourcedInvestigations]; updated.splice(i, 1);
      handleChange('outsourcedInvestigations', updated);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5">Budget Proposal Submission Form for Self-Funded Research</Typography>
      <TextField required fullWidth label="Proposed Budget by Principal Investigator" 
        value={proposedBudget} onChange={(e) => handleChange('proposedBudget', e.target.value)} 
          size="small" sx={{ my: 2 }} />
      <Typography>No of Study Patients/Participants planned to be recruited:</Typography>
      <TextField required fullWidth label="1. Expected Cost per Completed Patient" value={costPerPatient}
         onChange={(e) => handleChange('costPerPatient', e.target.value)} size="small" 
          sx={{ mb: 3, mt: 3 }} />
      <Typography variant="subtitle1">2. Investigations to be done in NIMS</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name of Investigation</TableCell>
            <TableCell>Unit Cost</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nimsInvestigations.map((row, i) => (
            <TableRow key={i}>
              <TableCell><TextField required fullWidth value={row.name} 
                onChange={(e) => handleNimsChange(i, 'name', e.target.value)} size="small" /></TableCell>
              <TableCell><TextField required fullWidth value={row.cost} 
                onChange={(e) => handleNimsChange(i, 'cost', e.target.value)} size="small" /></TableCell>
              <TableCell><IconButton onClick={() => deleteNimsRow(i)} 
                disabled={nimsInvestigations.length === 1}><DeleteIcon color="error" /></IconButton>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={addNimsRow} variant="outlined" sx={{ mt: 2 }}>+ Add Row</Button>
      <TextField required fullWidth label="3. Total Project Cost" value={totalProjectCost} onChange={(e) => handleChange('totalProjectCost', e.target.value)} size="small" sx={{ mt: 4 }} />
      <Typography variant="h6" sx={{ mt: 4 }}>Are any study specific investigations being outsourced?</Typography>
      <RadioGroup row value={isOutsourced} onChange={(e) => handleChange('isOutsourced', e.target.value)}>
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>
      {isOutsourced === 'yes' && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Table B: Investigations being Outsourced</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Lab Name & Address</TableCell>
                <TableCell>NABL Accredited</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outsourcedInvestigations.map((row, i) => (
                <TableRow key={i}>
                  <TableCell><TextField required fullWidth value={row.name} onChange={(e) => handleOutsourcedChange(i, 'name', e.target.value)} size="small" /></TableCell>
                  <TableCell><TextField required fullWidth value={row.cost} onChange={(e) => handleOutsourcedChange(i, 'cost', e.target.value)} size="small" /></TableCell>
                  <TableCell><TextField required fullWidth value={row.lab} onChange={(e) => handleOutsourcedChange(i, 'lab', e.target.value)} size="small" /></TableCell>
                  <TableCell><TextField required fullWidth value={row.nabl} onChange={(e) => handleOutsourcedChange(i, 'nabl', e.target.value)} size="small" /></TableCell>
                  <TableCell><IconButton onClick={() => deleteOutsourcedRow(i)} disabled={outsourcedInvestigations.length === 1}><DeleteIcon color="error" /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={addOutsourcedRow} variant="outlined" sx={{ mt: 2 }}>+ Add Row</Button>
        </>
      )}
    </Box>
  );
};

export default SelfFundedStudyForm;
