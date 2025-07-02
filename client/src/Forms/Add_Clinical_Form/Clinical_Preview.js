import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Grid, Divider, Box } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { IconButton, Tooltip } from '@mui/material';
import SelfFundingPreview from "../../Forms/Funding_Forms/Self_Funding_Preview.js";
import FundingStudiesPreview from "../../Forms/Funding_Forms/Funding_Studies_Preview.js";
import IndustryFundingPreview from "../../Forms/Funding_Forms/Industry_Funding_Preview.js";

const formatKey = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, l => l.toUpperCase());
};

const fieldNames = ["pi_signature", "co1_signature", "co2_signature", "co3_signature"];

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
      if (key !== "id" && key !== "form_id" && key !== "type" && key !== "approved" && key !== "approval_token") {
        return (
          <Grid item xs={12} key={key}>
            {
              key !== "email" ? (
              <Box sx={{ display: "flex" }}>
                <Typography sx={{ color: 'gray', fontWeight: 600, width: "200px" }}>
                  {formatKey(key)}:
                </Typography>
                <Typography>{formatValue(value)}</Typography>
              </Box>
            ) : null}
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
    investigatorsCount = {},
    fundingData = {},
    overviewResearch = {},
    methodologyData = {},
    participants = {},
    benefits = {},
    consentData = {},
    paymentState = {},
    storage = {},
    additional = {},
    declaration = {},
    checkListData = []
  } = formData;

  const isPrincipal = r => r.role === 'principal' || r.type === 'principal';
  const isGuide = r => r.role === 'guide' || r.type === 'guide';
  const isHOD = r => r.role === 'hod' || r.type === 'hod';
  const isCoInvestigator = r => r.role === 'co-investigator' || r.type === 'co-investigator';

  const principal = researchers.find(isPrincipal);
  const guide = researchers.find(isGuide);
  const coInvestigators = researchers.filter(isCoInvestigator);
  const hod = researchers.find(isHOD);


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
            {/* HOD */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
              <strong>HOD</strong>
            </Typography>
            {hod ? renderFields(hod) : <Typography>No Hod Provided</Typography>}

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
          {/* Investigators count */}
          {renderSection("2. Investigator Counts", investigatorsCount)}

          {/* Funding Data */}
          {renderSection("3. Funding Details", fundingData)}

          {fundingData?.funding_source === "Self-funding" && (
            <SelfFundingPreview data = {formData?.funding_FormData}/>
          )}
          {fundingData?.funding_source === "Pharmaceutical Industry sponsored" && (
            <IndustryFundingPreview data = {formData?.funding_FormData}/>
          )}
          {fundingData?.funding_source === "Institutional funding" && (
            <FundingStudiesPreview data = {formData?.funding_FormData}/>
          )}
          {fundingData?.funding_source === "Funding agency" && (
            <FundingStudiesPreview data = {formData?.funding_FormData}/>
          )}

          {/* Overview Research */}
          {renderSection("4. Overview Research", overviewResearch)}

          {/* Methodology */}
          {renderSection("5. Methodology", methodologyData)}

          {/* Participants */}
          {renderSection("6. Participants", participants)}

          {/* Benefits & Risks */}
          {renderSection("7. Benefits & Risks", benefits)}

          {/* Informed Consent */}
          {renderSection("8. Informed Consent", consentData)}


          {/* Payment & Compensation */}
          {renderSection("9. Payment & Compensation", paymentState)}

          {/* Storage & Confidentiality */}
          {renderSection("10. Storage & Confidentiality", storage)}

          {/* Additional Info */}
          {renderSection("11. Additional Information", additional)}

          {/* Declaration */}
          {renderSection("12. Declaration", declaration)}

          {/* Checklist */}
          {checkListData.length > 0 && (
            <Grid item xs={12}>
              <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>CheckList</Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>S.NO</Typography>
                  <Typography sx = {{ width : "600px"}}>Label</Typography>
                  <Typography>Uploaded files</Typography>
                </Box>
                {checkListData.map((item, ind) => (
                  <Box key={ind} sx={{ display: "flex", gap : "100px" }}>
                    <Typography sx={{ color: "gray" }}>{ind + 1}</Typography>
                    <Typography sx={{ width: "600px", color: "gray" }}>{item.label || '-'}</Typography>
                    {item.file ? (
                      <Tooltip title="View uploaded PDF">
                        <IconButton
                          onClick={() => {
                            const fileURL = URL.createObjectURL(item.file);
                            window.open(fileURL, "_blank");
                          }}
                        >
                          <PictureAsPdfIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    ) : item.file_name && (
                        <Tooltip title="View uploaded PDF">
                          <IconButton
                            onClick={() => window.open(`http://localhost:4000/media/clinical/checklist/${item.file_name}`, "_blank")}
                          >
                            <PictureAsPdfIcon color="error" />
                          </IconButton>
                        </Tooltip>
                    )}
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
