import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions, } from '@mui/material';

import AdministrativeDetails from '../Forms/Add_Clinical_Form/AdministrativeDetails';
import Investigators from '../Forms/Add_Clinical_Form/Investigators';
import Participants from '../Forms/Add_Clinical_Form/Participants';
import BenefitsAndRisks from '../Forms/Add_Clinical_Form/BenefitsAndRisks';
import PaymentCompensation from '../Forms/Add_Clinical_Form/PaymentCompensation';
import StorageAndConfidentiality from '../Forms/Add_Clinical_Form/StorageAndConfidentiality';
import AdditionalInformation from "../Forms/Add_Clinical_Form/AdditionalDetails";
import Checklist from '../Forms/Add_Clinical_Form/Checklist';
import PreviewPopup from "../Forms/Add_Clinical_Form/Clinical_Preview";
import FundingDetails from '../Forms/Add_Clinical_Form/FundingDetails';
import OverviewResearch from '../Forms/Add_Clinical_Form/OverviewResearch';
import MethodologyDetails from '../Forms/Add_Clinical_Form/Methodology';
import InformedConsent from '../Forms/Add_Clinical_Form/InformedConsent';
import Declaration from "../Forms/Add_Clinical_Form/Declaration";

//Funding
import Self_Funding from "../Forms/Funding_Forms/Self_Funding.js";
import Industry_Funding from "../Forms/Funding_Forms/Industry_Funding.js";
import Funded_Studies from "../Forms/Funding_Forms/Funding_Studies.js";

import "../styles/Forms/Add_Clinical.css";
import {checklist} from "../data/Clinical_CheckList";
import { investigators  } from "../data/Clinical_CheckList";
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from "../components/AxiosInstance";

