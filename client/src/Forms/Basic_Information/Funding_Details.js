import { useNavigate } from "react-router-dom";

import { useState,useEffect } from "react";
import "../../App.css";
import TableComponent3 from "./components/TableComponent3";
import axiosInstance from "../../components/AxiosInstance.js";

const FundingDetails = ({selectedForm}) => {

  const [total_estimated_budget, setTotalEstimatedBudget] = useState("");
  const [funding_source, setFundingSource] = useState("");

  const [showPreview, setShowPreview] = useState(false); 
  const[existData,setExistData]=useState(null)
  const [email]=useState("")
  const navigate = useNavigate();

  const [openTable, setOpenTable] = useState(false);
  const [editableData, setEditableData] = useState({});

  const Submit = async (e) => {
    e.preventDefault();

    try {
      const userResponse = await axiosInstance.post("/api/research/funding_budgett_and_details",
        {
          total_estimated_budget,  funding_source, email,}, { params : { selectedForm : selectedForm,
             isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", tableName : "funding_budgett_and_details", formId : editableData?.form_id}}
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

  useEffect(() => {
    if(editableData) {
      setTotalEstimatedBudget(editableData?.total_estimated_budget || "");
      setFundingSource(editableData?.funding_source || "");
    }

  },[editableData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"funding_budgett_and_details"
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
    e.preventDefault();
    setShowPreview(true);
  };

  const handleEdit = () => {
    setShowPreview(false);
  };

  if (showPreview) {
    return (
      <div className="form-container">
        <h1 className="h2"> preview</h1>
        <div className="h">
          <p><strong>Total Estimated Study Budget:</strong> ₹{total_estimated_budget}</p>
          <p><strong>Funding Source:</strong> {funding_source}</p>
        </div>
        <button onClick={Submit} className="name">Confirm & Submit</button>
        <button onClick={handleEdit} className="name">Edit</button>
      </div>
    );
  }

  return (
    <div className="form-container">
        {(existData && openTable ) ? (<TableComponent3 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>) :
        (<form>
        <h1 className="hi">2. FUNDING DETAILS AND BUDGET</h1>
        <h2 className="h2">a. Total estimated study budget:</h2>
        <input
          type="number"  name="budget" value={total_estimated_budget} 
          onChange={(e) => setTotalEstimatedBudget(e.target.value)} placeholder="Enter Budget Amount" className="name"
          required />
        
        <h2 className="h2">b. Funding source:</h2>
        <select
          name="fundingSource" value={funding_source} onChange={(e) => setFundingSource(e.target.value)}  
          className="name" required >
          <option value="" disabled>Select Funding Type</option>
          <option value="self-funding">Self-funding</option>
          <option value="institutional">Institutional funding</option>
          <option value="agency">Funding agency</option>
        </select>
        <br />
        <br></br>
        <button onClick={handlePreview} className="name">
          Preview
        </button>
      </form>
)
}
</div> 
);
};

export default FundingDetails;