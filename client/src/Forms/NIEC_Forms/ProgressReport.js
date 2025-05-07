import React from 'react'
import FormComponent from '../../components/FormComponent';

const formFields = [
         {name: 'study_title',label: 'Title of study: ',  type: 'text'},
         {name: 'pi_name', label: 'Principal Investigator(Name)',  type: 'text' },
         {name: 'pi_designation', label: 'Designation',  type: 'text' },
         {name: 'pi_affiliation', label: 'Affilation',  type: 'text' },
         {name: 'niec_reg_no', label: 'NIEC Registration No',  type: 'text' },
         {name: 'niec_approval_date', label: '2.Date of NIEC Approval',  type: 'date' },
         {name: 'study_start_date', label: '3.Date of Start of study',  type: 'date' },
         {name: 'study_end_date', label: 'Proposed date of Completion:',  type: 'date' },
        
        {
          name: 'involves_recruitment',
          label: '4.Does the study involve recruitment of participants?',
          type: 'radio',
          options: ['Yes', 'No']
        },
        {name: 'expected_total', label: 'Total number expected', type: 'text' },
        {name: 'screened', label: 'No. Screened', type: 'text'},
        {name: 'enrolled', label: 'No. Enrolled', type: 'text'},
        {name: 'randomized', label: 'Number Randomized', type: 'text'},
        {name: 'completed', label: 'Number Completed', type: 'text' },
        {name: 'on_followup', label: 'No. on follow-up', type: 'text'},
        {
          name: 'enrollment_status',  label: 'b)Enrolment Status', type: 'select', options: ['Ongoing', 'Completed', 'Stopped']
        },
        { name: 'remarks', label: 'c)Any other remark', type: 'textarea'},
        {
            name: 'participants_withdrawn',
            label: 'd)Have any participants withdrawn from this study since the last approval?',
            type: 'radio',
            options: ['Yes', 'No', 'NA']
          },
          {name: 'withdrawn_details',   label: 'If yes, total number withdrawn and reasons',  type: 'text'},

          {
            name: 'extension_needed',
            label: '5.Is the study likely to extend beyond the stated period?',
            type: 'radio',
            options: ['Yes', 'No']
          },
          {
            name: 'extension_reason', label: 'If yes, please provide reasons for the extension',type: 'text'},
          {
            name: 'amendments_made',
            label: '6.Have there been any amendments in the research protocol / informed consent document (ICD) during the past approval period?',
            type: 'radio',
            options: ['Yes', 'No']
          },
   
          {name:'amendment_approval_date' ,label :'date of NIEC approval:',type:'date'},     
          {name: 'reference_no', label: 'reference number',  type: 'text' },
          {name:'amendment_date', label:'date ', type:'date'},
          {
            name: 'reconsent_sought',
            label: '(b) In case of amendments in the research protocol / ICD, was re-consent sought from participants?',
            type: 'radio', options: ['Yes', 'No', 'NA'],
          },
          {name: 'reconsent_details',  label: 'If yes, please specify', type: 'text'},
          {
            name: 'benefit_risk_update',
            label: '7.Is any new information available that changes the benefit-risk analysis of human participants involved in this study?',
            type: 'radio', options: ['Yes', 'No']
          },
          {name: 'benefit_risk_details', label: 'If yes, discuss in detail',  type: 'textarea'  },

          {name: 'adverse_events', label: '8.(a) Have any adverse events been noted since the last review?',  type: 'radio',  options: ['Yes', 'No']},
          {name: 'ae_description', label: 'Describe in brief', type: 'text'},
          {name: 'sae_occurred', label: '(b) Have any SAE’s occurred since last review?',type: 'radio',options: ['Yes', 'No']},
          {name: 'sae_description',    label: 'If yes, describe in brief',   type: 'text'},

          {name: 'protocol_violations', label: '9.Has there been any protocol deviations / violations that occurred during this period?',
          type: 'radio',   options: ['Yes', 'No']},
          {name: 'violation_details', label: 'If yes, please specify',  type: 'text' },

          {name: 'deviation_reported', label: 'Have you reported the deviations to EC?',type: 'radio',  options: ['Yes', 'No']},
          {name: 'deviation_details', label: 'If yes, specify details',  type: 'text' },

          {
            name: 'publications_present',
            label: '10.Are there any publications or presentations during this period related to the study?',type: 'radio',   options: ['Yes', 'No']
          },
          {name: 'publication_details',label: 'If yes, give details',  type: 'text'  },

          {name: 'additional_details', label: '11.Any other details as applicable:',  type: 'textarea'}
              
];
        const ProgressReport = () => {
         return (
        <div>
        <FormComponent formTitle="ProgressReport" fields={formFields} formName={"study_progress_report"} />
        </div>
    )
}

export default ProgressReport;