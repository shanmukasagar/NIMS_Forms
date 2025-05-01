import React from 'react';
import FormComponent from '../../components/FormComponent';

const formFields = [
    { name: 'document_name', label: 'Name of document',  type: 'text' },
    { name: 'revised_version_no', label: 'Revised version number', type: 'text' },
    { name: 'revised_date', label: 'Revised Date', type: 'date' }, 
    { name: 'earlier_version', label: 'Approved earlier version (mention version no. and date, section no. and page no.) ', type: 'text' }, 
    { name: 'section_no', label: 'Revision details with section no', type: 'text' },
    { name: 'page_no', label: 'Revision details with page no', type: 'text' },
    { name: 'name', label: 'Name of Principal Investigator', type: 'text' },
    { name: 'signature', label: 'Signature of the Principal Investigator', type: 'file' },
    { name: 'date', label: 'Date', type: 'date' },
];

const AmendmentTemplate = () => {
    return (
        <div>
            <FormComponent formTitle="Template for reporting amendment to NIEC " fields={formFields} />
        </div>
    );
};

export default AmendmentTemplate;