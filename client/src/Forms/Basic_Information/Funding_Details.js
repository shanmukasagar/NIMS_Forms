import { useNavigate } from "react-router-dom";

import React, { useState,useEffect, useRef } from "react";
import "../../App.css";
import TableComponent3 from "./components/TableComponent3";
import axiosInstance from "../../components/AxiosInstance.js";

//Funding Forms
import Self_Funding from "../Funding_Forms/Self_Funding.js";
import Industry_Funding from "../Funding_Forms/Industry_Funding.js";
import Funded_Studies from "../Funding_Forms/Funding_Studies.js";
import SelfFundingPreview from "../Funding_Forms/Self_Funding_Preview.js";
import FundingStudiesPreview from "../Funding_Forms/Funding_Studies_Preview.js";
import IndustryFundingPreview from "../Funding_Forms/Industry_Funding_Preview.js";
import {useProject} from "../../components/ResearchContext";

const FundingDetails = ({selectedForm}) => {

  const [total_estimated_budget, setTotalEstimatedBudget] = useState("");
  const [funding_source, setFundingSource] = useState("");
  const [funding_FormData, setFundingFormData] = useState({});
  const [fundingTableName, setFundingTableName] = useState("");

  const [showPreview, setShowPreview] = useState(false); 
  const[existData,setExistData]=useState(null)
  const [email]=useState("")
  const navigate = useNavigate();
  const fetchOnce = useRef(false);

  const [openTable, setOpenTable] = useState(false);
  const [editableData, setEditableData] = useState({});

  const Submit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axiosInstance.post("/api/research/funding_budgett_and_details",
        {
          total_estimated_budget,  funding_source, funding_FormData,  email,}, 
          { params : 
            { selectedForm : selectedForm, fundingTableName : fundingTableName,
             isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", 
             tableName : "funding_budgett_and_details", 
             formId: (editableData && Object.keys(editableData).length > 0 ) ? editableData?.form_id : projectId
          }}
      );
   
      console.log("User created:", userResponse.data);
      navigate("/research/overview");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

   //context
  const { projectId } = useProject();

  useEffect(() => {
    if(!fetchOnce.current) {
      fetchOnce.current = true;
      if (!projectId) { // Redirect to dashboard if project id is not there filled
        alert("Administrative Details must be filled first. The project reference is missing due to page refresh. To continue editing, please use the 'Edit' button from the dashboard.");
        navigate('/investigator');
      }
    }
  }, []);

  useEffect(() => {
    if(editableData) {
      setTotalEstimatedBudget(editableData?.total_estimated_budget || "");
      setFundingSource(editableData?.funding_source || "");
      setFundingFormData(editableData?.funding_FormData || {});
      if(editableData?.funding_source === "self-funding") {
        setFundingTableName("self_funded_studies");
      }
      else if(editableData?.funding_source === "Pharmaceutical Industry sponsored") {
        setFundingTableName("industry_sponsored_studies");
      }
      else if((editableData?.funding_source === "institutional" || editableData?.funding_source === "agency")) {
        setFundingTableName("funding_studies");
      }
    }

  },[editableData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"funding_budgett_and_details",
            formId : projectId
          }
        });
        if (response.data.length > 0) {
          setExistData(response.data); 
          setOpenTable(true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setExistData(null);
      }
    };
  
    fetchData();
  }, [email]);
  
  const handlePreview = (e) => {
    setShowPreview(true);
  };

  const handleEdit = () => {
    setShowPreview(false);
  };


  // Handle change of selected funding option
  const handleFundingOption = (e) => {
    const selectedOption = e.target.value;
    if(selectedOption === "self-funding") {
      setFundingFormData({
        proposedBudget: '', costPerPatient: '', totalProjectCost: '', isOutsourced: 'no',
        nimsInvestigations: [{ name: '', cost: '' }],
        outsourcedInvestigations: [{ name: '', cost: '', lab: '', nabl: '' }]
      });
      setFundingTableName("self_funded_studies");
    }
    else if(selectedOption === "Pharmaceutical Industry sponsored") {
      setFundingFormData({
        sponsorName: '', sponsorPAN: '', sponsorGST: '', totalGrant: '',
        budgetItems: [
          { label: 'Per completed patients total sponsor grant', value: '' },
          { label: 'Per completed patients manpower sponsor grant (PI, Co-PI, coordinator, others)', value: '' },
          { label: 'Per completed patients overhead', value: '' },
          { label: 'Startup fee', value: '' },
          { label: 'Archival fee', value: '' }
        ],
        nimsInvestigations: [{ name: '', cost: '' }],
        personnel: [{ designation: '', fees: '' }],
        isOutsourced: 'no',
        outsourcedInvestigations: [{ name: '', lab: '', nabl: '' }]
      });
      setFundingTableName("industry_sponsored_studies");
    }
    else if(selectedOption === "institutional" || selectedOption === "agency") {
      setFundingFormData({
        fundingAgency: '', grantPerPatient: '', manpowerGrant: '', totalGrant: '',
        nimsInvestigations: [{ name: '', cost: '' }],
        isOutsourced: 'no',
        outsourcedInvestigations: [{ name: '', cost: '', lab: '', nabl: '' }]
      });
      setFundingTableName("funding_studies");
    }
    setFundingSource(selectedOption);

  }

  if (showPreview) {
    return (
      <div className="form-container">
        <h1 className="h2"> preview</h1>
        <div className="h">
          <p><strong>Total Estimated Study Budget:</strong> ₹{total_estimated_budget}</p>
          <p><strong>Funding Source:</strong> {funding_source}</p>
          {funding_source === "self-funding" && (
            <SelfFundingPreview data = {funding_FormData}/>
          )}
          {(funding_source === "institutional" || funding_source === "agency") && (
            <FundingStudiesPreview data = {funding_FormData}/>
          )}
          {funding_source === "Pharmaceutical Industry sponsored" && (
            <IndustryFundingPreview data = {funding_FormData}/>
          )}
        </div>
        <button onClick={Submit} className="name">Confirm & Submit</button>
        <button onClick={handleEdit} className="name">Edit</button>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="form-container">
            {(existData && openTable ) ? (<TableComponent3 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>) :
            (<form onSubmit = {handlePreview}>
            <h1 className="hi">2. FUNDING DETAILS AND BUDGET</h1>
            <h2 className="h2">a. Total estimated study budget:</h2>
            <input
              type="number"  name="budget" value={total_estimated_budget} 
              onChange={(e) => setTotalEstimatedBudget(e.target.value)} placeholder="Enter Budget Amount" className="name"
              required />
            
            <h2 className="h2">b. Funding source:</h2>
            <select
              name="fundingSource" value={funding_source} onChange={handleFundingOption}  
              className="name" required >
              <option value="" disabled>Select Funding Type</option>
              <option value="self-funding">Self-funding</option>
              <option value="institutional">Institutional funding</option>
              <option value="agency">Funding agency</option>
              <option value="Pharmaceutical Industry sponsored">Pharmaceutical Industry sponsored</option>
            </select>
            <br />
            {funding_source === "self-funding" && (
              <Self_Funding funding_FormData = {funding_FormData} setFundingFormData = {setFundingFormData}/>
            )}
            {(funding_source === "institutional" || funding_source === "agency") && (
              <Funded_Studies funding_FormData = {funding_FormData} setFundingFormData = {setFundingFormData}/>
            )}
            {funding_source === "Pharmaceutical Industry sponsored" && (
              <Industry_Funding funding_FormData = {funding_FormData} setFundingFormData = {setFundingFormData}/>
            )}

            <button type = "submit" className="name">Preview</button>
          </form>
    )
    }
      </div>
    </React.Fragment> 
);
};

export default FundingDetails;