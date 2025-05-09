import React,{useState, useEffect, useRef} from 'react';
import FormComponent from '../../components/FormComponent';
import {getSubmittedData} from "./NIEC_Config";
import NIEC_Form_Preview from './NIEC_Form_Preview';
const formFields = [
    { name: 'niec_reg_no', label: 'NIEC Registration No', type: 'text' ,required:true },
    { name: 'protocol_no', label: 'Study/Protocol No', type: 'text' ,required:true },
    { name: 'project_title', label: 'Title of project', type: 'text' ,required:true},
    { name: 'pi_name', label: 'Principal Investigator', type: 'text' ,required:true},
    { name: 'sae_onset_date', label: 'Date of onset of SAE:', type: 'date' ,required:true},
    { name: 'report_date', label: 'Report date:', type: 'date' ,required:true},
    { name: 'report_type', label: 'Report type', type: 'select', options: ['Initial', 'Follow-up', 'Final'], required:true},
    { name: 'subject_id', label: 'Subject Initials and Subject ID', type: 'text', required:true},
    { name: 'subject_age', label: 'Age', type: 'text' ,required:true},
    { name: 'subject_gender', label: 'Gender:', type: 'text',required:true },
    { name: 'sae_description', label: 'Describe the SAE in detail (if this is a follow-up report, include follow-up information only):', type: 'textarea',required:false },
    { name: 'treatment_provided', label: 'Describe the medical treatment provided (if any) to the research subject', type: 'textarea' ,required:true},
    { name: 'cost_bearer', label: 'If there was a research-related injury/hospitalization, the cost of treatment/hospitalization was borne by:', type: 'select', options: ['Patient', 'Institute', 'Sponsor/CRO'],required:true },
    { name: 'sae_expected', label: 'Is the event expected or unexpected?', type: 'select', options: ['Expected', 'Unexpected'] },
    { name: 'sae_type', label: 'Select SAE Type', type: 'select', options: ['Death', 'Congenital anomaly', 'Life threatening', 'Hospitalization/Prolonged', 'Other Medically important'] ,required:true},
    { name: 'suspect_drug', label: 'Suspect drug (include generic name) / device / intervention', type: 'text' ,required:true},
    { name: 'drug_dose', label: 'Dose', type: 'text',required:true },
    { name: 'admin_route', label: 'Route(s) of administration:', type: 'text',required:true },
    { name: 'dosage_form', label: 'Dosage Form:', type: 'text' ,required:true},
    { name: 'batch_no', label: 'Batch no.', type: 'text' ,required:true},
    { name: 'mfg_date', label: 'Mfg date:', type: 'date' ,required:true},
    { name: 'therapy_period', label: 'Therapy dates (From / To)', type: 'text',required:true },
    { name: 'therapy_duration', label: 'Therapy duration', type: 'text' ,required:true},
    { name: 'reaction_response', label: 'Did the reaction decline after stopping the drug/procedure (Dechallenge & Rechallenge information)?', type: 'radio', options: ['Yes', 'No', 'NA'] ,required:true},
    { name: 'concomitant_drugs', label: 'Concomitant drug(s) and date of administration', type: 'text' ,required:true},
    { name: 'medical_history', label: 'Patient relevant history (e.g., diagnosis, allergies)', type: 'text' ,required:true},
    { name: 'sae_outcome', label: 'Outcome was', type: 'select', options: ['Recovered', 'Not recovered', 'Recovering', 'Fatal', 'Recovered with sequelae', 'Unknown'],required:true },
    { name: 'study_continued', label: 'Was the research subject continued on the research study?', type: 'radio', options: ['Yes', 'No', 'N/A'] ,required:true},
    { name: 'sae_informed', label: 'Is this SAE information communicated to sponsor/CRO/regulatory agencies?', type: 'radio', options: ['Yes', 'No'] ,required:true}
  ];

const SAE_Reporting = () => {

   const [data, setData] = useState({});
      const fetchOnce = useRef(false);
  
      useEffect(() => {
          if(!fetchOnce.current) {
              fetchOnce.current = true;
              getSubmittedData("sae_reports", setData);
          }
  
      }, [])
  return (
    <React.Fragment>
    {
          data?.formsResult?.length > 0 ?
              (<NIEC_Form_Preview formData={data.formsResult[0]} imagePreview={""} 
                fields={formFields} isSubmitted = {true} />) :
              (
    <div>
      <FormComponent formTitle="SAE Reporting " fields={formFields} formName = {"sae_reports"}/>
    </div>
      )
    }
     </React.Fragment>
  )
}

export default React.memo(SAE_Reporting);