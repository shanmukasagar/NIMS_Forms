import React from 'react'
import FormComponent from '../../components/FormComponent';

const formFields = [
    {name:'niec_reg',label:'NIEC Registration No: ',type:'text'},
    {name:'protocol_no',label:'Study Protocol No: ',type:'text'},
    {name:'protocol_title',label:'Protocol Title: ',type:'text'},
    {name:'name',label:'Name of PI:',type:'text'},
    {name:'sponsor',label:'Sponsor’s Name: ',type:'text'},
    {name:'niec_date',label:'NIEC Approval Date: ',type:'date'},
    {name:'report_date',label:'Date of Last Progress Report Submitted to NIEC: ',type:'date'},
    {name:'study_date',label:'Study Starting Date:',type:'date'},
    {name:'term_date',label:'Termination / Suspension Date: ',type:'date'},
    {name:'reasons',label:'Reasons for Termination / Suspension ',type:'text'},
    {name:'safety',label:'Safety concerns',type:'text'},
    {name:'lack',label:'Lack of efficacy ',type:'text'},
    {name:'any_other',label:'Any other ',type:'text'},
    {name:'enroll',label:'No. of Participants Enrolled: ',type:'text'},
    {name:'random',label:'No. of Participants Randomized ',type:'text'},
    {name:'participants',label:'No. of Participants Completed: ',type:'text'},
    {name:'on_participants',label:'No. of Ongoing Participants: ',type:'text'},
    {name:'drop',label:'No. of Drop Outs: ',type:'text'},
    {name:'sae',label:'SAE (Total No.): ',type:'text'},
    {
        name: 'status',
        label: 'Status (provide details)',
        type: 'select',
        options: ['Ongoing', 'Resolved']
      },
      
    {name:'sheet',label:'Study status report: (attach separate sheet if necessary) ',type:'textarea'},
    {name:'comments',label:'Additional information / any other comments:',type:'textarea'},
    {name:'name_pi',label:'Name of PI: ',type:'text'},
    {name:'sign',label:'Signature of PI: ',type:'file'},
    {name:'l_date',label:'Date',type:'date'},
   
]

const TerminationReport = () => {
    return (
       <div>
           <FormComponent formTitle="TerminationReport " fields={formFields} />
       </div>
    )
}

export default TerminationReport