import React from 'react'

import FormComponent from '../../components/FormComponent';


const formFields = [
    { name: 'niec_reg_no', label: 'NIEC Registration No',  type: 'text' },
    { name: 'protocol_no', label: 'Study/Protocol No', type: 'text' },
    { name: 'project_title', label: 'Title of project', type: 'text' }, 
    { name: 'pi_name', label: 'Principal Investigator', type: 'text' }, 
    { name: 'sae_onset_date', label: 'Date of onset of SAE: ', type: 'date' },
    { name: 'report_date', label: 'Report date:', type: 'date' },
    {
        name: 'report_type',
        label: 'Report type (tick any one)',
        type: 'select',
        options: ['Initial', 'Follow-up', ' Final']
},
    { name: 'subject_id', label: 'Subject Initials and Subjects ID', type: 'text' },
    { name: 'subject_age', label: 'DOB/Age', type: 'text' },
    { name: 'subject_gender', label: 'Gender:', type: 'text' },
    { 
        name: 'sae_description',
        label: ' Describe the SAE in detail (if this is a follow-up report, include follow-up information only): ',
        type: 'text' 
        },

    { name: 'treatment_provided',
         label: 'Describe the medical treatment provided (if any) to the research subject ',
          type: 'text' },

    { name: 'cost_bearer',
         label: 'If there was a research related injury/hospitalization, the cost of treatment/hospitalization was borne by: ', 
         type: 'select',
        options:['Patient', 'Institute','Sponsor/CRO'] 
    },
    
    {
        name: 'sae_expected',
        label: 'Is the event expected or unexpected?',
        type: 'radio',
        options: [' Expected', 'Unexpected']
      },
      {
        name: 'sae_type',
        label: 'Select SAE Type',
        type: 'select',
        options: [
          'Death', 'Congenital anomaly', 'Life threatening','Hospitalization/Prolonged','Other Medically important','Other Medically important'
        ]
      

      },
    { name: 'suspect_drug', 
        label: 'Suspect drug (include generic name) / device /intervention',
         type: 'text' },
    { name: 'drug_dose', label: 'Dose', type: 'text' },
    { name: 'admin_route', label: 'Route(s) of administration:', type: 'text' },
    { name: 'dosage_form', label: 'Dosage Form:', type: 'text' },
    { name: 'batch_no', label: 'Batch no. ', type: 'text' },
    { name: 'mfg_date', label: 'Mfg date: ', type: 'date' },
    {
        name: 'therapy_period',
        label: 'Therapy dates (From / To)',type: 'text'
      },
      {
        name: 'therapy_duration',
        label: 'Therapy duration',
        type: 'text'
      },
      {
        name: 'reaction_response',
        label: 'Did the reaction decline after stopping the drug / procedure (Dechallenge & Rechallenge information)?',
        type: 'radio',
        options: ['Yes', 'No', 'NA']
      },
      {
        name: 'concomitant_drugs',
        label: 'Concomitant drug(s) and date of administration',
        type: 'text'
      },
      {
        name: 'medical_history',
        label: 'Patient relevant history (e.g. diagnosis, allergies)',
        type: 'text'
      },
      {
        name: 'sae_outcome',
        label: 'Outcome was',
        type: 'select',
        options: ['Recovered','Not recovered','Recovering','Fatal',  'Recovered with sequalae',  'Unknown' ]
      },
      {
        name: 'study_continued', label: 'Was the research subject continued on the research study?',   type: 'radio',
        options: ['Yes', 'No', 'NA']
      },
      {
        name: 'sae_informed',
        label: 'Is this SAE information communicated to sponsor/CRO/regulatory agencies?',
        type: 'radio',
        options: ['Yes', 'No']
      }
      
            
];
const SAE_Reporting = () => {
    return (
        <div>
            
      <FormComponent formTitle="SAE Reporting " fields={formFields} formName={"sae_reports"} /></div>
    )
}

export default SAE_Reporting;