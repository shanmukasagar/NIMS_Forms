import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';

const FundingDetails = ({ fundingData, setFundingData, funding_FormData, setFundingFormData, 
    fundingTableName, setFundingTableName  }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === "funding_source") {
            if(value === "Self-funding") {
                setFundingFormData({
                    proposedBudget: '', costPerPatient: '', totalProjectCost: '', isOutsourced: 'no',
                    nimsInvestigations: [{ name: '', cost: '' }],
                    outsourcedInvestigations: [{ name: '', cost: '', lab: '', nabl: '' }]
                });
                setFundingTableName("clinical_self_funding");
            }
            else if(value === "Pharmaceutical Industry sponsored") {
                setFundingFormData({
                    sponsorName: '', sponsorPAN: '', sponsorGST: '', totalGrant: '',
                    budgetItems: [
                    { label: 'Per completed patients total sponsor grant', value: '' },
                    { label: 'Per completed patients manpower sponsor grant (PI, Co-PI, coordinator, others)', value: '' },
                    { label: 'Per completed patients overhead', value: '' },
                    { label: 'Startup fee', value: '' },
                    { label: 'Archival fee', value: '' }
                    ],
                    nimsInvestigations: [{ name: '', cost: '' }],
                    personnel: [{ designation: '', fees: '' }],
                    isOutsourced: 'no',
                    outsourcedInvestigations: [{ name: '', lab: '', nabl: '' }]
                });
                setFundingTableName("clinical_industry_funding");
            }
            else if(value === "Institutional funding" || value === "Funding agency") {
                setFundingFormData({
                    fundingAgency: '', grantPerPatient: '', manpowerGrant: '', totalGrant: '',
                    nimsInvestigations: [{ name: '', cost: '' }],
                    isOutsourced: 'no',
                    outsourcedInvestigations: [{ name: '', cost: '', lab: '', nabl: '' }]
                });
                setFundingTableName("clinical_funding_studies");
            }
        }
        setFundingData({ ...fundingData, [name]: value });
    };

    return (
        <Grid container spacing={2}>
            <Grid item size={6}>
                <TextField fullWidth required label="Total Estimated Budget for Site" variant="outlined" name="estimated_budget" value={fundingData?.estimated_budget || ""}
                    onChange={handleChange} type = "number" />
            </Grid>
            <Grid item size={6}>
                <FormControl fullWidth required>
                    <InputLabel>Funding Source</InputLabel>
                    <Select label="Funding Source" name="funding_source" value={fundingData?.funding_source || ""} onChange={handleChange} >
                        <MenuItem value="Self-funding">Self-funding</MenuItem>
                        <MenuItem value="Institutional funding">Institutional funding</MenuItem>
                        <MenuItem value="Funding agency">Funding agency</MenuItem>
                        <MenuItem value="Pharmaceutical Industry sponsored">Pharmaceutical Industry sponsored</MenuItem>
                        <MenuItem value="Others">Others (specify)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            {fundingData.funding_source === "Others" && (
                <Grid item size={12}>
                    <TextField fullWidth multiline minRows={3} required  label="Specify Other Funding Source"  variant="outlined" name="other_funding_details"
                        value={fundingData?.other_funding_details || ""} onChange={handleChange}  />
                </Grid>
            )}
        </Grid>
    );
};

export default React.memo(FundingDetails);
