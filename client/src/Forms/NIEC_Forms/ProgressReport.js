import React from 'react';
import FormComponent from '../../components/FormComponent';

const formFields = [
    { name: 'study_title', label: 'Title of study:', type: 'text', required: true  },
    { name: 'pi_name', label: 'Name of Principal Investigator', type: 'text', required: true  },
    { name: 'pi_designation', label: 'Designation', type: 'text', required: true  },
    { name: 'pi_affiliation', label: 'Affiliation', type: 'text', required: true  },
    { name: 'niec_reg_no', label: 'NIEC Registration No', type: 'text', required: true  },
    { name: 'niec_approval_date', label: 'Date of NIEC Approval', type: 'date', required: true  },
    { name: 'study_start_date', label: 'Date of Start of study', type: 'date', required: true  },
    { name: 'study_end_date', label: 'Proposed date of Completion:', type: 'date', required: true  },
  
    { name: 'involves_recruitment', label: 'Does the study involve recruitment of participants?', type: 'radio', options: ['Yes', 'No'] , required: true },
    { name: 'expected_total', label: 'Total number expected', type: 'number', required: true  },
    { name: 'screened', label: 'No. Screened', type: 'number', required: true  },
    { name: 'enrolled', label: 'No. Enrolled', type: 'number', required: true  },
    { name: 'randomized', label: 'Number Randomized', type: 'number', required: true  },
    { name: 'completed', label: 'Number Completed', type: 'number', required: true  },
    { name: 'on_followup', label: 'No. on follow-up', type: 'number', required: true  },
    { name: 'enrollment_status', label: 'Enrolment Status', type: 'select', options: ['Ongoing', 'Completed', 'Stopped'], required: true  },
    { name: 'remarks', label: 'Any other remark', type: 'textarea', required: true  },
  
    { name: 'participants_withdrawn', label: 'Have any participants withdrawn from this study since the last approval?', type: 'radio', 
        options: ['Yes', 'No', 'NA'], required: true  },
    { name: 'withdrawn_details', label: 'If yes, total number withdrawn and reasons', type: 'text', required: false  },
  
    { name: 'extension_needed', label: 'Is the study likely to extend beyond the stated period?', type: 'radio', options: ['Yes', 'No'], required: true  },
    { name: 'extension_reason', label: 'If yes, please provide reasons for the extension', type: 'text', required: false  },
  
    { name: 'amendments_made', label: 'Have there been any amendments in the research protocol / ICD during the past approval period?', type: 'radio', options: ['Yes', 'No'], required: true  },
    { name: 'amendment_approval_date', label: 'Date of NIEC approval:', type: 'date', required: true  },
    { name: 'reference_no', label: 'Reference number', type: 'text', required: true  },
    { name: 'amendment_date', label: 'Date', type: 'date', required: true  },
  
    { name: 'reconsent_sought', label: 'In case of amendments in the research protocol / ICD, was re-consent sought from participants?', type: 'radio', options: ['Yes', 'No', 'NA'], required: true  },
    { name: 'reconsent_details', label: 'If yes, please specify', type: 'text' , required: false },
  
    { name: 'benefit_risk_update', label: 'Is any new information available that changes the benefit-risk analysis?', type: 'radio', 
        options: ['Yes', 'No'], required: true  },
    { name: 'benefit_risk_details', label: 'If yes, discuss in detail', type: 'textarea', required: false  },
  
    { name: 'adverse_events', label: 'Have any adverse events been noted since the last review?', type: 'radio', options: ['Yes', 'No'] , required: true },
    { name: 'ae_description', label: 'Describe in brief', type: 'text' , required: true },
  
    { name: 'sae_occurred', label: 'Have any SAE’s occurred since last review?', type: 'radio', options: ['Yes', 'No'], required: true  },
    { name: 'sae_description', label: 'If yes, describe in brief', type: 'text', required: false  },
  
    { name: 'protocol_violations', label: 'Has there been any protocol deviations / violations?', type: 'radio', options: ['Yes', 'No'], required: true  },
    { name: 'violation_details', label: 'If yes, please specify', type: 'text', required: false  },
  
    { name: 'deviation_reported', label: 'Have you reported the deviations to EC?', type: 'radio', options: ['Yes', 'No'] , required: true },
    { name: 'deviation_details', label: 'If yes, specify details', type: 'text', required: false  },
  
    { name: 'publications_present', label: 'Are there any publications or presentations related to the study?', type: 'radio', options: ['Yes', 'No'] },
    { name: 'publication_details', label: 'If yes, give details', type: 'text', required: false  },
  
    { name: 'additional_details', label: 'Any other details as applicable:', type: 'textarea', required: false  }
];
  
const ProgressReport = () => {
  return (
    <div>
        <FormComponent formTitle="Progress Report" fields={formFields} formName = {"study_progress_report"} />
    </div>
  )
}

export default React.memo(ProgressReport);