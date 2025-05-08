import React, {useState, useEffect, useRef} from 'react';
import FormComponent from '../../components/FormComponent';
import {getSubmittedData} from "./NIEC_Config";
import NIEC_Form_Preview from './NIEC_Form_Preview';

const formFields = [

    { name: 'doc_name', label: 'Name of document', type: 'text' , required: true},
    { name: 'rev_version_no', label: 'Revised version number', type: 'text', required: true },
    { name: 'rev_date', label: 'Revised Date', type: 'date', required: true },
    { name: 'prev_version_info', label: 'Approved earlier version (mention version no. and date, section no. and page no.)', type: 'text', required: true },
    { name: 'rev_section_no', label: 'Revision details with section no', type: 'text', required: true },
    { name: 'rev_page_no', label: 'Revision details with page no', type: 'text', required: true },
    { name: 'pi_name', label: 'Name of Principal Investigator', type: 'text', required: true },
    { name: 'pi_signature', label: 'Signature of the Principal Investigator', type: 'file', required: true },
    { name: 'signed_date', label: 'Date', type: 'date', required: true },
];
  

const AmendmentTemplate = () => {

    const [data, setData] = useState({});
    const fetchOnce = useRef(false);
    
    useEffect(() => {
        if(!fetchOnce.current) {
            fetchOnce.current = true;
            getSubmittedData("amendment_template", setData);
        }

    }, [])
    
    return (
        <React.Fragment>
            {
                data?.formsResult?.length > 0 ?
                    (<NIEC_Form_Preview formData={data.formsResult[0]} imagePreview={`http://localhost:4000/${data.imageData.imageUrl}`} 
                        fields={formFields} isSubmitted = {true} />) :
                    (
                        <div>
                            <FormComponent formTitle="Template for reporting amendment to NIEC " fields={formFields} formName = {"amendment_template"}/>
                        </div>
                    )
            }
        </React.Fragment>
    );
};

export default React.memo(AmendmentTemplate);