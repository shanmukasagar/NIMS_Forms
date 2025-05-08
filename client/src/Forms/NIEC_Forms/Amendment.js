import React, {useState, useEffect, useRef} from 'react';
import FormComponent from '../../components/FormComponent';
import {getSubmittedData} from "./NIEC_Config";
import NIEC_Form_Preview from './NIEC_Form_Preview';

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

    const [data, setData] = useState({});
    const fetchOnce = useRef(false);

    useEffect(() => {
        if(!fetchOnce.current) {
            fetchOnce.current = true;
            getSubmittedData("amendment_form", setData);
        }

    }, [])

    return (
        <React.Fragment>
            {
                data?.formsResult?.length > 0 ?
                    (<NIEC_Form_Preview formData={data.formsResult[0]} imagePreview={""} 
                        fields={formFields} isSubmitted = {true} />) :
                    (
                        <div>
                            <FormComponent formTitle="Amendment Reporting Form" fields={formFields} formName={"amendment_form"} />
                        </div>
                    )
            }
        </React.Fragment>
    );
};

export default React.memo(Amendment);
