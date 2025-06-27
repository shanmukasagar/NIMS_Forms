import React,{useState, useEffect, useRef} from 'react';
import NewFormComponent from './Main_Funding_Component';
import {getSubmittedData} from "./Funded_Config";
import INDUSTRY_Form_Preview from './Funding_Preview';

const formFields = [
    {name: 'sponsor_name', label: 'Sponsor Name/ID :', type: 'text' ,required:true},
    {name: 'sponosor_pan', label: 'Sponsor PAN', type: 'text' ,required:true},  
    {name: 'sponsor_gst', label: 'Sponsor GST', type: 'text' ,required:true},
    { type: 'heading', text: 'Proposed Budget by sponsor:' },
    {name: 'patients', label: 'Per completed patients total sponsor grant', type: 'text' ,required:true},
    {name: 'manpower', label: 'Per completed patients manpower sponsor grant(PI _Co-PI _study_ coordinator_ other personnel)', type: 'text' ,required:true},

    {name:'overhead',label:'Per completed patients overhead', type:'text', required:true},
    {name:'startup',label:'Startup fee', type:'text', required:true},
    {name:'archival_fee',label:'Archival fee', type:'text', required:true},
    {name:'invest_nims',label:'Investigations to be done in NIMS', type:'text', required:true},
    {name: 'name_1', label: 'Name of Investigation', type: 'text' ,required:true},
    {name:'unit_1',label:'Unit Cost', type:'text', required: false},
    {name: 'name_2', label: 'Name of Investigation', type: 'text' ,required:true},
    {name:'unit_2',label:'Unit Cost', type:'text', required: false},
    {name: 'name_3', label: 'Name of Investigation', type: 'text' ,required:true},
    {name:'unit_3',label:'Unit Cost', type:'text', required: false},
    {name: 'name_4', label: 'Name of Investigation', type: 'text' ,required:true},
    {name:'unit_4',label:'Unit Cost', type:'text', required: false},
    {name: 'name_5', label: 'Name of Investigation', type: 'text' ,required:true},
    {name:'unit_5',label:'Unit Cost', type:'text', required: false},
    {name:'grant_alloted', label:'Total grant alloted to the proposed project', type:'text', required:true},
    {type: 'heading', text: 'List of Personnel' },
    {name: 'designation_1', label: 'Designation', type: 'text' ,required:true},
    {name: 'proposed_1', label: 'Proposed fees per patient', type: 'text' ,required:true},
    {name: 'designation_2', label: 'Designation', type: 'text' ,required:true},
    {name: 'proposed_2', label: 'Proposed fees per patient', type: 'text' ,required:true},
    {name: 'designation_3', label: 'Designation', type: 'text' ,required:true},
    {name: 'proposed_4', label: 'Proposed fees per patient', type: 'text' ,required:true},

    //above good//
    {name: 'out_investigation', label: 'C. Are any study specific investigations being outsourced?', type: 'radio',
        options: ['Yes', 'No'],   required: true,},
    {
        type: 'heading',
        text: 'List the Investigations being outsourced ',
        conditional: {  field: 'out_investigation',value: 'Yes'    }},
        {name: 'invest_name_1',
        label: 'Name of Investigation', type: 'text',  required: true,   conditional: {  field: 'out_investigation', 
        value: 'Yes' }},

        {name: 'name_lab_1',
        label: 'Name of the Laboratory', type: 'text',  required: true,
        conditional: { field: 'out_investigation', value: 'Yes' } },
        {
        name: 'address_1',label: 'Address of the Laboratory',type: 'textarea',
        required: true,  conditional: { field: 'out_investigation',value: 'Yes' } },
        {
        name: 'nabl_1',label: 'NABL Accredited', type: 'radio', options: ['Yes', 'No'],  required: true,
        conditional: { field: 'out_investigation', value: 'Yes'}},
        
        {name: 'invest_name_2', label: 'Name of Investigation', type: 'text',required: true,
        conditional: { field: 'out_investigation', value: 'Yes' }},
        {
        name: 'name_lab_2',label: 'Name of the Laboratory', type: 'text',
        required: true, conditional: { field: 'out_investigation', value: 'Yes' }
        },
        {name: 'address_2', label: 'Address of the Laboratory', type: 'textarea', required: true,
        conditional: { field: 'out_investigation', value: 'Yes' } },
        {
        name: 'nabl_2',label: 'NABL Accredited', type: 'radio', options: ['Yes', 'No'],  required: true,
        conditional: { field: 'out_investigation', value: 'Yes' }
        },
];  
   
const IndustrySponsored = () => {
    const [data, setData] = useState({});
    const fetchOnce = useRef(false);
  
    useEffect(() => {
        if(!fetchOnce.current) {
            fetchOnce.current = true;
            getSubmittedData("industry_sponsor", setData);
        }
    }, [])
    
    return (
        <React.Fragment>
            {data?.formsResult?.length > 0 ?
                (<INDUSTRY_Form_Preview formData={data.formsResult[0]} imagePreview={""} 
                    fields={formFields} isSubmitted = {true} />) :
                (
            <div>
                <NewFormComponent formTitle="Industry Sponsored " fields={formFields} formName = {"industry_sponsor"}/>
            </div>
            )}
        </React.Fragment>
    )
}

export default React.memo(IndustrySponsored);
