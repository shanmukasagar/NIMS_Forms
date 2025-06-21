import React from 'react';
import { Box, TextField, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';

const FundingDetails = ({ fundingData, setFundingData }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFundingData({ ...fundingData, [name]: value });
    };

    return (
        <Grid container spacing={2}>
            <Grid item size={6}>
                <TextField fullWidth required label="Total Estimated Budget for Site" variant="outlined" name="estimated_budget" value={fundingData?.estimated_budget || ""}
                    onChange={handleChange} />
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
