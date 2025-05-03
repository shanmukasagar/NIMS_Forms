import React from 'react'
import FormComponent from '../../components/FormComponent';
const formFields = [
    { name: 'registration_no', label: 'NIEC Registration No',  type: 'text' },
    { name: 'project_no', label: 'Project No', type: 'text' },
    { name: 'study', label: 'Study Title ', type: 'text' }, 
    { name: 'principal_name', label: 'Principal Investigator Name', type: 'text' }, 
    { name: 'designation', label: 'Designation ', type: 'text' },
    { name: 'affilation', label: 'Affilation:', type: 'text' },
    { name: 'sponsor', label: 'Sponsor', type: 'text' },
    { name: 'fund_source', label: 'Funding Source', type: 'text' },
    { name: 'date_niec', label: 'Date of NIEC Approval', type: 'date' },

    {name:'study_date', label:'Study Start Date', type:'date'},
    {name:'com_date', label:'Completion Date', type:'date'},
    {name:'obj', label:'Objectives', type:'text'},
    {name:'no_arms', label:'No.of study arms/interventions:', type:'text'},
    {name:'no_enrolled', label:'Total number of participants to be enrolled / randomized at the study site: ', type:'text'},
    {name:'screen', label:'screened', type:'text'},
    {name:'screen_fail', label:'Screen failures', type:''},
    {name:'enroll', label:'Enrolled', type:'text'},
    {name:'reason', label:'If the required sample size at the site could not be achieved – Kindly provide reasons ', type:'text'},
    {name:'patients' ,label:'No. of patients who completed the study: ',type:'text'},  
    {name:'patients', label:'No. of patients in each arm (if available / applicable): :', type:'text'},
    {name:'follow_up', label:' Participants lost to follow up: ', type:'text'},
    {name:'anyother', label:'Any other', type:'text'},
    
    { name: 'site_closure', label: 'Site closure report submitted:', type: 'radio', options: ['Yes', 'No']},
    { name: 'site_reason', label: 'If No, specify reasons',type: 'text'},
    { name: 'onsite_safety', label: 'Summary of On-site safety reports and Serious Adverse Events (Total number and type, provide details)',
        type: 'textarea'},
       
    {name:'protocol_deviation', label:'Protocol deviations/violations (provide brief summary): ', type:'textarea'},
    {name:'summary', label:'Brief summary of Results and Conclusion: ', type:'textarea'},
    {name:'data', label:'Presentation/publication related to the data generated in this trial: ', type:'text'},
    {name:'any_add', label:'Any additional information: ', type:'textarea'},


];
const CompletionReport = () => {
    return (
        <div>
        <FormComponent formTitle="CompletionReport " fields={formFields} />
        </div>
    )
}

export default CompletionReport;