const MainContent = ({user}) => {

  const navigate = useNavigate(); //Handle navigation
  const [openPreview, setOpenPreview] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const fetchOnce = useRef(false);
  const location = useLocation();
  const initialData = location.state?.initialData || null;
  const [isEdit, setIsEdit] = useState(false);
  const [submittedFormId, setSubmittedFormId] = useState('');

  //Administration State
  const [administration, setAdministration] = useState({ name: "", department: "", submission_date: new Date(),
     review_type: "", study_title: "", short_title: "", protocol: "", version: "", date: "" });

  //Investigators State
  const [researchers, setResearchers] = useState([ 
    { name: "", designation: "", qualification: "", department: "", gmail: "", contact: "", type: "principal", emp_code : "" }, 
    { name: "", designation: "", qualification: "", department: "", gmail: "", contact: "", type: "guide", emp_code : "" }, 
    { name: "", designation: "", qualification: "", department: "", gmail: "", contact: "", type: "hod", emp_code : "" }, 
    { name: "", designation: "", qualification: "", department: "", gmail: "", contact: "", type: "co-investigator", emp_code : "" },
    { name: "", designation: "", qualification: "", department: "", gmail: "", contact: "", type: "co-investigator", emp_code : "" }
  ]);

  const [investigatorsCount, setInvestigatorsCount] = useState({
    pi_count : "", co_pi_count : "", duration : ""
  })

  //Funding details and budget
  const [fundingData, setFundingData] = useState({ estimated_budget: '', funding_source: '', other_funding_details: '', });

  //Overview research
  const [overviewResearch, setOverviewResearch] = useState({ overview_summary: '', study_type: '', other_study_type: '', });

  //Methodology details
  const [methodologyData, setMethodologyData] = useState({ total_sample_size: '', site_participants: '', lab_outsourcing: '', lab_details: '' });

  //Participants State
  const [participants, setParticipants] = useState({ participant_type: "", vulnerable_groups: [], other_participant : "",
    reimbursement: "", reimbursement_details: "", additional_safeguards : "", justification : "" }); 


  //Benefits State
  const [benefits, setBenefits] = useState({ any_risk : "", is_adv : "", risk_details : "", risk_strategy : "", participant_benefits : "",
    social_benefits : "", science_benefits : "", adv_details : "" });

  //Informed consent
  const [consentData, setConsentData] = useState({ waiver_consent: '', english_version_number: '', english_date : null, translated_languages: [],
    translation_cert_provided: '', understanding_tools: '', understanding_tools_specify: '',
    pis_elements: [], languageDetails: {}, reason_for_waiver: [], other_reason: '',});


  //Payment State
  const [paymentState, setPaymentState] = useState({ injury_treatment : "", sae_compensation : "", sae_details : "", injury_details : "",
    approval : "", approval_details : ""});

  //Stoarge and confidentiality state
  const [storage, setStorage] = useState({ docs_control : "", docs_details : "",
     drugs_control : "", drugs_details : ""  });

  //Additional information state
  const [additional, setAdditional] = useState({ any_additional : "", additional_info : ""});

  //Declaration
  const [declaration, setDeclaration] = useState({
    declarations: { checkbox_0: false, checkbox_1: false, checkbox_2: false, checkbox_3: false, checkbox_4: false, checkbox_5: false, checkbox_6: false,
      checkbox_7: false, checkbox_8: false, checkbox_9: false, checkbox_10: false, checkbox_11: false, checkbox_12: false, checkbox_13: false,
    },
    pi_name: "", pi_signature: "", pi_date: null,

    guide_name : "", guide_signature : "", guide_date : null,

    hod_name : "", hod_signature : "", hod_date : null,
    
    co1_name: "", co1_signature: "", co1_date: null,

    co2_name: "", co2_signature: "", co2_date: null,

 });

  //Check list state
  const [checkListData, setCheckListData] = useState(
    [
    { id: 1, label: "Cover letter", required: true },
    { id: 2, label: "Brief CV of all Investigators- Updated, signed and dated", required: true },
    { id: 3, label: "Good Clinical Practice (GCP) training of investigators in last 3 years", required: true },
    { id: 4, label: "EC clearance of other centers", required: false },
    { id: 5, label: "Agreement between collaborating partners", required: false },
    { id: 6, label: "MTA between collaborating partners", required: false },
    { id: 7, label: "Insurance policy / certificate", required: true },
    { id: 8, label: "Copy of CTA signed with the sponsor", required: false },
    { id: 9, label: "Provide all significant previous decisions (e.g. those leading to a negative decision or modified protocol) by other ECs / Regulatory authorities for proposed study (whether in same location or elsewhere) and modification(s) to protocol", required: false},
    { id: 10, label: "Copy of the detailed protocol (clearly identified numbered and dated) and synopsis (summary as far as possible in non-technical language, flowchart, diagrammatic representation of the protocol)", required: true },
    { id: 11, label: "Investigators Brochure (If applicable for drug / biologicals / device trials)", required: true },
    { id: 12, label: "Participant Information Sheet (PIS) and Informed Consent Form (ICF) (English and translated) with version number and dated", required: true },
    { id: 13, label: "Assent form for minors (12-18 years) (English and Translated)", required: false },
    { id: 14, label: "Proforma / Questionnaire / Case Report Forms (CRF) / Interview guides / Guides for Focused Group Discussions (FGDs) (English and translated)", required: true },
    { id: 15, label: "Advertisement / material to recruit participants (fliers, posters, etc.)", required: false },
    { id: 17, label: "DCGI Approval letter", required: false },
    { id: 18, label: "Others specify", required: false }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  //Funding form data
  const [funding_FormData, setFundingFormData] = useState({});
  const [fundingTableName, setFundingTableName] = useState("");

  const handleSubmit = async(e) => { //Handle Submit
    e.preventDefault();
    for(const item of checkListData) {
      if(item.required === true) {
        if(!item.file_name && !item.file) {
          alert(`${item.label} is missing`);
          return;
        }
      }
    }
    setShowConfirmDialog(true);
  }

  const buttonStyle = { //Button style
    color: 'white',
    backgroundColor: '#4b1d77',
    fontSize: '18px',
    fontWeight: 500,
    width: '200px',
    borderRadius: '10px',
    cursor: 'pointer'
  };

  const handleConfirmSubmission = async () => { //Handle conform submission function
    try{
      const formData = new FormData();
      setIsSubmitting(true); // Show loading

      // 2. Construct full object without files
      const submissionData = { administration, researchers, investigatorsCount, fundingData, overviewResearch, methodologyData, participants,
        benefits, consentData, paymentState, storage, additional, declaration, 
        email: user, submittedFormId, funding_FormData, fundingTableName };

      // 3. Append data JSON as a field
      formData.append("data", JSON.stringify(submissionData));

      checkListData.forEach(item => {
        const id = isEdit ? Number(item.label_id) : item.id;
        const label = item.label;

        formData.append(`label_${id}`, label || "");

        if (item.file) {
          formData.append(`file_${id}`, item.file);
        }
        else if (isEdit && item.file_name) {
          formData.append(`existingFile_${id}`, item.file_name);
        }
      });

      const response = await axiosInstance.post("/api/clinical/add", formData, {
        params: { isEdit: isEdit },  headers: { 'Content-Type': 'multipart/form-data' } });
      if(response.status === 200) {
        alert("Form submitted successfully");
        navigate("/investigator");
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
    finally {
      setIsSubmitting(false); // Hide loading
    }
  }

  // Call this function when fetching data
const mergeResearchers = (fetched = []) => {
  const updatedList = [...researchers];
  const used = new Array(fetched.length).fill(false);

  // Map filled data to empty slots with matching type
  for (let i = 0; i < updatedList.length; i++) {
    for (let j = 0; j < fetched.length; j++) {
      if (!used[j] && fetched[j].role === updatedList[i].type) {
        updatedList[i] = { ...updatedList[i], ...fetched[j] };
        used[j] = true;
        break;
      }
    }
  }

  return updatedList;
};

  useEffect(() => { // Set initial form data
    if(initialData && !fetchOnce.current) {
      fetchOnce.current = true;
      setAdministration(initialData.administration || {});
      setParticipants(initialData.participants || {});
      setBenefits(initialData.benefits || {});
      setPaymentState(initialData.paymentState || {});
      setStorage(initialData.storage || {});
      setAdditional(initialData.additional || {});
      setCheckListData(initialData.checkListData || []);
      setSubmittedFormId(initialData.submittedFormId)
      setIsEdit(true);
      setInvestigatorsCount(initialData.investigatorsCount || {});
      setDeclaration(initialData.declaration || {});
      setConsentData(initialData.consentData || {});
      setFundingData(initialData.fundingData || {});
      setOverviewResearch(initialData.overviewResearch || {});
      setMethodologyData(initialData.methodologyData || {});
      setFundingFormData(initialData.funding_FormData || {});
      if(initialData?.fundingData?.funding_source === "Self-funding") {
        setFundingTableName("clinical_self_funding");
      }
      else if(initialData?.fundingData?.funding_source === "Institutional funding") {
        setFundingTableName("clinical_funding_studies");
      }
      else if(initialData?.fundingData?.funding_source === "Funding agency") {
        setFundingTableName("clinical_funding_studies");
      }
      else if(initialData?.fundingData?.funding_source === "Pharmaceutical Industry sponsored") {
        setFundingTableName("clinical_industry_funding");
      }
      if (initialData?.researchers) {
        const merged = mergeResearchers(initialData.researchers);
        setResearchers(merged);
      }
    }
  },[initialData])

  return (
    <React.Fragment>
      {user && (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx = {{display : "flex", flexDirection : "column", gap : "60px"}}>
              <Grid item size={12} className="content-box" id="AdministrativeDetails">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Administrative Details</Typography>
                  <AdministrativeDetails administration = {administration}  setAdministration = {setAdministration} isEdit = {isEdit}/>
              </Grid>
              <Grid item size={12} className="content-box" id="Investigators">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Investigators</Typography>
                  <Investigators researchers = {researchers} setResearchers = {setResearchers} investigatorsCount = {investigatorsCount}
                    setInvestigatorsCount = {setInvestigatorsCount} />
              </Grid>
              <Grid item size={12} className="content-box" id="Funding">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Funding Details and Budget</Typography>
                  <FundingDetails fundingData = {fundingData} setFundingData = {setFundingData}
                    funding_FormData = {funding_FormData} setFundingFormData = {setFundingFormData}
                      fundingTableName = {fundingTableName} setFundingTableName = {setFundingTableName}/>
              </Grid>
              <Grid item size={12} className="content-box" id="research"> 
                { 
                  fundingData.funding_source === "Self-funding" && (
                    <Self_Funding funding_FormData = {funding_FormData} setFundingFormData = {setFundingFormData}/>
                  )
                }
                {
                  fundingData.funding_source === "Pharmaceutical Industry sponsored" && (
                    <Industry_Funding funding_FormData = {funding_FormData} setFundingFormData = {setFundingFormData}/>
                  )
                }
                {(fundingData.funding_source === "Institutional funding" || fundingData.funding_source === "Funding agency") && (
                    <Funded_Studies funding_FormData = {funding_FormData} setFundingFormData = {setFundingFormData}/>
                  )
                }

              </Grid>
              <Grid item size={12} className="content-box" id="research">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Overview Research</Typography>
                  <OverviewResearch overviewResearch = {overviewResearch} setOverviewResearch = {setOverviewResearch}/>
              </Grid>
              <Grid item size={12} className="content-box" id="research">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Methodology</Typography>
                  <MethodologyDetails methodologyData = {methodologyData} setMethodologyData = {setMethodologyData}/>
              </Grid>
              <Grid item size={12} className="content-box" id="Participants">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Participants</Typography>
                  <Participants setParticipants = {setParticipants} participants = {participants} />
              </Grid>
              <Grid item size={12} className="content-box" id="BenefitsAndRisks">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Benefits And Risks</Typography>
                  <BenefitsAndRisks  benefits = {benefits} setBenefits = {setBenefits} />
              </Grid>
              <Grid item size={12} className="content-box" id="InformedConsent">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Informed Consent</Typography>
                  <InformedConsent  consentData = {consentData} setConsentData = {setConsentData}
                      setCheckListData = {setCheckListData} checkListData = {checkListData} />
              </Grid>
              <Grid item size={12} className="content-box" id="PaymentCompensation">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Payment Compensation</Typography>
                  <PaymentCompensation paymentState = {paymentState} setPaymentState = {setPaymentState} isEdit = {isEdit} />
              </Grid>
              <Grid item size={12} className="content-box" id="StorageAndConfidentiality">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Storage And Confidentiality</Typography>
                  <StorageAndConfidentiality storage = {storage} setStorage = {setStorage}/>
              </Grid>
              <Grid item size={12} className="content-box" id="StorageAndConfidentiality">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Additional Information</Typography>
                  <AdditionalInformation additional = {additional} setAdditional = {setAdditional} />
              </Grid>
              <Grid item size={12} className="content-box" id="Declaration">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Declaration</Typography>
                  <Declaration user = {user} researchers = {researchers} declaration = {declaration} setDeclaration = {setDeclaration} isEdit = {isEdit}/>
              </Grid>
              <Grid item size={12} className="content-box" id="Checklist">
                  <Typography sx = {{fontSize : "22px", fontWeight : "600"}}>Checklist</Typography>
                  <Checklist consentData = {consentData} checkListData = {checkListData} setCheckListData = {setCheckListData} isEdit = {isEdit}/>
              </Grid>
              <Grid item size={12} sx={{ display: "flex", justifyContent:"center", gap : "40px"}}>
                <Button onClick={() => setOpenPreview(true)} sx={buttonStyle}>Preview</Button>
                <Button type="submit" variant="contained" color="primary" sx={buttonStyle}>Submit</Button>
              </Grid>
              <PreviewPopup open={openPreview} onClose={() => setOpenPreview(false)}
                formData={{ administration, researchers, investigatorsCount, fundingData, overviewResearch, methodologyData, participants, benefits, consentData, 
                    paymentState, storage, additional, declaration, checkListData, funding_FormData }}
              />
          </Grid>
        </form>
      )}
      { showConfirmDialog && (
        <React.Fragment>
          <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}
              PaperProps={{ 
                sx: { width: '500px', height: '200px', }, }}>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogContent>Are you sure once submitted you can not modify or edit?</DialogContent>
            <DialogActions sx = {{ display : "flex", justifyContent : "space-around"}}>
              <Button sx={buttonStyle} onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting} >Cancel</Button>
              <Button sx={buttonStyle} onClick={handleConfirmSubmission} autoFocus disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Confirm"}</Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default React.memo(MainContent);
