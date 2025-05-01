import React from 'react';
import FormComponent from '../../components/FormComponent';

const formFields = [
    { name: 'register_no', label: 'NIEC registration no',  type: 'text' },
    { name: 'pro_title', label: 'Project Title', type: 'text' },
    { name: 'name', label: 'Name of the Principal Investigator', type: 'text' },
    { name: 'designation', label: 'Designation of the Principal Investigator', type: 'text' },
    { name: 'approval_date', label: 'Date of NIEC Approval:', type: 'date' },
    { name: 'study_date', label: 'Start Date of Study as applicable:', type: 'date' },  
    { 
        name: 'protocolChangesDocumented', 
        label: 'Are the changes made to the protocol and related documents with version number and date specified in a tabular form. ', 
        type: 'radio' 
    },
    { 
        name: 'amendedDocumentsSubmitted', 
        label: 'Are all the relevant amended documents submitted for review', 
        type: 'radio' 
    }, 
    { name: 'additional_info', label: 'Any other information, kindly specify ', type: 'textarea' },

];

const Amendment = () => {
    return (
        <div>
            <FormComponent formTitle="AMENDMENT REPORTING FORM" fields={formFields} />
        </div>
    );
};

export default Amendment;
