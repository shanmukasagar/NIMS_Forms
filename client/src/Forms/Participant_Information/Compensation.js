import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import TableComponent8 from  "./components/TableComponent8.js";
import axiosInstance from "../../components/AxiosInstance.js";
const Section7 = () => {
 const [waiver_consent_type, setWaiverConsentType] = useState("");
 const [specify, setSpecify] = useState("");
 const [specific, setSpecific] = useState("");
 const [compensation_research_of_type, setCompensationResearchOfType] =useState("");
 const [showPreview, setShowPreview] = useState(false);
 const[existData,setExistData]=useState(null)
 const [email,]=useState("");
 const navigate = useNavigate();
 
 const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };
  const handleEdit = () => {
    setShowPreview(false);
  };
  const handleSubmit = async () => {
   try {
      const userResponse = await axiosInstance.post("/api/research/payment_compensation",
        {
          waiver_consent_type, specify,compensation_research_of_type,  specific,email,
        }
      );
      console.log("User created:", userResponse.data);
      navigate("/participant/confidentiality");
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
            form_type:"payment_compensation"// or hardcoded for now
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
    <div className="form-container">    
      {showPreview ? (
        <div className="h">
          <h3 className="h2">Preview </h3>
          <p><strong>Waiver of Consent:</strong> {waiver_consent_type}</p>
          <p><strong>Waiver Details:</strong> {specify}</p>
          <p><strong>Compensation for SAE:</strong> {compensation_research_of_type}</p>
          <p><strong>Compensation Details:</strong> {specific}</p>
          <button className="name" onClick={handleEdit}>Edit</button>
          <button className="name" onClick={handleSubmit}>Submit</button>
        </div>
      ):

        existData ? ( <TableComponent8 data={existData} /> )
     :(
         <form onSubmit={handlePreview}>
          <h1 className="h1">8. PAYMENT /COMPENSATION</h1>
         <h3 className="h2">
         (a) Is there a provision for treatment free of cost for research related
         injuries?{" "}
        </h3>
        <div className="h">
      
          <div className="radio-group">
            <label>
              <input type="radio"  name="waiver" value="Yes"checked={waiver_consent_type === "Yes"}  
              onChange={(e) => setWaiverConsentType(e.target.value)}   />{" "} {""}Yes
            </label>
            <label>
              <input
                type="radio" name="waiver" value="No"  checked={waiver_consent_type === "No"} 
                onChange={(e) => setWaiverConsentType(e.target.value)}   />{" "}  {""}
              No
            </label>
            <h3 className="h2">Kindly specify:</h3>
            <textarea
              type="text" name="specifydata" placeholder="Enter research summary"value={specify}
              onChange={(e) => setSpecify(e.target.value)}  className="custom-textarea" maxLength={600} required/>
          </div>
        </div>
        <div className="h">
          <h3>
            (b) Is there a provision for compensation of research related SAE?{" "}
          </h3>
          <div className="radio-group">
            <label>
              <input type="radio"  name="compensation" value="Yes"  checked={compensation_research_of_type === "Yes"}
                onChange={(e) => setCompensationResearchOfType(e.target.value)}   />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio" name="compensation" value="No" checked={compensation_research_of_type === "No"}
                onChange={(e) => setCompensationResearchOfType(e.target.value)}/>{" "}
              No
            </label>
          </div>
          <h3 className="custom">Kindly specify:</h3>
          <textarea
            name="specific"  placeholder="Enter research summary"   value={specific}
            onChange={(e) => setSpecific(e.target.value)} className="custom-textarea" maxLength={600} required/>
        </div>
       <br></br>
        <button type="submit" className="name">
          Preview{" "}
        </button>
      </form>
    )}    
</div>  
  );
};

export default Section7;