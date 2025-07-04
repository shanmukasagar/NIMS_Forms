import React, { useState ,useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";

import "../../App.css";
import TableComponent9 from  "./components/TableComponent9.js";
import axiosInstance from "../../components/AxiosInstance.js";
import {useProject} from "../../components/ResearchContext";

const Section8 = ({selectedForm}) => {

  const fetchOnce = useRef(false);

 const[sample_access_type,setSampleAccessType]=useState("");
 const[sample_details,setSampleDetails]=useState("");
 const [control_details, setControlDetails] = useState("");
 const [access_details, setAccessDetails] = useState("");
 const [drugs_access_type, setDrugsAccessType] = useState("");
 const [document_access_type, setDocumentAccessType] = useState("");
 const [identifierPrecautions, setIdentifierPrecautions] = useState("");

 const [preview, setPreview] = useState(false); 
 const[existData,setExistData]=useState(null)
 const [email]=useState("");
 const navigate = useNavigate();
 const [openTable, setOpenTable] = useState(false);
 const [editableData, setEditableData] = useState({});

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
    setPreview(true);
  };

  const handleEdit = () => {
    setPreview(false);
  };

  const handleSubmit = async () => {
    try {
      const userResponse = await axiosInstance.post("/api/research/storage_and_confidentiality",
        {
          document_access_type, access_details,
          drugs_access_type,control_details, sample_access_type,  sample_details,  email,
        }, { params : { selectedForm : selectedForm, 
          isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", 
          tableName : "storage_and_confidentiality", 
          formId : (editableData && Object.keys(editableData).length > 0 )? editableData?.form_id : projectId,
        }}
      );
      console.log("User created:", userResponse.data);
      navigate("/issues/additional");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
  if (editableData) {
    setSampleAccessType(editableData?.sample_access_type || "");
    setSampleDetails(editableData?.sample_details || "");
    setControlDetails(editableData?.control_details || "");
    setAccessDetails(editableData?.access_details || "");
    setDrugsAccessType(editableData?.drugs_access_type || "");
    setDocumentAccessType(editableData?.document_access_type || "");
    setIdentifierPrecautions(editableData?.identifierPrecautions || "");
  }
}, [editableData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"storage_and_confidentiality",     // or hardcoded for now
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

  if (preview) {
    return (
      <div className="h">
        <h3 className="h1">Preview </h3>
        <p><strong>Sample Access Type:</strong> {sample_access_type}</p>
        {sample_access_type === "Yes" && (
          <>
            <p><strong>Sample Details:</strong> {sample_details}</p>
            {sample_details === "Identifiable" && (
              <p><strong> Identifier Precautions:</strong> {identifierPrecautions}</p>
            )}
          </>)}
        <p><strong>Document Access Type:</strong> {document_access_type}</p>
        {document_access_type === "Yes" && (
          <p><strong>Control Details:</strong> {control_details}</p>)}
        <p><strong>Drugs Access Type:</strong> {drugs_access_type}</p>
        {drugs_access_type === "Yes" && (
          <p><strong>Access Details:</strong> {access_details}</p>)}
        <button className="name" onClick={handleSubmit}>
          Submit
        </button>
        <button className="name" onClick={handleEdit}>
          Edit
        </button>
      </div>
    );
  }
  return (
         <div className="form-container">
          {(existData && openTable) ? (<TableComponent9 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>) :
          <form onSubmit={handlePreview}>
          <h1 className="h1">9. STORAGE AND CONFIDENTIALITY </h1>
          <h1 className="h2">(a) Identifying Information: Study Involves samples / data.</h1>
          <div className="h2">
            <h3 className="h2"> </h3>
            <div className="radio-group">
            <label>
                <input type="radio" name="sampleaccesstype" value="Yes" checked={sample_access_type === "Yes"}  required
                onChange={(e) => setSampleAccessType(e.target.value)}/>{" "} Yes
              </label>
              <label>
                <input
                  type="radio" name="sampleaccesstype" value="No" checked={sample_access_type === "No"} 
                  onChange={(e) => setSampleAccessType(e.target.value)}/>{" "}No
              </label>
              <label>
                <input type="radio"  name="sampleaccesstype" value="NA" checked={sample_access_type === "NA"} 
                onChange={(e) => setSampleAccessType(e.target.value)}/>{" "}NA
              </label>
            </div>
        </div>
       <br></br>
        {/* Show input if "Yes" is selected */}
        {sample_access_type === "Yes" && (
          <div className="h2">
            <label>
            <input  type="radio" name="sampledetails" value="Unidentified" required
              checked={sample_details === "Unidentified"} onChange={(e) => setSampleDetails(e.target.value)} />Anonymous / unidentified
            </label>
            <label>
              <input type="radio" name="sampledetails"  value="Identifiable" checked={sample_details === "Identifiable"}
                onChange={(e) => setSampleDetails(e.target.value)} />
            Identifiable
            </label><br></br>
            <br></br>
            {sample_details === "Identifiable" && (
              <React.Fragment>
                <h3 className="h2">  If identifiers must be retained, what additional precautions will be taken to ensure that
                  access is limited / confidentiality is maintained? (e.g. data stored in a cabinet, password
                  protected computer etc.) Kindly specify? </h3>
                
                <input type = "text"  placeholder = "specify" name = "identifierPrecautions" value = {identifierPrecautions}  required 
                  style = {{width : "100%", padding : "10px", fontSize : "16px"}}
                  onChange = {(e) => setIdentifierPrecautions(e.target.value)}/>
              </React.Fragment>
            )}
            
            </div>
        )}
        <div>
          <h1 className="h2">
            (b) Will the study documents be under access control?
          </h1>
          <div className="h2">
            <label>
              <input type="radio"  name="accessControl"  value="Yes" required
                checked={document_access_type === "Yes"}  onChange={(e) => setDocumentAccessType(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input type="radio" name="accessControl"  value="No"
                checked={document_access_type === "No"} onChange={(e) => setDocumentAccessType(e.target.value)}
              />{" "}
              No
            </label>
            <label>
              <input  type="radio"  name="accessControl"  value="NA"
                checked={document_access_type === "NA"} onChange={(e) => setDocumentAccessType(e.target.value)}
              />{" "}
              NA
            </label>
          </div>
        </div>

        {/* Show input if "Yes" is selected */}
        {document_access_type === "Yes" && (
          <div className="h2">
            <h5>Specify Access Control Details:</h5>
            <input type="text" name="accessDetails"  placeholder="Enter details" value={control_details}
              onChange={(e) => setControlDetails(e.target.value)} className="name"   required 
              style = {{width : "100%", padding : "10px", fontSize : "16px"}}/>
            <br />
          </div>
        )}
        <div >
          <h1 className="h2">
            (c) Will the study drugs / devices be under access control?
          </h1>
          <div className="h2">
            <label>
              <input type="radio" name="drugsControl" value="Yes"  required
                checked={drugs_access_type === "Yes"} onChange={(e) => setDrugsAccessType(e.target.value)} 
              />{" "}
              Yes
            </label>
            <label>
              <input type="radio"  name="drugsControl"  value="No" checked={drugs_access_type === "No"}
                onChange={(e) => setDrugsAccessType(e.target.value)} 
              />{" "}
              No
            </label>
            <label>
              <input type="radio"  name="drugsControl" value="NA" checked={drugs_access_type === "NA"}
              onChange={(e) => setDrugsAccessType(e.target.value)}  />{" "}NA
            </label>
          </div>
        </div>

        {drugs_access_type === "Yes" && (
          <div className="h2">
            <h5>Specify Access Control Details:</h5>
            <input type="text" name="drugsDetails"placeholder="Enter details"  value={access_details} style = {{width : "100%", padding : "10px", fontSize : "16px"}}
             onChange={(e) => setAccessDetails(e.target.value)}     required/>
            <br /></div>  )}
           <button type="submit" style = {{marginTop : "30px"}} className="name">
          Preview
        </button>
      </form>
}
    </div>
  );
};

export default Section8;