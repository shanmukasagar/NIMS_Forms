import React from 'react';
import { Box, Typography, Divider, Stack, Paper } from '@mui/material';

const FundedStudyPreview = ({ data }) => {
  const {
    fundingAgency, grantPerPatient, manpowerGrant, totalGrant,
    nimsInvestigations, isOutsourced, outsourcedInvestigations
  } = data;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>🔍 Funded Study Summary</Typography>
      <Stack spacing={1}>
        <Typography><b>Funding Agency:</b> {fundingAgency}</Typography>
        <Typography><b>Grant per Patient:</b> ₹{grantPerPatient}</Typography>
        <Typography><b>Manpower Grant:</b> ₹{manpowerGrant}</Typography>
        <Typography><b>Total Grant:</b> ₹{totalGrant}</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" color="primary">🧪 NIMS Investigations</Typography>
        {nimsInvestigations.map((item, i) => (
          <Typography key={i}>{i + 1}. {item.name} – ₹{item.cost}</Typography>
        ))}

        {isOutsourced === 'yes' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" color="primary">📦 Outsourced Investigations</Typography>
            {outsourcedInvestigations.map((item, i) => (
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

export default FundedStudyPreview;
