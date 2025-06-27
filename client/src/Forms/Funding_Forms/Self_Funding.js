import React,{useState, useEffect, useRef} from 'react';
import NewFormComponent from './Main_Funding_Component';
import {getSubmittedData} from "./Funded_Config";
import SELFFUNDED_Form_Preview from "./Funding_Preview";

//Form fields
const formFields = [
  {name: 'budget_pi', label: 'Proposed Budget by Principal Investigator:', type: 'text' ,required:true},
  {name: 'study', label: 'No of Study Patients/Participants planned to be recruited:', type: 'text' ,required:true}, 
  {name: 'patient', label: 'Expected Cost per completed Patient', type: 'text' ,required:true },
  {name: 'inv_nims', label: 'Investigations to be done in NIMS', type: 'text' ,required:true},
  {name: 'name_invest_1', label: 'Name of Investigation', type: 'text' ,required:true},
  {name:'unit_1',label:'Unit Cost', type:'text', required: false},
  {name: 'name_invest_2', label: 'Name of Investigation', type: 'text' ,required:true},
  {name:'unit_2',label:'Unit Cost', type:'text', required: false},
  {name: 'name_invest_3', label: 'Name of Investigation', type: 'text' ,required:true},
  {name:'unit_3',label:'Unit Cost', type:'text', required: false},
  {name: 'total_proj', label: 'Total Project Cost', type: 'text' ,required:true},
  //above good//
  {name: 'out_investigation', label: 'C. Are any study specific investigations being outsources?', type: 'radio',
    options: ['Yes', 'No'],   required: true,},

  {type: 'heading', text: 'List the Investigations being outsourced if any:',
  conditional: {    field: 'out_investigation', value: 'Yes' }},
  {name: 'invest_name', label: 'Name of Investigation', type: 'text',  required: true,  
  conditional: {  field: 'out_investigation',value: 'Yes' }},
  {
    name: 'unit_cost', label: 'Unit Cost',   type: 'text',
    required: true, conditional: { field: 'out_investigation',value: 'Yes' }},
  {
    name: 'name_1',  label: 'Name of the Laboratory',
    type: 'text', required: true, conditional: { field: 'out_investigation', value: 'Yes' }
  },
  {
    name: 'address_1', label: 'Address of the Laboratory', type: 'textarea',
    required: true, conditional: {  field: 'out_investigation',value: 'Yes'}
  },
  {
    name: 'nabl_1',label: 'NABL Accredited', type: 'radio',
    options: ['Yes', 'No'], required: true,  conditional: {field: 'out_investigation', value: 'Yes' }
  },
  {
    name: 'invest_name_2',   label: 'Name of Investigation',
    type: 'text', required: true, conditional: { field: 'out_investigation', value: 'Yes' }
  },

  {
    name: 'unit_cost_2', label: 'Unit Cost', type: 'text', required: true,
    conditional: { field: 'out_investigation', value: 'Yes' }
  },
  {
    name: 'name_2', label: 'Name of the Laboratory', type: 'text', required: true,
    conditional: { field: 'out_investigation', value: 'Yes' }
  },
  {
    name: 'address_2', label: 'Address of the Laboratory',  type: 'textarea',  required: true,
    conditional: { field: 'out_investigation', value: 'Yes' }
  },
  {
    name: 'nabl_2',label: 'NABL Accredited',  type: 'radio',   options: ['Yes', 'No'],
    required: true,
    conditional: { field: 'out_investigation', value: 'Yes' }
  },
];  
   
const SelfFundedResearch = () => {
   const [data, setData] = useState({});
    const fetchOnce = useRef(false);

    useEffect(() => {
        if(!fetchOnce.current) {
            fetchOnce.current = true;
            getSubmittedData("self_fundedresearch", setData);
        }
    }, [])

  

  return (
    <React.Fragment>
    {
          data?.formsResult?.length > 0 ?
              (<SELFFUNDED_Form_Preview formData={data.formsResult[0]} imagePreview={""} 
                fields={formFields} isSubmitted = {true} />) :
              (
    <div>
    <NewFormComponent formTitle="Self Funded Research" fields={formFields} formName = {"self_fundedresearch"}/>
    </div>
      )
    }
     </React.Fragment>
  )
}
export default React.memo(SelfFundedResearch);