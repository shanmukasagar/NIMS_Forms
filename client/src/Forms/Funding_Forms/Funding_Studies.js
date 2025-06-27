import React,{useState, useEffect, useRef} from 'react';
import NewFormComponent from './Main_Funding_Component';
import {getSubmittedData} from "./Funded_Config";
import FUNDED_Form_Preview from './Funding_Preview';

const formFields = [
    {name: 'name', label: 'Name of the funding Agency :', type: 'text' ,required:true},
    {name: 'budget', label: 'Proposed Budget', type: 'text' ,required:true},  
    {name: 'study', label: 'No of Study patients/Participants planned to be recruited:', type: 'text' ,required:true}, 
    { name: 'grant_patient', label: 'Expected grant per completed Patient ', type: 'text' ,required:true },
    {name: 'manpower', label: 'Expected Man-Power grant Per completed Patient (PI _Co-PI _study_ coordinator_ other personnel)', type: 'text' ,required:true},
    {name: 'invest', label: 'Investigations to be done in NIMS', type: 'text' ,required:true},
    {name: 'name_invest_1', label: 'Name of Investigation', type: 'text' ,required:true},
    {name:'unit_1',label:'Unit Cost', type:'text', required: false},
    {name: 'name_invest_2', label: 'Name of Investigation', type: 'text' ,required:true},
    {name:'unit_2',label:'Unit Cost', type:'text', required: false},
    {name: 'name_invest_3', label: 'Name of Investigation', type: 'text' ,required:true},
    {name:'unit_3',label:'Unit Cost', type:'text', required: false},
    {name: 'total_grant', label: 'Total Grant allotted to the study', type: 'text' ,required:true},

    //above good//
    {name: 'out_investigation', label: 'C. Are any study specific investigations being outsourced?', type: 'radio',
    options: ['Yes', 'No'],   required: true,},

    {
    type: 'heading', text: 'List the Investigations being outsourced if any:',
    conditional: { field: 'out_investigation', value: 'Yes' }
    },
    { name: 'invest_name_1',
    label: 'Name of Investigation', type: 'text',  required: true,   conditional: {  field: 'out_investigation', 
        value: 'Yes' }},
    {
    name: 'unit_cost_1',  label: 'Unit Cost',
    type: 'text',   required: true,  conditional: {  field: 'out_investigation',  value: 'Yes' }
    },
    {
    name: 'lab_name_1',label: 'Name of the Laboratory', type: 'text', required: true,
    conditional: {  field: 'out_investigation',  value: 'Yes'}
    },
    {
    name: 'address_1',
    label: 'Address of the Laboratory',
    type: 'textarea', required: true, conditional: { field: 'out_investigation', value: 'Yes' }
    },
    {
    name: 'nabl_1',
    label: 'NABL Accredited', type: 'radio', options: ['Yes', 'No'], required: true,
    conditional: {field: 'out_investigation',value: 'Yes' }
    },

    {
    name: 'invest_name_2', label: 'Name of Investigation', type: 'text',
    required: true, conditional: { field: 'out_investigation', value: 'Yes' }},

    {
    name: 'unit_cost_2',  label: 'Unit Cost',  type: 'text',  required: true,
    conditional: { field: 'out_investigation', value: 'Yes' }
    },
    {
    name: 'lab_name_2', label: 'Name of the Laboratory', type: 'text', required: true,
    conditional: { field: 'out_investigation', value: 'Yes' }
    },
    {
    name: 'address_2', label: 'Address of the Laboratory', type: 'textarea',  required: true,
    conditional: { field: 'out_investigation', value: 'Yes' }
    },
    {
    name: 'nabl_2', label: 'NABL Accredited',type: 'radio',  options: ['Yes', 'No'],
    required: true, conditional: { field: 'out_investigation', value: 'Yes' }},
  ];  
   
const FundedStudies = () => {
    const [data, setData] = useState({});
    const fetchOnce = useRef(false);

    useEffect(() => {
        if(!fetchOnce.current) {
            fetchOnce.current = true;
            getSubmittedData("funded_studies", setData);
        }
    }, [])

    return (
        <React.Fragment>
        {
            data?.formsResult?.length > 0 ?
                (<FUNDED_Form_Preview formData={data.formsResult[0]} imagePreview={""} 
                    fields={formFields} isSubmitted = {true} />) :
                ( <div>
                    <NewFormComponent formTitle="FundedStudies" fields={formFields} formName = {"funded_studies"}/>
                </div>)
        }
        </React.Fragment>
    )
}
export default React.memo(FundedStudies);
