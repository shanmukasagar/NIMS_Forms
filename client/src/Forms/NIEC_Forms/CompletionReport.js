import React from 'react'
import FormComponent from '../../components/FormComponent';
const formFields = [
    { name: 'niec_reg_no', label: 'NIEC Registration No',  type: 'text' },
    { name: 'project_no', label: 'Project No', type: 'text' },
    { name: 'study_title', label: 'Study Title ', type: 'text' }, 
    { name: 'pi_name', label: 'Principal Investigator Name', type: 'text' }, 
    { name: 'designation', label: 'Designation ', type: 'text' },
    { name: 'affiliation', label: 'Affilation:', type: 'text' },
    { name: 'sponsor', label: 'Sponsor', type: 'text' },
    { name: 'funding_source', label: 'Funding Source', type: 'text' },
    { name: 'niec_approval_date', label: 'Date of NIEC Approval', type: 'date' },

    {name:'study_start_date', label:'Study Start Date', type:'date'},
    {name:'completion_date', label:'Completion Date', type:'date'},
    {name:'objectives', label:'Objectives', type:'text'},
    {name:'study_arms', label:'No.of study arms/interventions:', type:'text'},
    {name:'target_enroll', label:'Total number of participants to be enrolled / randomized at the study site: ', type:'text'},
    {name:'screened', label:'screened', type:'text'},
    {name:'screen_failures', label:'Screen failures', type:'text'},
    {name:'enrolled', label:'Enrolled', type:'text'},
    {name:'enroll_reason', label:'If the required sample size at the site could not be achieved – Kindly provide reasons ', type:'text'},
    {name:'patients_completed' ,label:'No. of patients who completed the study: ',type:'text'},  
    {name:'patients_per_arm', label:'No. of patients in each arm (if available / applicable): :', type:'text'},
    {name:'lost_followup', label:' Participants lost to follow up: ', type:'text'},
    {name:'other_info', label:'Any other', type:'text'},
    
    { name: 'site_closure_report', label: 'Site closure report submitted:', type: 'radio', options: ['Yes', 'No']},
    { name: 'closure_reason', label: 'If No, specify reasons',type: 'text'},
    { name: 'safety_summary', label: 'Summary of On-site safety reports and Serious Adverse Events (Total number and type, provide details)',
        type: 'textarea'},
       
    {name:'protocol_violations', label:'Protocol deviations/violations (provide brief summary): ', type:'textarea'},
    {name:'study_summary', label:'Brief summary of Results and Conclusion: ', type:'textarea'},
    {name:'publications', label:'Presentation/publication related to the data generated in this trial: ', type:'text'},
    {name:'additional_info', label:'Any additional information: ', type:'textarea'},


];
const CompletionReport = () => {
    return (
        <div>
        <FormComponent formTitle="CompletionReport " fields={formFields} formName={"study_completion_report"} />
        </div>
    )
}

export default CompletionReport;