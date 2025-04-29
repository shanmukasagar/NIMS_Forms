import { useState,useEffect } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

import TableComponent6 from  "./components/TableComponent6.js";
import axiosInstance from "../../components/AxiosInstance.js";
const Section5 = () => {
  const [anticipated_type, setAnticipatedType] = useState("");
  const [reimbursement_details, setReimbursementDetails] = useState("");
  const [management_strategy, setManagementStrategy] = useState("");
  const [participant_benefits, setParticipantBenefits] = useState("");
  const [improvement_benefits, setImprovementBenefits] = useState("");
  const [society_benefits, setSocietyBenefits] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const[existData,setExistData]=useState(null)
  const [email]=useState("");
  const navigate = useNavigate();

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };
  const handleEdit = () => {
    setShowPreview(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axiosInstance.post( "/api/research/benefits_and_risk",
        {
          improvement_benefits, reimbursement_details,
          management_strategy, participant_benefits, anticipated_type, society_benefits, email,
        }
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
            form_type:"benefits_and_risk"// or hardcoded for now
          }
        });
        if (response.data.length > 0) {
          setExistData(response.data); // You probably meant setExistData, not setExistData
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
       {existData ? ( <TableComponent6 data={existData} />):!showPreview ? (  
      <form onSubmit={handlePreview}>
      <h2 className="hi">6.BENIFITS AND RISKS</h2>
      <h3 className="h2">
        (a)(i).Are there any anticipated physical / social / psychological
        discomforts / risk{" "}
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
        <h5>if yes specify:</h5>
        {/* Show input if "Yes" is selected */}
        {anticipated_type === "Yes" && (
          <>
            <h3>Provide Reimbursement Details:</h3>
            <input
              type="text" name="EnterreimbursementDetails" placeholder="Enter details" value={reimbursement_details}
              onChange={(e) => setReimbursementDetails(e.target.value)} className="name"  required/>
            <br />
          </>
        )}
        <div className="formm-row">
          <h3 className="h2">i. Describe the risk management strategy: </h3>
          <label>
            <textarea
              name="researchSummary" placeholder="Enter research summary" value={management_strategy}
              onChange={(e) => setManagementStrategy(e.target.value)}
              className="custom-textarea" maxLength={600}  required />
            {""}
          </label>
        </div>

        <h3 className="h2">(b)Are there potential benefits from the study </h3>

        <div className="formm-row">
          <h4>For the participant</h4>
          <div className="formm-row">
            <label>
          <input
            type="radio" name="EnterparticipantBenefit" value="Direct"
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
              <input  type="radio"  name="societyBenefit" value="Direct"
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
              <input type="radio"  name="improvementBenefit"  value="Direct"
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