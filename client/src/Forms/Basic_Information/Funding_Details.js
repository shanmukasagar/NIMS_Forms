import { useNavigate } from "react-router-dom";

import { useState,useEffect } from "react";
import "../../App.css";
import TableComponent3 from "./components/TableComponent3";
import axiosInstance from "../../components/AxiosInstance.js";
const FundingDetails = () => {
  const [total_estimated_budget, setTotalEstimatedBudget] = useState("");
  const [funding_source, setFundingSource] = useState("");
  const [showPreview, setShowPreview] = useState(false); 
  const[existData,setExistData]=useState(null)
  const [email]=useState("")
  const navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();

    try {
      const userResponse = await axiosInstance.post("/api/research/funding_budgett_and_details",
        {
          total_estimated_budget,  funding_source, email,}
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
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"funding_budgett_and_details"
          }
        });
        if (response.data.length > 0) {
          setExistData(response.data); 
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
        {existData ? (<TableComponent3 data={existData} />) :
        (<form>
        <h1 className="hi">2. FUNDING DETAILS AND BUDGET</h1>
        <h2 className="h2">a. Total Estimated Study Budget:</h2>
        <input
          type="number"  name="budget" value={total_estimated_budget} 
          onChange={(e) => setTotalEstimatedBudget(e.target.value)} placeholder="Enter Budget Amount" className="name"
          required />
        <br />
        <h2 className="h2">b. Funding Source:</h2>
        <select
          name="fundingSource" value={funding_source} onChange={(e) => setFundingSource(e.target.value)}  
          className="name" required >
          <option value="">Select Funding Type</option>
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