import React from 'react';
import { Box, Typography, Divider, Stack, Paper } from '@mui/material';

const SelfFundingPreview = ({ data }) => {
  const { proposedBudget, costPerPatient, totalProjectCost, nimsInvestigations, isOutsourced, 
    outsourcedInvestigations } = data;

  const {proposed_budget, cost_per_patient, 
            total_project_cost, nims_investigations, is_outsourced, outsourced_investigations,} = data

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>🔍 Self-Funded Study Summary</Typography>
      <Stack spacing={1}>
        <Typography><b>Proposed Budget:</b> ₹{proposedBudget || proposed_budget}</Typography>
        <Typography><b>Cost Per Patient:</b> ₹{costPerPatient || cost_per_patient}</Typography>
        <Typography><b>Total Project Cost:</b> ₹{totalProjectCost || total_project_cost}</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" color="primary">🧪 NIMS Investigations</Typography>
        {(nimsInvestigations || nims_investigations).map((item, i) => (
          <Typography key={i}>{i + 1}. {item.name} – ₹{item.cost}</Typography>
        ))}

        {(isOutsourced || is_outsourced) === 'yes' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" color="primary">📦 Outsourced Investigations</Typography>
            {(outsourcedInvestigations || outsourced_investigations).map((item, i) => (
              <Box key={i} sx={{ ml: 2 }}>
                <Typography>{i + 1}. {item.name}</Typography>
                <Typography variant="body2">Cost: ₹{item.cost}</Typography>
                <Typography variant="body2">Lab: {item.lab}</Typography>
                <Typography variant="body2">NABL: {item.nabl}</Typography>
              </Box>
            ))}
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default SelfFundingPreview;
