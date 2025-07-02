import React from "react";
import { Box, Typography, Button, Divider, Paper } from "@mui/material";
import SelfFundingPreview from "../../Funding_Forms/Self_Funding_Preview";
import FundingStudyPreview from "../../Funding_Forms/Funding_Studies_Preview";
import IndustryFundingPreview from "../../Funding_Forms/Industry_Funding_Preview";

const FundingSummaryCard = ({ data, setOpenTable, setEditableData }) => {
  const handleEdit = () => {
    setOpenTable(false);
    setEditableData(data[0]);
  };

  if (!data?.length) return null;
  const entry = data[0];

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", my: 4 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Funding Details Summary
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={500}>Total Estimated Budget:</Typography>
        <Typography variant="body1">₹ {entry.total_estimated_budget || "—"}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={500}>Funding Source:</Typography>
        <Typography variant="body1">{entry.funding_source || "—"}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={500}>Email:</Typography>
        <Typography variant="body1">{entry.email || "—"}</Typography>
      </Box>

      {/* Conditionally render preview based on source */}
      {entry.funding_source === "self-funding" && (
        <Box sx={{ mt: 4 }}>
          <SelfFundingPreview data={entry.funding_FormData} />
        </Box>
      )}
      {(entry.funding_source === "institutional" || entry.funding_source === "agency") && (
        <Box sx={{ mt: 4 }}>
          <FundingStudyPreview data={entry.funding_FormData} />
        </Box>
      )}
      {entry.funding_source === "Pharmaceutical Industry sponsored" && (
        <Box sx={{ mt: 4 }}>
          <IndustryFundingPreview data={entry.funding_FormData} />
        </Box>
      )}

      {/* Edit Button */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button variant="contained" color="secondary" onClick={handleEdit}>Edit</Button>
      </Box>
    </Paper>
  );
};

export default FundingSummaryCard;
