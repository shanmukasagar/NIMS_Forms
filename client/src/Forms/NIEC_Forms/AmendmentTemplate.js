import React from 'react';
import FormComponent from '../../components/FormComponent';

const formFields = [
    { name: 'doc_name', label: 'Name of document',  type: 'text' },
    { name: 'rev_version_no', label: 'Revised version number', type: 'text' },
    { name: 'rev_date', label: 'Revised Date', type: 'date' }, 
    { name: 'prev_version_info', label: 'Approved earlier version (mention version no. and date, section no. and page no.) ', type: 'text' }, 
    { name: 'rev_section_no', label: 'Revision details with section no', type: 'text' },
    { name: 'rev_page_no', label: 'Revision details with page no', type: 'text' },
    { name: 'pi_name', label: 'Name of Principal Investigator', type: 'text' },
    { name: 'signature', label: 'Signature of the Principal Investigator', type: 'file' },
    { name: 'signed_date', label: 'Date', type: 'date' },
];

const AmendmentTemplate = () => {
    return (
        <div>
            <FormComponent formTitle="Template for reporting amendment to NIEC " fields={formFields} formName = {"amendment_template"} />
        </div>
    );
};

export default AmendmentTemplate;