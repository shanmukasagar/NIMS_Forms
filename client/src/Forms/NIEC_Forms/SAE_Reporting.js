import React from 'react'

import FormComponent from '../../components/FormComponent';


const formFields = [
    { name: 'registration_no', label: 'NIEC Registration No',  type: 'text' },
    { name: 'protocol_no', label: 'Study/Protocol No', type: 'text' },
    { name: 'title', label: 'Title of project', type: 'text' }, 
    { name: 'principal', label: 'Principal Investigator', type: 'text' }, 
    { name: 'date_onset', label: 'Date of onset of SAE: ', type: 'date' },
    { name: 'date', label: 'Report date:', type: 'date' },
    {
        name: 'report_type',
        label: 'Report type (tick any one)',
        type: 'select',
        options: ['a) Initial', 'b) Follow-up', 'c) Final']
},
    { name: 'subject_initials', label: 'Subject Initials and Subjects ID', type: 'text' },
    { name: 'age', label: 'Date/Age', type: 'text' },
    { name: 'gender', label: 'Gender:', type: 'text' },
    { 
        name: 'describe_sae',
        label: ' Describe the SAE in detail (if this is a follow-up report, include follow-up information only): ',
        type: 'text' 
        },

    { name: 'medical',
         label: 'Describe the medical treatment provided (if any) to the research subject ',
          type: 'text' },

    { name: 'injury',
         label: 'If there was a research related injury/hospitalization, the cost of treatment/hospitalization was borne by: ', 
         type: 'select',
        options:['a)Patient', 'b)Institute',' c)Sponsor/CRO'] 
    },
    
    {
        name: 'sae_nature',
        label: 'Is the event expected or unexpected?',
        type: 'radio',
        options: ['a) Expected', 'b) Unexpected']
      },
      {
        name: 'sae_type',
        label: 'Select SAE Type',
        type: 'select',
        options: [
          'Death', 'Congenital anomaly', 'Life threatening','Hospitalization/Prolonged','Other Medically important','Other Medically important'
        ]
      

      },
    { name: 'drug', 
        label: 'Suspect drug (include generic name) / device /intervention',
         type: 'text' },
    { name: 'dose', label: 'Dose', type: 'text' },
    { name: 'routes', label: 'Route(s) of administration:', type: 'text' },
    { name: 'dosage', label: 'Dosage Form:', type: 'text' },
    { name: 'batch', label: 'Batch no. ', type: 'text' },
    { name: 'date', label: 'Mfg date: ', type: 'date' },
    {
        name: 'therapy_dates',
        label: 'Therapy dates (From / To)',type: 'text'
      },
      {
        name: 'therapy_duration',
        label: 'Therapy duration',
        type: 'text'
      },
      {
        name: 'reaction_decline',
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
        name: 'patient_history',
        label: 'Patient relevant history (e.g. diagnosis, allergies)',
        type: 'text'
      },
      {
        name: 'outcome',
        label: 'Outcome was',
        type: 'select',
        options: ['Recovered','Not recovered','Recovering','Fatal',  'Recovered with sequalae',  'Unknown' ]
      },
      {
        name: 'study_continued', label: 'Was the research subject continued on the research study?',   type: 'radio',
        options: ['Yes', 'No', 'NA']
      },
      {
        name: 'sae_communicated',
        label: 'Is this SAE information communicated to sponsor/CRO/regulatory agencies?',
        type: 'radio',
        options: ['Yes', 'No']
      }
      
            
];
const SAE_Reporting = () => {
    return (
        <div>
            
            <FormComponent formTitle="SAE Reporting " fields={formFields} /></div>
    )
}

export default SAE_Reporting;