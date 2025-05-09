import React, { useEffect, useState,useRef } from 'react'
import FormComponent from '../../components/FormComponent';
import { getSubmittedData } from './NIEC_Config';
import NIEC_Form_Preview from './NIEC_Form_Preview';

const formFields = [
    { name: 'niec_reg_no', label: 'NIEC Registration No: ', type: 'text' , required:true },
    { name: 'study_protocol', label: 'Study Protocol No: ', type: 'text', required:true },
    { name: 'protocol_title', label: 'Protocol Title: ', type: 'text', required:true },
    { name: 'pi_name', label: 'Name of Prinicipal Investigator:', type: 'text' , required:true},
    { name: 'sponsor_name', label: 'Sponsor’s Name: ', type: 'text', required:true },
    { name: 'niec_approval', label: 'NIEC Approval Date: ', type: 'date' , required:true},
    { name: 'progress_report_date', label: 'Date of Last Progress Report Submitted to NIEC: ', type: 'date', required:true },
    { name: 'study_start', label: 'Study Starting Date:', type: 'date' , required:true},
    { name: 'term_suspension_date', label: 'Termination / Suspension Date: ', type: 'date' , required:true},
    { name: 'termination_reasons', label: 'Reasons for Termination / Suspension ', type: 'text' , required:true},
    { name: 'safety_issues', label: 'Safety concerns', type: 'text', required:true },
    { name: 'efficacy_lack', label: 'Lack of efficacy ', type: 'text' , required:true },
    { name: 'other_reasons', label: 'Any other ', type: 'textarea' , required:false},
    { name: 'enrolled_count', label: 'No. of Participants Enrolled: ', type: 'number' , required:true},
    { name: 'randomized_count', label: 'No. of Participants Randomized ', type: 'number' , required:true},
    { name: 'completed_count', label: 'No. of Participants Completed: ', type: 'number' , required:true},
    { name: 'ongoing_count', label: 'No. of Ongoing Participants: ', type: 'number' , required:true},
    { name: 'dropouts_count', label: 'No. of Drop Outs: ', type: 'number' , required:true},
    { name: 'sae_count', label: 'SAE (Total No.): ', type: 'number' , required:true},
    { name: 'status', label: 'Status (provide details)', type: 'select', options: ['Ongoing', 'Resolved'] , required:true},
    { name: 'study_report', label: 'Study status report: (attach separate sheet if necessary) ', type: 'textarea' , required:true},
    { name: 'additional_info', label: 'Additional information / any other comments:', type: 'textarea' , required:false},
    { name: 'pi_name_confirm', label: 'Name of Prinicipal Investigator: ', type: 'text' , required:true},
    { name: 'pi_signature', label: 'Signature of Prinicipal Investigator: ', type: 'file' , required:true},
    { name: 'submission_date', label: 'Date', type: 'date' ,required:true}
];


const TerminationReport = () => {
    const [data,setData]=useState({})
    const fetchOnce =useRef(false)
     
    useEffect(() => {
        if(!fetchOnce.current) {
            fetchOnce.current=true;
            getSubmittedData ('termination_suspension_form' ,setData);
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
           <FormComponent formTitle="Termination Report " fields={formFields} formName = {"termination_suspension_form"}/>
       </div>
         )
        }
    </React.Fragment>
    )
}

export default React.memo(TerminationReport);