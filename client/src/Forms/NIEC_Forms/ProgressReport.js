import React from 'react'
import FormComponent from '../../components/FormComponent';

const formFields = [
         {name: 'title',label: 'Title of study: ',  type: 'text'},
         {name: 'principal', label: 'Principal Investigator(Name)',  type: 'text' },
         {name: 'designation', label: 'Designation',  type: 'text' },
         {name: 'affilation', label: 'Affilation',  type: 'text' },
         {name: 'registration', label: 'NIEC Registration No',  type: 'text' },
         {name: 'date_appproval', label: '2.Date of NIEC Approval',  type: 'date' },
         {name: 'date_study', label: '3.Date of Start of study',  type: 'date' },
         {name: 'date_completion', label: 'Proposed date of Completion:',  type: 'date' },
        
        {
          name: 'recruitment_involved',
          label: '4.Does the study involve recruitment of participants?',
          type: 'radio',
          options: ['Yes', 'No']
        },
        {name: 'total_expected', label: 'Total number expected', type: 'text' },
        {name: 'no_screened', label: 'No. Screened', type: 'text'},
        {name: 'no_enrolled', label: 'No. Enrolled', type: 'text'},
        {name: 'no_randomized', label: 'Number Randomized', type: 'text'},
        {name: 'no_completed', label: 'Number Completed', type: 'text' },
        {name: 'no_followup', label: 'No. on follow-up', type: 'text'},
        {
          name: 'en_status',  label: 'b)Enrolment Status', type: 'select', options: ['Ongoing', 'Completed', 'Stopped']
        },
        { name: 'other_remarks', label: 'c)Any other remark', type: 'textarea'},
        {
            name: 'part_withdrawn',
            label: 'd)Have any participants withdrawn from this study since the last approval?',
            type: 'radio',
            options: ['Yes', 'No', 'NA']
          },
          {name: 'with_details',   label: 'If yes, total number withdrawn and reasons',  type: 'text'},

          {
            name: 'ex_period',
            label: '5.Is the study likely to extend beyond the stated period?',
            type: 'radio',
            options: ['Yes', 'No']
          },
          {
            name: 'ex_reason', label: 'If yes, please provide reasons for the extension',type: 'text'},
          {
            name: 'amend_research',
            label: '6.Have there been any amendments in the research protocol / informed consent document (ICD) during the past approval period?',
            type: 'radio',
            options: ['Yes', 'No']
          },
   
          {name:'niec_approval' ,label :'date of NIEC approval:',type:'date'},     
          {name: 'reference_no', label: 'reference number',  type: 'text' },
          {name:'date_approval', label:'date ', type:'date'},
          {
            name: 'reconsent_sought',
            label: '(b) In case of amendments in the research protocol / ICD, was re-consent sought from participants?',
            type: 'radio', options: ['Yes', 'No', 'NA'],
          },
          {name: 'specify',  label: 'If yes, please specify', type: 'text'},
          {
            name: 'benefit_risk',
            label: '7.Is any new information available that changes the benefit-risk analysis of human participants involved in this study?',
            type: 'radio', options: ['Yes', 'No']
          },
          {name: 'new_details', label: 'If yes, discuss in detail',  type: 'textarea'  },

          {name: 'adverse_events', label: '8.(a) Have any adverse events been noted since the last review?',  type: 'radio',  options: ['Yes', 'No']},
          {name: 'brief', label: 'Describe in brief', type: 'text'},
          {name: 'sae_occurred', label: '(b) Have any SAE’s occurred since last review?',type: 'radio',options: ['Yes', 'No']},
          {name: 'sae_description',    label: 'If yes, describe in brief',   type: 'text'},

          {name: 'protocol_deviation', label: '9.Has there been any protocol deviations / violations that occurred during this period?',
          type: 'radio',   options: ['Yes', 'No']},
          {name: 'protocol_specify', label: 'If yes, please specify',  type: 'text' },

          {name: 'de_reported', label: 'Have you reported the deviations to EC?',type: 'radio',  options: ['Yes', 'No']},
          {name: 'deviation_specify', label: 'If yes, specify details',  type: 'text' },

          {
            name: 'pub_present',
            label: '10.Are there any publications or presentations during this period related to the study?',type: 'radio',   options: ['Yes', 'No']
          },
          {name: 'pub_details',label: 'If yes, give details',  type: 'text'  },

          {name: 'applicable', label: '11.Any other details as applicable:',  type: 'textarea'}
              
];
        const ProgressReport = () => {
         return (
        <div>
        <FormComponent formTitle="Progress Report" fields={formFields} />
        </div>
    )
}

export default ProgressReport;