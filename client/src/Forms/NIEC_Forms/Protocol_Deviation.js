import React, { useEffect, useState,useRef } from 'react';
import FormComponent from '../../components/FormComponent';
import { getSubmittedData } from './NIEC_Config';
import NIEC_Form_Preview from './NIEC_Form_Preview';
const formFields = [

  { name: 'registration_number', label: 'NIEC Registration No. for protocol:', type: 'text',required:true },
  { name: 'study_number', label: 'Study / Protocol No.:', type: 'text',required:true },
  { name: 'version', label: 'Version:', type: 'text' ,required:true},
  { name: 'date', label: 'Date:', type: 'date' ,required:true},
  { name: 'project_title', label: 'Project Title:', type: 'text' ,required:true},
  { name: 'name', label: 'Name of Principal Investigator:', type: 'text' ,required:true},
  {
    name: 'issue_type',
    label: 'Tick appropriate:',
    type: 'select',
    options: ['Deviation', 'Waiver', 'Violation', 'Non compliance'],required:true
  },
  { name: 'issue_date', label: 'Date of occurrence: dd/mm/yyyy (Not applicable in case of Waiver)', type: 'date' ,required:true},
  { name: 'similar_issues', label: 'No. of similar D/W/V/NC occurred in the same trial:', type: 'text',required:false },
  { name: 'subject_id', label: 'Subject ID and initials:', type: 'text' ,required:true},
  { name: 'issue_details', label: 'Complete Details of D/W/V/NC (attach separate sheet if necessary):', type: 'textarea' ,required:false},
  { name: 'action_taken', label: 'Action taken by PI / Co-PI / Guide: (Not applicable in case of Waiver)', type: 'textarea' ,required:true},
  { name: 'participant_impact', label: 'Impact on trial participant (if any): (Not applicable in case of Waiver)', type: 'textarea' ,required:false},
  {

    name: 'informed_sponsor',
    label: 'Whether D/W/V/NC is informed to Sponsor/CRO:',
    type: 'radio',
    options: ['Yes', 'No', 'NA'] ,required:true
  },
  { name: 'investigator_confirm_name', label: 'Name of Principal Investigator:', type: 'text',required:true },
  { name: 'investigator_signature', label: 'Signature of Principal Investigator:', type: 'file' ,required:true},
  { name: 'confirm_date', label: 'Date', type: 'date' ,required:true}
];


const Protocol_Deviation = () => {
     const [data,setData]=useState({});
      const fetchOnce =useRef(false);
       
      useEffect(() => {
          if(!fetchOnce.current) {
              fetchOnce.current=true;
              getSubmittedData ('protocol_deviation' ,setData);
          }
      })
  return (
    <React.Fragment>
    {
          data?.formsResult?.length > 0 ?
              (<NIEC_Form_Preview formData={data.formsResult[0]} imagePreview={`http://localhost:4000/${data?.imageData?.imageUrl}`} 
                fields={formFields} isSubmitted = {true} />) :
              (
    <div>
      <FormComponent formTitle="Protocol Deviation and Compilance" fields={formFields} formName = {"protocol_deviation"}/>
    </div>
        )
            }
        </React.Fragment> 
  )
}

export default React.memo(Protocol_Deviation);
