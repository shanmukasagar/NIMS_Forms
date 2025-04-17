import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid } from '@mui/material';

import AdministrativeDetails from '../Forms/Add_Clinical_Form/AdministrativeDetails';
import Investigators from '../Forms/Add_Clinical_Form/Investigators';
import Participants from '../Forms/Add_Clinical_Form/Participants';
import BenefitsAndRisks from '../Forms/Add_Clinical_Form/BenefitsAndRisks';
import PaymentCompensation from '../Forms/Add_Clinical_Form/PaymentCompensation';
import StorageAndConfidentiality from '../Forms/Add_Clinical_Form/StorageAndConfidentiality';
import AdditionalInformation from "../Forms/Add_Clinical_Form/AdditionalDetails";
import Checklist from '../Forms/Add_Clinical_Form/Checklist';
import PreviewPopup from "../Forms/Add_Clinical_Form/Clinical_Preview";

import axios from 'axios';
import "../styles/Forms/Add_Clinical.css";
import {checklist, InvestigatorsInformation} from "../data/Clinical_CheckList";
import { useNavigate } from 'react-router-dom';

const MainContent = ({user}) => {

  const navigate = useNavigate(); //Handle navigation
  const [openPreview, setOpenPreview] = useState(false);

  //Administration State
  const [administration, setAdministration] = useState({ name: "", department: "", submissionDate: "",
     reviewType: "", studyTitle: "", shortTitle: "", protocol: "", version: "", Date: "" });

  //Investigators State
  const [researchers, setResearchers] = useState(InvestigatorsInformation);

  //Participants State
  const [participants, setParticipants] = useState({ participantType: "", Justification: "", safeguards: "",
    reimbursement: "", reimbursementDetails: "" }); 


  //Benefits State
  const [benefits, setBenefits] = useState({ any_risk : "", risk_details : "", risk_strategy : "", participant_benefits : "",
    social_benefits : "", science_benefits : "", adv_details : ""
  });

  //Payment State
  const [paymentState, setPaymentState] = useState({ injury_treatment : "", SAE_compensation : "",
    approval : "", approval_details : ""});

  //Stoarge and confidentiality state
  const [storage, setStorage] = useState({ docs_control : "", docs_details : "",
     drugs_control : "", drugs_details : ""  });

  //Additional information state
  const [additional, setAdditional] = useState({ any_additional : "", additional_info : ""});

  //Check list state
  const [checkListData, setCheckListData] = useState(checklist);

  const handleSubmit = async(e) => { //Handle Submit
    e.preventDefault();
    try{
      const formData = {administration, researchers, participants, benefits, paymentState, storage,
        additional, checkListData, email : user };
      const response = await axios.post("http://localhost:4000/api/clinical/add", formData, { withCredentials: true });
      if(response.status === 200) {
        alert("Form submitted successfully");
        return;
      }
    }
    catch(error) {
      console.error('Error submitting form:', error);
      if (error.response.data && error.response.data.error === "Token Error" ) {
        alert("Login is necessary");
        navigate('/register')
        return ;
      }
      else{
        alert("form submission failed");
        return;
      }
    }
  }

  //Button style
  const buttonStyle = {
    color: 'white',
    backgroundColor: '#4b1d77',
    fontSize: '18px',
    fontWeight: 500,
    width: '200px',
    borderRadius: '10px',
    cursor: 'pointer'
  };

  return (
    <React.Fragment>
      {user && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx = {{display : "flex", flexDirection : "column", gap : "60px"}}>
              <Grid item size={12} className="content-box" id="AdministrativeDetails">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Administrative Details</Typography>
                  <AdministrativeDetails administration = {administration}  setAdministration = {setAdministration}/>
              </Grid>
              <Grid item size={12} className="content-box" id="Investigators">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Investigators</Typography>
                  <Investigators researchers = {researchers} setResearchers = {setResearchers} />
              </Grid>
              <Grid item size={12} className="content-box" id="Participants">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Participants</Typography>
                  <Participants setParticipants = {setParticipants} participants = {participants} />
              </Grid>
              <Grid item size={12} className="content-box" id="BenefitsAndRisks">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Benefits And Risks</Typography>
                  <BenefitsAndRisks  benefits = {benefits} setBenefits = {setBenefits} />
              </Grid>
              <Grid item size={12} className="content-box" id="PaymentCompensation">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Payment Compensation</Typography>
                  <PaymentCompensation paymentState = {paymentState} setPaymentState = {setPaymentState}  />
              </Grid>
              <Grid item size={12} className="content-box" id="StorageAndConfidentiality">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Storage And Confidentiality</Typography>
                  <StorageAndConfidentiality storage = {storage} setStorage = {setStorage}/>
              </Grid>
              <Grid item size={12} className="content-box" id="StorageAndConfidentiality">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Additional Information</Typography>
                  <AdditionalInformation additional = {additional} setAdditional = {setAdditional} />
              </Grid>
              <Grid item size={12} className="content-box" id="Checklist">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Checklist</Typography>
                  <Checklist checkListData = {checkListData} setCheckListData = {setCheckListData} />
              </Grid>
              <Grid item size={12} sx={{ display: "flex", justifyContent:"center", gap : "40px"}}>
                <Button onClick={() => setOpenPreview(true)} sx={buttonStyle}>Preview</Button>
                <Button type="submit" variant="contained" color="primary" sx={buttonStyle}>Submit</Button>
              </Grid>
              <PreviewPopup open={openPreview} onClose={() => setOpenPreview(false)}
                formData={{ administration, researchers, participants, benefits, paymentState, storage, additional, checkListData }}
              />
          </Grid>
        </form>
      )}
    </React.Fragment>
  );
};

export default React.memo(MainContent);
