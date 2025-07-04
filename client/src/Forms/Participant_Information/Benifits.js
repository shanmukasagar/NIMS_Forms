import { useState,useEffect, useRef } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

import TableComponent6 from  "./components/TableComponent6.js";
import axiosInstance from "../../components/AxiosInstance.js";
import {useProject} from "../../components/ResearchContext";


const Section5 = ({selectedForm}) => {
  const [anticipated_type, setAnticipatedType] = useState("");
  const [reimbursement_details, setReimbursementDetails] = useState("");
  const [management_strategy, setManagementStrategy] = useState("");
  const [participant_benefits, setParticipantBenefits] = useState("");
  const [improvement_benefits, setImprovementBenefits] = useState("");
  const [society_benefits, setSocietyBenefits] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const[existData,setExistData]=useState(null);
  const [openTable, setOpenTable] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [email]=useState("");

  const navigate = useNavigate();
  const fetchOnce = useRef(false);

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

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };
  const handleEdit = () => {
    setShowPreview(false);
  };

  useEffect(() => {
      if(editableData) {
        setAnticipatedType(editableData?.anticipated_type || "");
        setReimbursementDetails(editableData?.reimbursement_details || "");
        setManagementStrategy(editableData?.management_strategy || "");
        setParticipantBenefits(editableData?.participant_benefits || "");
        setImprovementBenefits(editableData?.improvement_benefits || "");
        setSocietyBenefits(editableData?.society_benefits || "");
      }
    },[editableData])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axiosInstance.post( "/api/research/benefits_and_risk",
        {
          improvement_benefits, reimbursement_details,
          management_strategy, participant_benefits, anticipated_type, society_benefits, email,
        }, { params : { selectedForm : selectedForm, 
          isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", 
          tableName : "benefits_and_risk", 
          formId : (editableData && Object.keys(editableData).length > 0 )? editableData?.form_id : projectId, 
        }}
      );
      console.log("User created:", userResponse.data);
      navigate("/participant/informedconsent");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"benefits_and_risk",  // or hardcoded for now
            formId : projectId
          }
        });
        if (response.data.length > 0) {
          setExistData(response.data); // You probably meant setExistData, not setExistData
          setOpenTable(true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setExistData(null);
      }
    };
    fetchData();
  }, [email]);

  return (
    <div className="h">
       {(existData && openTable) ? ( <TableComponent6 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData} />):!showPreview ? (  
      <form onSubmit={handlePreview}>
      <h2 className="hi">6.BENEFITS AND RISKS</h2>
      <h3 className="h2">
        (a)(i). Are there any anticipated physical / social / psychological
        discomforts / risk to participants?{" "}
      </h3>
        <label>
          <input  type="radio"  name="enter anticipatedtype" value="Yes"
            checked={anticipated_type === "Yes"} onChange={(e) => setAnticipatedType(e.target.value)}
          />{" "}  {""}
          Yes
        </label>
        <label>
          <input
            type="radio"  name="enteranticipatedtype"   value="No"
            checked={anticipated_type === "No"}  onChange={(e) => setAnticipatedType(e.target.value)}
          />{" "}
          {""}
          No
        </label>
        <label>
          <input
            type="radio" name="anticipatedtype"   value="NA"
            checked={anticipated_type === "NA"}
         onChange={(e) => setAnticipatedType(e.target.value)}  />{" "}
         {""}NA
        </label>
         {anticipated_type === "Yes" && (
          <>
            <h5>if yes specify:</h5>
            {/* Show input if "Yes" is selected */}
       
            <input style = {{width : "100%"}}
              type="text" name="EnterreimbursementDetails" placeholder="specify" value={reimbursement_details}
              onChange={(e) => setReimbursementDetails(e.target.value)} className="name"  required/>
            <div className="formm-row">
              <h3 className="h2">i. Describe the risk management strategy: </h3>
              <label>
                <textarea name="researchSummary" placeholder="Risk management strategy" value={management_strategy}
                  onChange={(e) => setManagementStrategy(e.target.value)}
                  className="custom-textarea" maxLength={600}  required />
                {""}
              </label>
            </div>
          </>
        )}
        <h3 className="h2">(b)Are there potential benefits from the study </h3>

        <div className="formm-row">
          <h4>For the participant</h4>
          <div className="formm-row">
            <label>
          <input type="radio" name="participantBenefit" value="Direct" required
            checked={participant_benefits === "Direct"} onChange={(e) => setParticipantBenefits(e.target.value)}/>{" "}
              Direct
            </label>
            <label>
              <input
                type="radio"name="participantBenefit" value="Indirect"  checked={participant_benefits === "Indirect"}
                onChange={(e) => setParticipantBenefits(e.target.value)}  />{" "}
              Indirect
            </label>
          </div>
        </div>

        <div className="formm-row">
          <h4>For the society/ community</h4>
          <div className="formm-row">
            <label>
              <input  type="radio"  name="societyBenefit" value="Direct" required
                checked={society_benefits === "Direct"} onChange={(e) => setSocietyBenefits(e.target.value)} />{" "}
              Direct
            </label>

            <label>
              <input
                type="radio" name="societyBenefit"  value="Indirect"
                checked={society_benefits === "Indirect"} onChange={(e) => setSocietyBenefits(e.target.value)}
              />{" "}
              Indirect
            </label>
          </div>
        </div>

        <div className="formm-row">
          <h4>For Improvement in science</h4>

          <div className="formm-row">
            <label>
              <input type="radio"  name="improvementBenefit"  value="Direct" required
                checked={improvement_benefits === "Direct"} onChange={(e) => setImprovementBenefits(e.target.value)}
              />{" "}
              Direct
            </label>

            <label>
              <input
                type="radio"name="improvementBenefit"  value="Indirect"
                checked={improvement_benefits === "Indirect"} onChange={(e) => setImprovementBenefits(e.target.value)}
              />{" "}
              Indirect
            </label>
          </div>
        </div>
       <br></br>
        <button type="submit" className="name">
          Preview{" "}
        </button>
      </form>
      ): (
      <div className="preview-section">
     <h2 className="h2">Preview </h2>
    <p><strong>Anticipated Risk:</strong> {anticipated_type}</p>
     {anticipated_type === "Yes" && (
     <p><strong>Reimbursement Details:</strong> {reimbursement_details}</p>)}
     <p><strong>Risk Management Strategy:</strong> {management_strategy}</p>
     <p><strong>Participant Benefits:</strong> {participant_benefits}</p>
     <p><strong>Society Benefits:</strong> {society_benefits}</p>
     <p><strong>Scientific Benefits:</strong> {improvement_benefits}</p>

     <button onClick={handleEdit} className="name">Edit</button>
     <button onClick={handleSubmit} className="name">Submit</button>
    </div>
)}
</div>
  );
};
export default Section5;