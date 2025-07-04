import React, { useState ,useEffect, useRef} from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import TableComponent5 from  "./components/TableComponent5.js";
import axiosInstance from "../../components/AxiosInstance.js";
import {useProject} from "../../components/ResearchContext";

const Section4 = ({selectedForm}) => {
  const [type_of_participants, setTypeOfParticipant] = useState("");
  const [justification, setJustification] = useState("");
  const [specifiy, setSpecifiy] = useState("");
  const [additional_safeguards, setAdditionalSafeguards] = useState("");
  const [reimbursement_details, setReimbursementDetails] = useState("");
  const [advertisement_type, setAdvertisementType] = useState("");
  const [advertisement_details, setAdvertisementDetails] = useState("");
  const [vulnerableGroups, setVulnerableGroups] = useState([]);
  const [payment_type, setPaymentType] = useState("");

  const [openTable, setOpenTable] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [isPreview, setIsPreview] = useState(false);
  const[existData,setExistData]=useState(null)
  const [email]=useState("")
  const navigate = useNavigate();
  const fetchOnce = useRef(false);

  const vulnerableOptions = [
    "Economically and socially disadvantaged",
    "Unduly influenced due to fear/benefits",
    "Children (up to 18 years)",
    "Women in special situations",
    "Tribals and marginalized communities",
    "Refugees, migrants, homeless, etc.",
    "Mentally ill / cognitively impaired / disabled",
    "Terminally ill / rare disease patients",
    "Persons with diminished autonomy",
  ] ;

  // Handle vulnerable group
  const handleVulnerableGroupChange = (option) => {
    setVulnerableGroups((prev) => {
      const isChecked = prev.includes(option);
      return isChecked
        ? prev.filter((item) => item !== option)
        : [...prev, option];
    });
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


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userResponse = await axiosInstance.post("/api/research/participantt_related_information",
        {
          type_of_participants, justification, specifiy, additional_safeguards,  reimbursement_details,  vulnerableGroups,
          advertisement_type, advertisement_details, payment_type, email

        }, { params : { selectedForm : selectedForm, 
          isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", 
          tableName : "participantt_related_information", 
          formId : (editableData && Object.keys(editableData).length > 0 )? editableData?.form_id : projectId,
        }}
      );
      console.log("User created:", userResponse.data);
      navigate("/participant/benefits");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (editableData) {
      setTypeOfParticipant(editableData?.type_of_participants || "");
      setJustification(editableData?.justification || "");
      setSpecifiy(editableData?.specifiy || "");
      setAdditionalSafeguards(editableData?.additional_safeguards || "");
      setReimbursementDetails(editableData?.reimbursement_details || "");
      setAdvertisementType(editableData?.advertisement_type || "");
      setAdvertisementDetails(editableData?.advertisement_details || "");
      setPaymentType(editableData?.payment_type || "");
      setVulnerableGroups(editableData?.vulnerablegroups || []);
    }
  }, [editableData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:" participantt_related_information ",   // or hardcoded for now
            formId : projectId// or hardcoded for now
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

  //Handle participant type
  const handleParticipantType = (e) => {
    const value = e.target.value;
    if(e.target.value === "vulnerable"){
      setJustification("");
      setAdditionalSafeguards("");
      setVulnerableGroups([]);
    }
    else if(value === "others"){
      setSpecifiy("");
    }
    setTypeOfParticipant(value);
  }

  return (
      <div >
      <div className="h">
      {(existData && openTable) ? ( <TableComponent5 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>):   !isPreview ? (
      <form onSubmit ={(e) => { e.preventDefault(); setIsPreview(true); }}>
      <h3 className="hi">SECTION C - PARTICIPANT RELATED INFORMATION</h3>
      <h2 className="h2">5. RECRUITMENT OF RESEARCH PARTICIPANTS</h2>
          <h3>(a) Type of Participants in the Study:</h3>
          <select value={type_of_participants} onChange={handleParticipantType} className="name" required >
            <option value="">Select Participant Type</option>
            <option value="healthy">Healthy Volunteer</option>
            <option value="patient">Patient</option>
            <option value="vulnerable">Vulnerable Person / Special Groups</option>
            <option value="others">Others (Specify)</option>
          </select>

        {type_of_participants === "others" && (
          <>
            <h3>Specify Other Participant Type:</h3>
            <input type="text" value={specifiy}onChange={(e) => setSpecifiy(e.target.value)}
              className="name"  required /> 
          </>
        )}

        {type_of_participants === "vulnerable" && (
          <React.Fragment>
            <h3>(b) If study includes Vulnerable population, then<br></br> 
                i.Provide Justification for inclusion (if vulnerable):</h3>
              <textarea  value={justification}   onChange={(e) => setJustification(e.target.value)} 
                className="custom-textarea" placeholder="Provide justification"  required />
              <h3>ii. Are there any additional safeguards to protect research participants?</h3>

              <textarea value={additional_safeguards} onChange={(e) => setAdditionalSafeguards(e.target.value)}
              className="custom-textarea" placeholder="Additional safeguards" required/>
              <div sx={{ display: "flex", flexDirection: "column", gap: "8px",  }} >
                {type_of_participants === "vulnerable" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h4>Select Vulnerable Populations</h4>
                    {vulnerableOptions.map((option, index) => (
                      <label
                        key={index}
                        style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc", cursor: "pointer", backgroundColor: "#f9f9f9", transition: "background-color 0.3s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(25,118,210,0.08)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={vulnerableGroups.includes(option)}
                          onChange={() => handleVulnerableGroupChange(option)}
                          style={{ width: "18px", height: "18px", accentColor: "#1976d2", cursor: "pointer" }}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
          </React.Fragment>
        )}

            <h3>(c) Is there any reimbursement/ payment to the subject for participation?</h3>
            <label>
              <input type="radio" value="Yes" checked={payment_type === "Yes"} required onChange={(e) => setPaymentType(e.target.value)} /> Yes </label>
            <label>
            <input type="radio" value="No"   checked={payment_type === "No"} 
             onChange={(e) => setPaymentType(e.target.value)}
            /> No
          </label>
          <label>
            <input type="radio"   value="NA"  checked={payment_type === "NA"} 
            onChange={(e) => setPaymentType(e.target.value)}
            /> NA
          </label>

          {payment_type === "Yes" && (
            <>
              <h3>If yes,provide details:</h3>
              <input type="text"  value={reimbursement_details}  style = {{width : "100%"}} 
              onChange={(e) => setReimbursementDetails(e.target.value)} className="name"   required />
            </> )}
          <h3>(d) Will advertisement be used to recruit subjects?</h3>

          <label>
            <input type="radio"  value="Yes"checked={advertisement_type === "Yes"}   
            onChange={(e) => setAdvertisementType(e.target.value)} /> Yes
          </label>

          <label>
            <input
              type="radio"  value="No" checked={advertisement_type === "No"} 
               onChange={(e) => setAdvertisementType(e.target.value)}  /> No </label>
             {advertisement_type === "Yes" && (
            <>
              <h3>If yes,specify details of advertising:</h3>
              <input type="text" value={advertisement_details} style = {{width : "100%"}}
              onChange={(e) => setAdvertisementDetails(e.target.value)} className="name"  required />  </>   )}
          <br></br>
          <button type="submit" className="name">Preview</button>
          </form>
          ) : (
         <div className="preview-section">
          <h3>Preview </h3>
          <p><strong>Type of Participant:</strong> {type_of_participants}</p>
          {type_of_participants === "vulnerable" && (
            <React.Fragment>
              <p><strong>Justification:</strong> {justification}</p>
              <p><strong>Additional Safeguards:</strong> {additional_safeguards}</p>
              <div>
                <strong>Vulnerable Groups:</strong>
                {vulnerableGroups.length > 0 ? (
                  vulnerableGroups.map((group, index) => (
                    <div key={index}>{group}</div>
                  ))
                ) : (
                  <div>None</div>
                )}
              </div>
            </React.Fragment>
          )}
          {type_of_participants === "others" && (
            <>
              <p><strong>Specify:</strong> {specifiy}</p> 
              <p><strong>Payment Type:</strong> {payment_type}</p>
            </>
          )}
            
          {payment_type === "Yes" && (
            <p><strong>Reimbursement Details:</strong> {reimbursement_details}</p> )}
          <p><strong>Advertisement Used:</strong> {advertisement_type}</p>
          {advertisement_type === "Yes" && (
            <p><strong>Advertisement Details:</strong> {advertisement_details}</p>)}
        
          <button onClick={() => setIsPreview(false)} className="name">Edit</button>
          <button onClick={handleSubmit} className="name">Submit</button>
        </div>
      )}
    </div>
    </div>  
  );
};

export default Section4;