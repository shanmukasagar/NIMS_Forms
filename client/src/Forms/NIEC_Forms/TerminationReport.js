import React from 'react'
import FormComponent from '../../components/FormComponent';

const formFields = [
    { name: 'niec_reg_no', label: 'NIEC Registration No: ', type: 'text' },
    { name: 'study_protocol', label: 'Study Protocol No: ', type: 'text' },
    { name: 'protocol_title', label: 'Protocol Title: ', type: 'text' },
    { name: 'pi_name', label: 'Name of Prinicipal Investigator:', type: 'text' },
    { name: 'sponsor_name', label: 'Sponsor’s Name: ', type: 'text' },
    { name: 'niec_approval', label: 'NIEC Approval Date: ', type: 'date' },
    { name: 'progress_report_date', label: 'Date of Last Progress Report Submitted to NIEC: ', type: 'date' },
    { name: 'study_start', label: 'Study Starting Date:', type: 'date' },
    { name: 'term_suspension_date', label: 'Termination / Suspension Date: ', type: 'date' },
    { name: 'termination_reasons', label: 'Reasons for Termination / Suspension ', type: 'text' },
    { name: 'safety_issues', label: 'Safety concerns', type: 'text' },
    { name: 'efficacy_lack', label: 'Lack of efficacy ', type: 'text' },
    { name: 'other_reasons', label: 'Any other ', type: 'textarea' },
    { name: 'enrolled_count', label: 'No. of Participants Enrolled: ', type: 'number' },
    { name: 'randomized_count', label: 'No. of Participants Randomized ', type: 'number' },
    { name: 'completed_count', label: 'No. of Participants Completed: ', type: 'number' },
    { name: 'ongoing_count', label: 'No. of Ongoing Participants: ', type: 'number' },
    { name: 'dropouts_count', label: 'No. of Drop Outs: ', type: 'number' },
    { name: 'sae_count', label: 'SAE (Total No.): ', type: 'number' },
    { name: 'status', label: 'Status (provide details)', type: 'select', options: ['Ongoing', 'Resolved'] },
    { name: 'study_report', label: 'Study status report: (attach separate sheet if necessary) ', type: 'textarea' },
    { name: 'additional_info', label: 'Additional information / any other comments:', type: 'textarea' },
    { name: 'pi_name_confirm', label: 'Name of Prinicipal Investigator: ', type: 'text' },
    { name: 'pi_signature', label: 'Signature of Prinicipal Investigator: ', type: 'file' },
    { name: 'submission_date', label: 'Date', type: 'date' }
];


const TerminationReport = () => {
    return (
       <div>
           <FormComponent formTitle="Termination Report " fields={formFields} formName = {"termination_suspension_form"}/>
       </div>
    )
}

export default React.memo(TerminationReport);