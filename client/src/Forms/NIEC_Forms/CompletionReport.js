import React from 'react'
import FormComponent from '../../components/FormComponent';

const formFields = [
    { name: 'niec_reg_no', label: 'NIEC Registration No', type: 'text', required: true  },
    { name: 'project_no', label: 'Project No', type: 'text', required: true  },
    { name: 'study_title', label: 'Study Title', type: 'text', required: true  },
    { name: 'pi_name', label: 'Principal Investigator Name', type: 'text', required: true  },
    { name: 'designation', label: 'Designation', type: 'text', required: true  },
    { name: 'affiliation', label: 'Affiliation', type: 'text', required: true  },
    { name: 'sponsor', label: 'Sponsor', type: 'text', required: true  },
    { name: 'funding_source', label: 'Funding Source', type: 'text', required: true  },
    { name: 'niec_approval_date', label: 'Date of NIEC Approval', type: 'date', required: true  },
  
    { name: 'study_start_date', label: 'Study Start Date', type: 'date', required: true  },
    { name: 'completion_date', label: 'Completion Date', type: 'date', required: true  },
    { name: 'objectives', label: 'Objectives', type: 'text', required: true  },
    { name: 'study_arms', label: 'No. of study arms/interventions', type: 'text', required: true  },
    { name: 'target_enroll', label: 'Total participants to be enrolled/randomized at site', type: 'text', required: true  },
    { name: 'screened', label: 'Screened', type: 'text', required: true  },
    { name: 'screen_failures', label: 'Screen failures', type: 'text', required: true  },
    { name: 'enrolled', label: 'Enrolled', type: 'text', required: true  },
    { name: 'enroll_reason', label: 'Reason for not meeting sample size', type: 'text' , required: true },
    { name: 'patients_completed', label: 'Patients completed study', type: 'text', required: true  },
    { name: 'patients_per_arm', label: 'Patients per arm (if applicable)', type: 'text', required: true  },
    { name: 'lost_followup', label: 'Participants lost to follow-up', type: 'text', required: true  },
    { name: 'other_info', label: 'Any other', type: 'textarea', required: false  },
  
    { name: 'site_closure_report', label: 'Site closure report submitted', type: 'radio', options: ['Yes', 'No', 'N/A'], required: true  },
    { name: 'closure_reason', label: 'If No, specify reasons', type: 'text', required: false  },
    { name: 'safety_summary', label: 'On-site safety/SAE summary (details)', type: 'textarea', required: true  },
  
    { name: 'protocol_violations', label: 'Protocol deviations/violations summary', type: 'textarea', required: true  },
    { name: 'study_summary', label: 'Summary of results and conclusion', type: 'textarea', required: true  },
    { name: 'publications', label: 'Publications/presentations from data', type: 'text', required: true  },
    { name: 'additional_info', label: 'Any additional information', type: 'textarea', required: false  }
];


const CompletionReport = () => {
    return (
        <div>
            <FormComponent formTitle="Completion Report " fields={formFields} formName = {"study_completion_report"}/>
        </div>
    )
}

export default React.memo(CompletionReport);