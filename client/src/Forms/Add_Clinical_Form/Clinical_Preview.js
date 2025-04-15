import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Grid, Divider, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const formatKey = (key) => {
    return key
        .replace(/_/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, l => l.toUpperCase());
};

const renderFields = (data) => (
    <Grid container spacing={1} sx = {{display : "flex", flexDirection : "column", gap : "15px"}}>
        {Object.entries(data).map(([key, value]) => (
            <Grid item xs={12} key={key}>
                <Box sx = {{display : "flex"}}>
                    <Typography sx={{ color: 'gray', fontWeight: 600, width : "200px"}}>{formatKey(key)}:</Typography>{' '}
                    <Typography>{value || '-'}</Typography>
                </Box>
            </Grid>
        ))}
    </Grid>
);

const renderSection = (title, data) => (
    <Grid item xs={12} sx={{ mb: 4 }}>
        <Typography sx = {{fontSize : "20px", fontWeight : "600"}}>{title}</Typography>
        <Divider sx={{ mb: 2 }} />
        {renderFields(data)}
    </Grid>
);

const PreviewPopup = ({ open, onClose, formData }) => {
    const { administration, researchers, participants, benefits, paymentState, storage,
        additional, checkListData } = formData;

    const { principal, coInvestigators } = researchers.investigators;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Form Preview</Typography>
            </DialogTitle>
            <DialogContent dividers sx={{ maxHeight: '75vh' }}>
                <Grid container spacing={2} sx = {{display : "flex", flexDirection : "column"}}>
                    {/* Administration */}
                    {renderSection("1. Administrative Details", administration)}

                    {/* Researchers */}
                    <Grid item xs={12} sx={{ mb: 4 }}>
                        <Typography sx = {{fontSize : "20px", fontWeight : "600"}}>2. Researchers</Typography>
                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            <strong>Principal Investigator</strong>
                        </Typography>
                        {renderFields(principal)}

                        {coInvestigators.length > 0 && (
                        <React.Fragment>
                            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}><strong>Co-Investigators</strong></Typography>
                            {coInvestigators.map((co, idx) => (
                            <Grid container spacing={1} key={idx} sx={{ pl: 2, mb: 1, display : "flex", flexDirection : "column" }}>
                                <Typography>{`co-investigator ${idx+1}`}</Typography>
                                {Object.entries(co).map(([key, value]) => (
                                <Grid item xs={12} key={key}>
                                    <Box sx = {{display : "flex"}}>
                                        <Typography sx={{ color: 'gray', fontWeight: 600, width : "200px"}}>{formatKey(key)}:</Typography>{' '}
                                        <Typography>{value || '-'}</Typography>
                                    </Box>
                                </Grid>
                                ))}
                            </Grid>
                            ))}
                        </React.Fragment>
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
                    <Grid item xs = {12}>
                        <Typography sx = {{fontSize : "20px", fontWeight : "600"}}>CheckList</Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>
                    <Box sx = {{display : "flex", flexDirection : "column", gap : "15px"}}>
                        <Box sx = {{display : "flex", justifyContent : "space-between"}}>
                            <Typography sx = {{width : "300px"}}>Label</Typography>
                            <Typography sx = {{width : "50px"}}>Status</Typography>
                            <Typography sx = {{width : "100px"}}>Enclosure No</Typography>
                            <Typography sx = {{width : "150px"}} >Remarks</Typography>
                        </Box>
                        {checkListData.map((item, ind) => (
                            <Box key = {ind} sx = {{display : "flex", justifyContent : "space-between"}}>
                                <Typography sx = {{width : "300px", color : "gray"}}>{item.label || '-'}</Typography>
                                <Typography sx = {{width : "50px"}}>{item.status || '-'}</Typography>
                                <Typography sx = {{width : "100px"}}>{item.enclosureNo || '-'}</Typography>
                                <Typography sx = {{width : "150px"}} >{item.remarks || '-'}</Typography>
                            </Box>
                        ))}
                    </Box>
                    
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default PreviewPopup;
