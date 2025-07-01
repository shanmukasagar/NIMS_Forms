import React from 'react';
import { Box, Typography, Divider, Stack, Paper } from '@mui/material';

const IndustryFundingPreview = ({ data }) => {
  const {
    sponsorName, sponsorPAN, sponsorGST, totalGrant,
    budgetItems, nimsInvestigations, personnel,
    isOutsourced, outsourcedInvestigations
  } = data;

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>🔍 Industry Sponsored Study Summary</Typography>
      <Stack spacing={1}>
        <Typography><b>Sponsor Name:</b> {sponsorName}</Typography>
        <Typography><b>PAN:</b> {sponsorPAN}</Typography>
        <Typography><b>GST:</b> {sponsorGST}</Typography>
        <Typography><b>Total Grant:</b> ₹{totalGrant}</Typography>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" color="primary">💰 Budget Breakdown</Typography>
        {budgetItems.map((item, i) => (
          <Typography key={i}>{item.label}: ₹{item.value}</Typography>
        ))}

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" color="primary">🧪 NIMS Investigations</Typography>
        {nimsInvestigations.map((item, i) => (
          <Typography key={i}>{i + 1}. {item.name} – ₹{item.cost}</Typography>
        ))}

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" color="primary">👥 Personnel Details</Typography>
        {personnel.map((p, i) => (
          <Typography key={i}>{p.designation} – ₹{p.fees}</Typography>
        ))}

        {isOutsourced === 'yes' && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" color="primary">📦 Outsourced Investigations</Typography>
            {outsourcedInvestigations.map((item, i) => (
              <Box key={i} sx={{ ml: 2 }}>
                <Typography>{i + 1}. {item.name}</Typography>
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

export default IndustryFundingPreview;
