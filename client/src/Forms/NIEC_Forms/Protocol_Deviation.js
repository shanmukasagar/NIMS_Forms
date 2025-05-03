import React from 'react';
import FormComponent from '../../components/FormComponent';
const formFields = [
  
{name:'niec_reg',label:'NIEC Registration No. for protocol: ', type:'text'},
{name:'protocol_no',label:'Study / Protocol No.:', type:'text'},
{name:'version',label:'Version: ', type:'text'},
{name:'date',label:'Date: ', type:'date'},
{name:'pro_title',label:'Project Title: ', type:'text'},
{name:'name_pi',label:'Name of PI:', type:'text'},
{
    name: 'tick',
    label: 'Tick appropriate:', type: 'select', options: ['Deviation', 'Waiver', 'Violation', 'Non compliance']
  },
  
{name:'date_waiver',label:'Date of occurrence: dd/mm/yyyy (Not applicable in case of Waiver)', type:'date'},
{name:'trail',label:'No. of similar D/W/V/NC occurred in the same trial: ', type:'text'},
{name:'sub_id',label:'Subject ID and initials: ', type:'text'},
{name:'details',label:'Complete Details of D/W/V/NC (attach separate sheet if necessary): ', type:'textarea'},
{name:'action_guide',label:'Action taken by PI / Co-PI / Guide: (Not applicable in case of Waiver) ', type:'textarea'},
{name:'trail_waiver',label:'Impact on trial participant (if any): (Not applicable in case of Waiver) ', type:'textarea'},
{
    name: 'informed_sponsor',
    label: 'Whether D/W/V/NC is informed to Sponsor/CRO:',
    type: 'radio',
    options: ['Yes', 'No', 'NA']
  },
  {name:'name_pi',label:'Name of the PI: ',type:'text'},
  {name:'sign',label:'Signature of PI: ',type:'file'},
  {name:'date',label:'Date',type:'date'},
  
]

const Protocol_Deviation = () => {
    return (
        <div>
         <FormComponent formTitle="TerminationReport " fields={formFields} />
            </div>
    )
}

export default Protocol_Deviation