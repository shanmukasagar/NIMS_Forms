import React from 'react';
import {
  Typography, TextField, Table, TableHead, TableRow,
  TableCell, TableBody, Button, Box, IconButton, RadioGroup,
  FormControlLabel, Radio
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const FundedStudyForm = ({ funding_FormData, setFundingFormData }) => {
  const {
    fundingAgency, grantPerPatient, manpowerGrant, totalGrant,
    nimsInvestigations, isOutsourced, outsourcedInvestigations
  } = funding_FormData;

  const handleChange = (field, value) => {
    setFundingFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNimsChange = (index, field, value) => {
    const updated = [...nimsInvestigations];
    updated[index][field] = value;
    handleChange('nimsInvestigations', updated);
  };

  const addNimsRow = () => {
    handleChange('nimsInvestigations', [...nimsInvestigations, { name: '', cost: '' }]);
  };

  const deleteNimsRow = (index) => {
    if (nimsInvestigations.length > 1) {
      const updated = [...nimsInvestigations];
      updated.splice(index, 1);
      handleChange('nimsInvestigations', updated);
    }
  };

  const handleOutsourcedChange = (index, field, value) => {
    const updated = [...outsourcedInvestigations];
    updated[index][field] = value;
    handleChange('outsourcedInvestigations', updated);
  };

  const addOutsourcedRow = () => {
    handleChange('outsourcedInvestigations', [
      ...outsourcedInvestigations,
      { name: '', cost: '', lab: '', nabl: '' }
    ]);
  };

  const deleteOutsourcedRow = (index) => {
    if (outsourcedInvestigations.length > 1) {
      const updated = [...outsourcedInvestigations];
      updated.splice(index, 1);
      handleChange('outsourcedInvestigations', updated);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Budget Proposal Submission Form for Funded Studies
      </Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>A. Name of the Funding Agency:</Typography>
      <TextField required fullWidth size="small" sx={{ mt: 2, mb: 4 }} placeholder="Enter funding agency name" value={fundingAgency} onChange={(e) => handleChange('fundingAgency', e.target.value)} />

      <Typography variant="h6">B. Proposed Budget</Typography>
      <TextField required fullWidth label="1. Expected Grant per Completed Patient" size="small" sx={{ mb: 2 }} value={grantPerPatient} onChange={(e) => handleChange('grantPerPatient', e.target.value)} />
      <TextField required fullWidth label="2. Expected Man-Power Grant per Completed Patient" size="small" sx={{ mb: 3 }} value={manpowerGrant} onChange={(e) => handleChange('manpowerGrant', e.target.value)} />

      <Typography variant="subtitle1">3. Investigations to be done in NIMS</Typography>
      <Table size="small" sx={{ mt: 1 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name of Investigation</TableCell>
            <TableCell>Unit Cost</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {nimsInvestigations.map((row, i) => (
            <TableRow key={i}>
              <TableCell><TextField required fullWidth size="small" value={row.name} onChange={(e) => handleNimsChange(i, 'name', e.target.value)} /></TableCell>
              <TableCell><TextField required fullWidth size="small" value={row.cost} onChange={(e) => handleNimsChange(i, 'cost', e.target.value)} /></TableCell>
              <TableCell>
                {nimsInvestigations.length > 1 && (
                  <IconButton onClick={() => deleteNimsRow(i)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="outlined" sx={{ mt: 2 }} onClick={addNimsRow}>+ Add Row</Button>

      <TextField required fullWidth label="Total Grant Allotted to the Study" size="small" sx={{ mt: 4 }} value={totalGrant} onChange={(e) => handleChange('totalGrant', e.target.value)} />

      <Typography variant="h6" sx={{ mt: 5 }}>
        C. Are any study specific investigations being outsourced?
      </Typography>

      <RadioGroup row value={isOutsourced} onChange={(e) => handleChange('isOutsourced', e.target.value)}>
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>

      {isOutsourced === 'yes' && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            List the Investigations being Outsourced
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name of Investigation</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Lab Name & Address</TableCell>
                <TableCell>NABL Accredited (Y/N)</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {outsourcedInvestigations.map((row, i) => (
                <TableRow key={i}>
                  <TableCell><TextField required fullWidth size="small" value={row.name} onChange={(e) => handleOutsourcedChange(i, 'name', e.target.value)} /></TableCell>
                  <TableCell><TextField required fullWidth size="small" value={row.cost} onChange={(e) => handleOutsourcedChange(i, 'cost', e.target.value)} /></TableCell>
                  <TableCell><TextField required fullWidth size="small" value={row.lab} onChange={(e) => handleOutsourcedChange(i, 'lab', e.target.value)} /></TableCell>
                  <TableCell><TextField required fullWidth size="small" value={row.nabl} onChange={(e) => handleOutsourcedChange(i, 'nabl', e.target.value)} /></TableCell>
                  <TableCell>
                    {outsourcedInvestigations.length > 1 && (
                      <IconButton onClick={() => deleteOutsourcedRow(i)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={addOutsourcedRow} variant="outlined" sx={{ mt: 2 }}>
            + Add Row
          </Button>
        </>
      )}
    </Box>
  );
};

export default FundedStudyForm;
