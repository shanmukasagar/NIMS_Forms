import React from 'react';
import {  Box, Button, Typography, TextField, Table, TableHead, TableRow,
  TableCell, TableBody, IconButton, RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Industry_Funding = ({ funding_FormData, setFundingFormData }) => {
  const {
    sponsorName, sponsorPAN, sponsorGST, totalGrant, budgetItems,
    nimsInvestigations, personnel, isOutsourced, outsourcedInvestigations
  } = funding_FormData;

  const handleChange = (field, value) => {
    setFundingFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (arrayName, index, key, value) => {
    const updated = [...funding_FormData[arrayName]];
    updated[index][key] = value;
    handleChange(arrayName, updated);
  };

  const addArrayRow = (arrayName, defaultRow) => {
    handleChange(arrayName, [...funding_FormData[arrayName], defaultRow]);
  };

  const deleteArrayRow = (arrayName, index) => {
    if (funding_FormData[arrayName].length > 1) {
      const updated = [...funding_FormData[arrayName]];
      updated.splice(index, 1);
      handleChange(arrayName, updated);
    }
  };

  return (
    <Box maxWidth="md">
      <Typography variant="h5" gutterBottom>Budget Proposal Submission Form for Industry Sponsored Study</Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>A. Sponsor Details</Typography>
      <TextField required fullWidth size="small" label="Sponsor Name / ID" value={sponsorName} onChange={(e) => handleChange('sponsorName', e.target.value)} sx={{ mt: 2, mb: 2 }} />
      <TextField required fullWidth size="small" label="Sponsor PAN" value={sponsorPAN} onChange={(e) => handleChange('sponsorPAN', e.target.value)} sx={{ mb: 2 }} />
      <TextField required fullWidth size="small" label="Sponsor GST" value={sponsorGST} onChange={(e) => handleChange('sponsorGST', e.target.value)} sx={{ mb: 4 }} />

      <Typography variant="subtitle1" gutterBottom>Proposed Budget by Sponsor:</Typography>
      {budgetItems.map((item, i) => (
        <TextField required key={i} fullWidth size="small" label={item.label} value={item.value} onChange={(e) => {
          const updated = [...budgetItems];
          updated[i].value = e.target.value;
          handleChange('budgetItems', updated);
        }} sx={{ mb: 2 }} />
      ))}

      <Typography variant="subtitle1" sx={{ mt: 3 }}>Investigations to be done in NIMS</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name of Investigation</TableCell>
            <TableCell>Unit Cost (as per sponsor)</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {nimsInvestigations.map((row, i) => (
            <TableRow key={i}>
              <TableCell><TextField required fullWidth size="small" value={row.name} onChange={(e) => handleArrayChange('nimsInvestigations', i, 'name', e.target.value)} /></TableCell>
              <TableCell><TextField required fullWidth size="small" value={row.cost} onChange={(e) => handleArrayChange('nimsInvestigations', i, 'cost', e.target.value)} /></TableCell>
              <TableCell>{nimsInvestigations.length > 1 && <IconButton onClick={() => deleteArrayRow('nimsInvestigations', i)}><DeleteIcon color="error" /></IconButton>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => addArrayRow('nimsInvestigations', { name: '', cost: '' })} variant="outlined" sx={{ mt: 2 }}>+ Add Row</Button>

      <TextField required fullWidth size="small" label="Total grant allotted to the proposed project" value={totalGrant} onChange={(e) => handleChange('totalGrant', e.target.value)} sx={{ mt: 4 }} />

      <Typography variant="h6" sx={{ mt: 4 }}>B. i. List of Personnel</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Designation</TableCell>
            <TableCell>Proposed Fees per Patient</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {personnel.map((row, i) => (
            <TableRow key={i}>
              <TableCell><TextField required fullWidth size="small" value={row.designation} onChange={(e) => handleArrayChange('personnel', i, 'designation', e.target.value)} /></TableCell>
              <TableCell><TextField required fullWidth size="small" value={row.fees} onChange={(e) => handleArrayChange('personnel', i, 'fees', e.target.value)} /></TableCell>
              <TableCell>{personnel.length > 1 && <IconButton onClick={() => deleteArrayRow('personnel', i)}><DeleteIcon color="error" /></IconButton>}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => addArrayRow('personnel', { designation: '', fees: '' })} variant="outlined" sx={{ mt: 2 }}>+ Add Row</Button>

      <Typography variant="h6" sx={{ mt: 4 }}>C. Are any study specific investigations being outsourced?</Typography>
      <RadioGroup required row value={isOutsourced} onChange={(e) => handleChange('isOutsourced', e.target.value)}>
        <FormControlLabel value="yes" control={<Radio />} label="Yes" />
        <FormControlLabel value="no" control={<Radio />} label="No" />
      </RadioGroup>

      {isOutsourced === 'yes' && (
        <>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>List of Investigations being Outsourced</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name of Investigation</TableCell>
                <TableCell>Lab Name & Address</TableCell>
                <TableCell>NABL Accredited</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outsourcedInvestigations.map((row, i) => (
                <TableRow key={i}>
                  <TableCell><TextField required fullWidth size="small" value={row.name} onChange={(e) => handleArrayChange('outsourcedInvestigations', i, 'name', e.target.value)} /></TableCell>
                  <TableCell><TextField required fullWidth size="small" value={row.lab} onChange={(e) => handleArrayChange('outsourcedInvestigations', i, 'lab', e.target.value)} /></TableCell>
                  <TableCell><TextField required fullWidth size="small" value={row.nabl} onChange={(e) => handleArrayChange('outsourcedInvestigations', i, 'nabl', e.target.value)} /></TableCell>
                  <TableCell>{outsourcedInvestigations.length > 1 && <IconButton onClick={() => deleteArrayRow('outsourcedInvestigations', i)}><DeleteIcon color="error" /></IconButton>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={() => addArrayRow('outsourcedInvestigations', { name: '', lab: '', nabl: '' })} variant="outlined" sx={{ mt: 2 }}>+ Add Row</Button>
        </>
      )}
    </Box>
  );
};

export default Industry_Funding;
