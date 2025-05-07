import React from 'react';
import FormComponent from '../../components/FormComponent';
const formFields = [
  
{name:'registration_number',label:'NIEC Registration No. for protocol: ', type:'text'},
{name:'study_number',label:'Study / Protocol No.:', type:'text'},
{name:'version',label:'Version: ', type:'text'},
{name:'date',label:'Date: ', type:'date'},
{name:'project_title',label:'Project Title: ', type:'text'},
{name:'name',label:'Name of PrincipalInvestigator:', type:'text'},
{
    name: 'issue_type',
    label: 'Tick appropriate:', type: 'select', options: ['Deviation', 'Waiver', 'Violation', 'Non compliance']
  },
  
{name:'issue_date',label:'Date of occurrence: dd/mm/yyyy (Not applicable in case of Waiver)', type:'date'},
{name:'similar_issues',label:'No. of similar D/W/V/NC occurred in the same trial: ', type:'text'},
{name:'subject_id',label:'Subject ID and initials: ', type:'text'},
{name:'issue_details',label:'Complete Details of D/W/V/NC (attach separate sheet if necessary): ', type:'textarea'},
{name:'action_taken',label:'Action taken by PrincipalInvestigator / Co-PI / Guide: (Not applicable in case of Waiver) ', type:'textarea'},
{name:'participant_impact',label:'Impact on trial participant (if any): (Not applicable in case of Waiver) ', type:'textarea'},
{
    name: 'informed_sponsor',
    label: 'Whether D/W/V/NC is informed to Sponsor/CRO:',
    type: 'radio',
    options: ['Yes', 'No', 'NA']
  },
  {name:'investigator_confirm_name',label:'Name of the PrincipalInvestigator: ',type:'text'},
  {name:'sign',label:'Signature of PrincipalInvestigator: ',type:'file'},
  {name:'confirm_date',label:'Date',type:'date'},
  
]

const Protocol_Deviation = () => {
    return (
        <div>
         <FormComponent formTitle="ProtocolDeviation " fields={formFields} formName={"protocol_deviation"}/>
            </div>
    )
}

export default Protocol_Deviation