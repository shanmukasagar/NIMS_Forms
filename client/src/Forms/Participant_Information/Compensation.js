import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import TableComponent8 from  "./components/TableComponent8.js";
import axiosInstance from "../../components/AxiosInstance.js";
import {useProject} from "../../components/ResearchContext";

const Section7 = ({selectedForm}) => {

 const [waiver_consent_type, setWaiverConsentType] = useState("");
 const [specify, setSpecify] = useState("");
 const [specific, setSpecific] = useState("");
 const [compensation_research_of_type, setCompensationResearchOfType] =useState("");

  const fetchOnce = useRef(false);

 const [showPreview, setShowPreview] = useState(false);
 const[existData,setExistData]=useState(null)
 const [email,]=useState("");
 const navigate = useNavigate();
 const [openTable, setOpenTable] = useState(false);
 const [editableData, setEditableData] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const handleSubmit = async () => {
   try {
      setIsSubmitting(true); // Show loading
      const userResponse = await axiosInstance.post("/api/research/payment_compensation",
        {
          waiver_consent_type, specify,compensation_research_of_type,  specific, email,
        }, { params : { selectedForm : selectedForm, 
          isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", 
          tableName : "payment_compensation",
          formId : (editableData && Object.keys(editableData).length > 0 )? editableData?.form_id : projectId,
        }}
      );
      console.log("User created:", userResponse.data);
      navigate("/participant/confidentiality");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
    finally {
      setIsSubmitting(false); // Hide loading
    }
  };

  useEffect(() => {
    if(editableData) {
      setWaiverConsentType(editableData?.waiver_consent_type || "");
      setSpecify(editableData?.specify || "");
      setCompensationResearchOfType(editableData?.compensation_research_of_type || "");
      setSpecific(editableData?.specific || "");
    }
  },[editableData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"payment_compensation", // or hardcoded for now
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
    <div className="form-container">    
      {showPreview ? (
        <div className="h">
          <h3 className="h2">Preview </h3>
          <p><strong>Waiver of Consent:</strong> {waiver_consent_type}</p>
          {waiver_consent_type === "Yes" && (
            <p><strong>Waiver Details:</strong> {specify}</p>
          )}
          <p><strong>Compensation for SAE:</strong> {compensation_research_of_type}</p>
          {compensation_research_of_type === "Yes" && (
            <p><strong>Compensation Details:</strong> {specific}</p>
          )}
          <button className="name" onClick={handleEdit}>Edit</button>
          <button className="name" onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
        </div>
      ):

        (existData && openTable) ? ( <TableComponent8 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/> )
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
              <input type="radio"  name="waiver" value="Yes" checked={waiver_consent_type === "Yes"}  
                onChange={(e) => setWaiverConsentType(e.target.value)} required  />Yes
            </label>
            <label>
              <input type="radio" name="waiver" value="No"  checked={waiver_consent_type === "No"} 
                onChange={(e) => setWaiverConsentType(e.target.value)}   />No
            </label>
            <label>
              <input type="radio" name="waiver" value="NA"  checked={waiver_consent_type === "NA"} 
                onChange={(e) => setWaiverConsentType(e.target.value)}   />NA
            </label>
            { waiver_consent_type === "Yes" && (
              <React.Fragment>
                <h3 className="h2">Kindly specify:</h3>
                <textarea type="text" name="specifydata" placeholder="Specify"value={specify}
                onChange={(e) => setSpecify(e.target.value)}  className="custom-textarea" maxLength={600} required/>
              </React.Fragment>
            )}
            
          </div>
        </div>
        <div className="h">
          <h3>
            (b) Is there a provision for compensation of research related SAE?{" "}
          </h3>
          <div className="radio-group">
            <label>
              <input type="radio"  name="compensation" value="Yes"  checked={compensation_research_of_type === "Yes"}
                onChange={(e) => setCompensationResearchOfType(e.target.value)}  required />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio" name="compensation" value="No" checked={compensation_research_of_type === "No"}
                onChange={(e) => setCompensationResearchOfType(e.target.value)}/>{" "}
              No
            </label>
            <label>
              <input
                type="radio" name="compensation" value="NA" checked={compensation_research_of_type === "NA"}
                onChange={(e) => setCompensationResearchOfType(e.target.value)}/>{" "}
              NA
            </label>
          </div>
          { compensation_research_of_type === "Yes" && (
            <React.Fragment>
              <h3 className="custom">Kindly specify:</h3>
              <textarea name="specific"  placeholder="Specify"   value={specific} onChange={(e) => setSpecific(e.target.value)} 
                className="custom-textarea" maxLength={600} required/>
            </React.Fragment>
          )}
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