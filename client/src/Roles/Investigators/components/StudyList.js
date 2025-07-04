import React, { useState } from "react";
import { Typography, Radio, RadioGroup, FormControlLabel, Button, TextField, Paper, Box } from "@mui/material";

import "../../../styles/Investigators/studylist.css";
import { useNavigate } from "react-router-dom";
import {useProject} from "../../../components/ResearchContext";

const studyOptions = [
  { key: "a", label: "Regulatory clinical trial" },
  { key: "b", label: "Drug/ Device intervention trial- (Academic Clinical Trial) Approved drug for New indication or New dose/route of administration" },
  { key: "c", label: "Bio-availability and Bio-equivalence study" },
  { key: "d", label: "Drug/ Device intervention trial- Already Approved Drug in the same indication/route and dose" },
  { key: "e", label: "Case Control/Cohort studies" },
  { key: "f", label: "Retrospective studies" },
  { key: "g", label: "Cross-sectional studies" },
  { key: "h", label: "Socio-Behavioural" },
  { key: "i", label: "Epidemiological/Public health" },
  { key: "j", label: "Biological sample / Clinical Documentation material (data/document/records)" },
  { key: "k", label: "Biological sample (From Blood bank, tissue banks and left-over clinical sample) that are non-Identifiable" },
  { key: "l", label: "Retrospective study on Clinical Documentation material (data/document/records) that are non-Identifiable" },
  { key: "m", label: "Any other – Specify" },
];

export default function StudyList({setSelectedForm}) {
  const [selected, setSelected] = useState("");
  const [otherText, setOtherText] = useState("");
  const navigate = useNavigate();

  // Context
    const { setProjectId, newProject, setnewProject } = useProject();

  const handleProceed = () => {
    if (["a", "b", "c"].includes(selected)) {
        setSelectedForm('');
       navigate("/addclinicaltrails")
    } else if (["d", "e", "f", "g", "h", "i", "j"].includes(selected)) {
        setSelectedForm('biomedical-1');
        setnewProject(true);
        setProjectId(null);
       navigate("/basic/administrative");
    } else if (["k", "l"].includes(selected)) {
        setSelectedForm('biomedical-2');
        setnewProject(true);
        setProjectId(null);
        navigate("/basic/administrative")
    } else if (selected === "m") {
        alert("For 'Any other', please discuss with SRC.\n" + otherText);
    }
  };

  return (
    <React.Fragment>
        <Box className = "study_main">
            <Typography className = "sub_study_main">Please select the type of study you want to proceed with:</Typography>
            <RadioGroup className = "radio_group_main" value={selected} onChange={e => setSelected(e.target.value)}>
                {studyOptions.map((opt) => (
                    <FormControlLabel key={opt.key} value={opt.key} control={<Radio className="dashboard-radio" />}
                    label={opt.label} className="dashboard-radio-label" />
                ))}
            </RadioGroup>
            {selected === "m" && (
                <TextField label="Please specify" multiline minRows={3} fullWidth value={otherText}
                    onChange={e => setOtherText(e.target.value)} className="dashboard-textfield" />
            )}
            <Button variant="contained" className="button_style" disabled={!selected || (selected === "m" && !otherText.trim())}
                onClick={handleProceed} > Proceed </Button>
        </Box>
    </React.Fragment>
  );
}