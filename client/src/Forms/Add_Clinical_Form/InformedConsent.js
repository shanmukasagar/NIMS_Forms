import React from 'react';
import { Grid, TextField, Select, MenuItem, InputLabel, FormControl, Box, Typography } from '@mui/material';

const pisElementsList = [
    "Statement that study involves research and explain purpose of research",
    "Statement that consent and participation is voluntary",
    "Expected Risks and benefits to the study subject",
    "Alternatives procedures / therapies available",
    "Description of procedures to be followed",
    "Treatment schedule and random assignment of treatment (for RCT)",
    "Right to withdraw from study at any time",
    "Maintenance of Confidentiality",
    "Contact information of PI and Member Secretary of EC",
    "Expected duration of participation",
    "Anticipated prorated payment if any",
    "Responsibility of subject",
    "Financial compensation and medical management in SAE",
    "Statement that placebo shall not have any therapeutic effect (if placebo controlled trial)",
    "Others specify"
];

const languageOptions = ["Telugu", "Hindi", "Urdu", "Other"];

const ConsentDetails = ({ consentData, setConsentData, checkListData, setCheckListData }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConsentData({ ...consentData, [name]: value });
        if(name === "waiver_consent") {
            let updatedChecklist = checkListData.filter(item => item.id <= 18);
            if(value === "Yes")  {
                updatedChecklist = updatedChecklist.map(item =>
                    item.id === 12 ? { ...item, required: false } : item
                );
            }
            else {
                updatedChecklist = updatedChecklist.map(item =>
                    item.id === 12 ? { ...item, required: true } : item
                );
            }
            setCheckListData(updatedChecklist);
        }
    };

    const handleCheckboxChange = (value) => {
        const selected = consentData.translated_languages || [];
        const updated = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];

        if(consentData.waiver_consent && consentData.waiver_consent !== "Yes") {
            let updatedChecklist = checkListData.filter(item => ( item.id <= 18 || item.label_id <= 18 ));
            let uniqueId = 100;
            const extraUploads = updated?.flatMap((lang) => [
                {
                    id: uniqueId++,
                    label: `Participant Information Sheet (PIS) and Informed Consent Form (ICF) - ${lang}`,
                    required: true,
                },
                {
                    id: uniqueId++,
                    label: `Translation Certificate - ${lang}`,
                    required: true,
                }
                ]) || [];
            updatedChecklist = [...updatedChecklist, ...extraUploads];
            setCheckListData(updatedChecklist);
            
        }
        setConsentData({ ...consentData, translated_languages: updated });

    };

    const handlePISElementsList = (value) => {
        const selected = consentData.pis_elements || [];
        const updated = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];
        setConsentData({ ...consentData, pis_elements: updated });
    };

    const handleLanguageDetailChange = (lang, field, value) => {
        setConsentData((prev) => ({
            ...prev,
            languageDetails: {
            ...prev.languageDetails,
            [lang]: {
                ...prev.languageDetails?.[lang],
                [field]: value,
            },
            },
        }));
    };

    //Handle consent checkbox change
    const handleWaiverCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setConsentData((prev) => {
            const currentReasons = Array.isArray(prev.reason_for_waiver) ? prev.reason_for_waiver : [];
            return {
            ...prev,
            reason_for_waiver: checked
                ? [...currentReasons, value]
                : currentReasons.filter((item) => item !== value),
            };
        });
    };


    //handle waiver other reason change
    const handleOtherReasonChange = (e) => {
        const { name, value } = e.target;
        setConsentData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };



    return (
        <Grid container spacing={2}>
            {/* Waiver of Consent */}
            <Grid item size={4}>
                <FormControl fullWidth required>
                    <InputLabel>Are you seeking waiver of consent?</InputLabel>
                    <Select
                        label="Are you seeking waiver of consent?"
                        name="waiver_consent"
                        value={consentData.waiver_consent || ''}
                        onChange={handleChange}
                    >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item size = {12}>
                <Typography>If yes, fill the waiver of consent form</Typography>
            </Grid>
            {/* Show waiver form if "Yes" is selected */}
            {consentData.waiver_consent === "Yes" && (
                <Grid item xs={12}>
                <h3 className="h2">
                    4. Reason for waiver of informed consent: (Please tick as applicable)
                </h3>
                <div className="h2" style = {{display : "flex", flexDirection : "column", gap : "15px"}}>
                    {[
                    "research cannot practically be carried out without the waiver and the waiver is scientifically justified",
                    "retrospective studies, where the participants are de-identified or cannot be contacted",
                    "research on anonymized biological samples/data",
                    "certain types of public health studies/surveillance programmes/programme evaluation studies",
                    "research on data available in the public domain",
                    "research during humanitarian emergencies and disasters, when the participant may not be in a position to give consent."
                    ].map((item, index) => (
                    <label key={index}>
                        <input type="checkbox" value={item} checked={(consentData.reason_for_waiver || []).includes(item)}
                            onChange={handleWaiverCheckboxChange} style={{ marginRight: "8px" }} />{item}
                    </label>
                    ))}
                </div>

                <h3 className="h2">Any other reason (please specify)</h3>
                <textarea name="other_reason" placeholder="Specify" value={consentData.other_reason} onChange={handleOtherReasonChange} 
                    className="custom-textarea" maxLength={600} required 
                    style={{ width: "100%", minHeight: "100px", padding: "10px", fontSize: "14px", borderRadius: "6px", 
                        border: "1px solid #ccc" }} />
                </Grid>
            )}
            {consentData.waiver_consent === "No" && (
                <React.Fragment>
                <Grid item size = {12}>
                    <Typography>Specify details of english Consent document </Typography>
                </Grid>
                {/* English Consent Document */}
                <Grid item size={4}>
                    <TextField
                        fullWidth
                        label="Version number"
                        variant="outlined"
                        name="english_version_number"
                        value={consentData.english_version_number || ''}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item size={4}>
                    <TextField type = "date" fullWidth label="Date of Participant Information Sheet (PIS)" variant="outlined" name="english_date"
                        value={consentData.english_date || ''} onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        placeholder="Select Date" />
                </Grid>

                {/* Translated Languages - Plain Checkboxes */}
                <Grid item size={12}>
                    <InputLabel sx={{ mb: 1 }}>Languages of Translated PIS/ICF</InputLabel>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {languageOptions.map((item, index) => (
                        <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px',
                            borderRadius: '6px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f9f9f9',
                            transition: 'background-color 0.3s', }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = 'rgba(25,118,210,0.08)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = '#f9f9f9')
                            }
                        >
                            <input type="checkbox" checked={consentData.translated_languages?.includes(item)} 
                                onChange={() => handleCheckboxChange(item)} /> {item} </label>
                        ))}
                    </Box>

                    {/* Show input fields for selected languages */}
                    {consentData.translated_languages?.map((lang) => (
                        <Box key={lang} sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>{lang} Informed Consent Form Details: </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField label={`Version Number`} size="small"
                                    value={consentData.languageDetails?.[lang]?.version || ''}
                                    onChange={(e) => handleLanguageDetailChange(lang, 'version', e.target.value) } />
                                <TextField  type = "date" label={`Date`}   size="small" 
                                    value={consentData.languageDetails?.[lang]?.date || null}
                                    onChange={(e) => handleLanguageDetailChange(lang, 'date', e.target.value)}
                                    InputLabelProps={{ shrink: true }}/>
                            </Box>
                        </Box>
                    ))}
                </Grid>


                {/* Translation Certificates */}
                <Grid item size={4}>
                    <FormControl fullWidth required>
                        <InputLabel>Are certificate(s) of translations provided?</InputLabel>
                        <Select
                            label="Are certificate(s) of translations provided?"
                            name="translation_cert_provided"
                            value={consentData.translation_cert_provided || ''}
                            onChange={handleChange}
                        >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {/* Subject Understanding Tools */}
                <Grid item size={8}>
                    <FormControl fullWidth required>
                        <InputLabel>Will Any tools be used to determine whether the subject understood the study </InputLabel>
                        <Select
                            label="Will Any tools be used to determine whether the subject understood the study "
                            name="understanding_tools"
                            value={consentData.understanding_tools || ''}
                            onChange={handleChange}
                        >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                {consentData.understanding_tools === 'Yes' && (
                    <Grid item size={12}>
                        <TextField
                            fullWidth
                            label="If yes, specify (e.g. Questionnaire, Feedback, Others)"
                            name="understanding_tools_specify"
                            value={consentData.understanding_tools_specify || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                )}

                {/* PIS/ICF Elements - Plain Checkboxes */}
                <Grid item size={12}>
                    <Typography sx={{ mb: 1 }}>Tick the elements contained in the Participant Information Sheet (PIS) and 
                        Informed Consent Form </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", }} > 
                        {pisElementsList.map((element, index) => (
                            <label key={index} style={{ display: "flex", alignItems: "center", gap: "10px",
                            padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc",
                            cursor: "pointer", backgroundColor: "#f9f9f9",  transition: "background-color 0.3s",}}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(25,118,210,0.08)") }
                                onMouseLeave={(e) =>     (e.currentTarget.style.backgroundColor = "#f9f9f9") } >
                            <input
                            type="checkbox"
                            checked={consentData.pis_elements?.includes(element)}
                            onChange={() => handlePISElementsList(element)}
                            style={{
                                width: "18px",
                                height: "18px",
                                accentColor: "#1976d2",
                                cursor: "pointer",
                            }}
                            />
                            {element}
                        </label>
                        ))}
                    </Box>
                </Grid>
            </React.Fragment>
            )}
           
        </Grid>
    );
};

export default React.memo(ConsentDetails);