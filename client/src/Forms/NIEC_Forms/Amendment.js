import React from 'react';
import FormComponent from '../../components/FormComponent';

const formFields = [
    { name: 'register_no', label: 'NIEC registration no',  type: 'text', required: true },
    { name: 'title', label: 'Project Title', type: 'text', required: true },
    { name: 'name', label: 'Name of the Principal Investigator', type: 'text', required: true },
    { name: 'designation', label: 'Designation of the Principal Investigator', type: 'text', required: true },
    { name: 'approval_date', label: 'Date of NIEC Approval:', type: 'date', required: true },
    { name: 'study_date', label: 'Start Date of Study as applicable:', type: 'date', required: true },  
    { 
        name: 'protocol_changes_documented', 
        label: 'Are the changes made to the protocol and related documents with version number and date specified in a tabular form. ', 
        type: 'radio' , required: true
    },
    { 
        name: 'amended_documents_submitted', 
        label: 'Are all the relevant amended documents submitted for review',  type: 'radio' , required: true
    }, 
    { name: 'additional_info', label: 'Any other information, kindly specify ', type: 'textarea', required: false },

];

const Amendment = () => {
    return (
        <div>
            <FormComponent formTitle="AMENDMENT REPORTING FORM" fields={formFields} formName = {"amendment_form"}/>
        </div>
    );
};

export default Amendment;
