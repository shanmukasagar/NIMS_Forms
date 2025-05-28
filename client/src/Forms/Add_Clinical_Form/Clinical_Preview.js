import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Grid, Divider, Box } from '@mui/material';

const formatKey = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const isIsoDateString = (value) =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  if (isIsoDateString(value)) {
    const date = new Date(value);
    // Format date like: YYYY-MM-DD HH:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return value;
};



const renderFields = (data) => (
  <Grid container spacing={1} direction="column" >
    {Object.entries(data).map(([key, value]) => {
      if (key !== "id" && key !== "form_id" && key !== "type") {
        return (
          <Grid item xs={12} key={key}>
            <Box sx={{ display: "flex" }}>
              <Typography sx={{ color: 'gray', fontWeight: 600, width: "200px" }}>
                {formatKey(key)}:
              </Typography>
              <Typography>{formatValue(value)}</Typography>
            </Box>
          </Grid>
        );
      }
      return null;
    })}
  </Grid>
);

const renderSection = (title, data) => {
  if (!data || Object.keys(data).length === 0) return null; // don't render empty sections
  return (
    <Grid item xs={12} sx={{ mb: 4 }}>
      <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>{title}</Typography>
      <Divider sx={{ mb: 2 }} />
      {renderFields(data)}
    </Grid>
  );
};

const PreviewPopup = ({ open, onClose, formData = {} }) => {
  const {
    administration = {},
    researchers = [],
    participants = {},
    benefits = {},
    paymentState = {},
    storage = {},
    additional = {},
    checkListData = []
  } = formData;

 const isPrincipal = r => r.role === 'principal' || r.type === 'principal';
  const isGuide = r => r.role === 'guide' || r.type === 'guide';
  const isCoInvestigator = r => r.role === 'co-investigator' || r.type === 'co-investigator';

  const principal = researchers.find(isPrincipal);
  const guide = researchers.find(isGuide);
  const coInvestigators = researchers.filter(isCoInvestigator);


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Form Preview</Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ maxHeight: '75vh' }}>
        <Grid container spacing={2} direction="column">
          {/* Administration */}
          {renderSection("1. Administrative Details", administration)}

          {/* Researchers */}
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>2. Researchers</Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Principal */}
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              <strong>Principal Investigator</strong>
            </Typography>
            {principal ? renderFields(principal) : <Typography>No Principal Investigator Provided</Typography>}

            {/* Guide */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              <strong>Guide</strong>
            </Typography>
            {guide ? renderFields(guide) : <Typography>No Guide Provided</Typography>}

            {/* Co-Investigators */}
            {coInvestigators.length > 0 && (
              <>
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                  <strong>Co-Investigators</strong>
                </Typography>
                {coInvestigators.map((co) => (
                  <Grid
                    container
                    spacing={1}
                    key={co.id || co.name || Math.random()} // better key if possible
                    sx={{ pl: 2, mb: 1 }}
                    direction="column"
                  >
                    <Typography>{`Co-Investigator`}</Typography>
                    {renderFields(co)}
                  </Grid>
                ))}
              </>
            )}
          </Grid>

          {/* Participants */}
          {renderSection("3. Participants", participants)}

          {/* Benefits & Risks */}
          {renderSection("4. Benefits & Risks", benefits)}

          {/* Payment & Compensation */}
          {renderSection("5. Payment & Compensation", paymentState)}

          {/* Storage & Confidentiality */}
          {renderSection("6. Storage & Confidentiality", storage)}

          {/* Additional Info */}
          {renderSection("7. Additional Information", additional)}

          {/* Checklist */}
          {checkListData.length > 0 && (
            <Grid item xs={12}>
              <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>CheckList</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ width: "300px" }}>Label</Typography>
                  <Typography sx={{ width: "50px" }}>Status</Typography>
                  <Typography sx={{ width: "100px" }}>Enclosure No</Typography>
                  <Typography sx={{ width: "150px" }}>Remarks</Typography>
                </Box>
                {checkListData.map((item, ind) => (
                  <Box key={ind} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ width: "300px", color: "gray" }}>{item.label || '-'}</Typography>
                    <Typography sx={{ width: "50px" }}>{item.status || '-'}</Typography>
                    <Typography sx={{ width: "100px" }}>{item.enclosureNo || '-'}</Typography>
                    <Typography sx={{ width: "150px" }}>{item.remarks || '-'}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(PreviewPopup);
