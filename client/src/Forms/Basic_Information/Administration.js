import React, { useEffect, useState, useRef} from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "./components/TableComponent.js"; 
import "../../App.css";
import axiosInstance from "../../components/AxiosInstance.js";

function Administration({ setAdminId, selectedForm }) {
  const [name_of_research_principal, setNameOfResearchPrincipal] = useState("");
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [review_requested, setReviewRequested] = useState("");
  const [protocol_number, setProtocolNumber] = useState("");
  const [version_number, setVersionNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [date_1,setDate1]=useState("")
  const [email]=useState("")
  const [summary, setSummary] = useState("");
  const [selectedElements, setSelectedElements] = useState([]);
  const [otherReason, setOtherReason] = useState("");

  const elementsList = [
    "No more than minimal risk to the trial participants",
    "Research involving clinical documentation materials that are nonidentifiable (data, documents, records);",
    "Research involving non-identifiable specimen and human tissue from sources like blood banks, tissue banks and left-over clinical samples;",
    "Any other reason, specify ",
  ];

  const [showPreview, setShowPreview] = useState(false);
  const[existData,setExistData]=useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({review_requested: "",email:""});
  const [openTable, setOpenTable] = useState(false);
  const [editableData, setEditableData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  //Handle type of review change
  const handleChange = async (e) => { 
    const value = e.target.value;
    setReviewRequested(value);
  };

  // Checkbox handler
  const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setSelectedElements((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleFinalSubmit = async () => {
      try {
        const userResponse = await axiosInstance.post( "/api/research/administrativee_details",
          {
            name_of_research_principal, department, title, review_requested, protocol_number,
            version_number, date, email, date_1, summary, selected_elements : selectedElements, other_reason : otherReason,
          },
          {
            params: {
              selectedForm: selectedForm,
              isEdit: editableData && Object.keys(editableData).length > 0 ? "true" : "false",
              tableName: "administrativee_details",
              formId: editableData?.form_id,
            },
          }
        );

        const idd = userResponse.data.idd;
        console.log("User created:", userResponse.data);
        setAdminId(idd);
        navigate("/basic/details");
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );    }
    }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin",
          {
            params: {
              form_type: "administrativee_details", 
            },
          }
        );
        if (response.data.length > 0) {
          setExistData(response.data); 
          setOpenTable(true);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setExistData([]);
      }
    };
  
    fetchData();
  }, [email]);

  useEffect(() => {
  if (editableData) {
    setNameOfResearchPrincipal(editableData?.name_of_research_principal || "");
    setDepartment(editableData?.department || "");
    setTitle(editableData?.title || "");
    setReviewRequested(editableData?.review_requested || "");
    setProtocolNumber(editableData?.protocol_number || "");
    setVersionNumber(editableData?.version_number || "");
    setDate(new Date().toISOString().split('T')[0]);

    const isoDate = editableData?.date_1;
    const formattedDate = isoDate ? new Date(isoDate).toISOString().split('T')[0] : "";
    setDate1(formattedDate);

    setSummary(editableData?.summary || "");
    setSelectedElements(editableData?.selected_elements || []);
    setOtherReason(editableData?.other_reason || "");

    setIsEdit(true);
  }
}, [editableData]);

  
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
        <div className="h">
          <h2 className="h2">Preview</h2>
          <p><strong>Name of Research principal:</strong> {name_of_research_principal}</p>
          <p><strong>Department:</strong> {department}</p>
          <p><strong>Submission Date:</strong> {date}</p>
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Review requested:</strong> {review_requested}</p>
          <p><strong>Protocol Number:</strong> {protocol_number}</p>
          <p><strong>Version Number:</strong> {version_number}</p>
          <p><strong>Dated:</strong> {date_1}</p>

          {review_requested === "Expedited Review" && (
            <>
              <p><strong>Summary:</strong> {summary}</p>
              <p><strong>Expedited Review Reasons:</strong></p>
              <ul>
                {selectedElements.map((item, index) => (
                  <li key={index}>
                    {item === "Any other reason, specify " ? `${item} - ${otherReason}` : item}
                  </li>
                ))}
              </ul>
            </>
          )}

          <br />
          <button className="name" onClick={handleFinalSubmit}>Submit</button>
          <br />
          <button className="name" onClick={handleEdit}>Edit</button>
        </div>
      </div>

    );
  }
  return (
    <div className="form-container">
      <div className="h">
      {(existData && openTable) ? (<TableComponent data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>) :
      (<form onSubmit={handlePreview}>
        <h1 className="hi">SECTION A - BASIC INFORMATION</h1>
        <h2 className="h2"> ADMINISTRATIVE DETAILS</h2>
            <h2 className="h2">Name of Principal Investigator /Researcher: </h2>
            <input type="text" placeholder="Enter Name"  value={name_of_research_principal} 
            onChange={(e) => {setNameOfResearchPrincipal(e.target.value)}}
              className="name" required />
            <div className="form-row">
              <div className="form-group">
                <h2 className="h2">Department</h2>
                <input type="text" value={department }   placeholder="Enter Department"    
                onChange={(e) => {setDepartment(e.target.value);}}  className="name" required/>  </div>
                <div className="form-group">
                <h2 className="h2">Date of submission</h2>
                <input type="date" value={date} readOnly className="name" required />
              </div>

              <div >
                <h2 className="h2">Title of the study</h2>
                <input  type="text" value={title } placeholder="Enter title"  onChange={(e) => { setTitle(e.target.value);}}className="name"required/>
              </div>
            </div>
            <div>

            <div>
              <h2 className="h2">Type of review requested: </h2>

              <label><input type="radio" name="review_requested" value="Expedited Review" required checked={review_requested === "Expedited Review"} onChange={handleChange} /> Expedited Review</label>
              <label><input type="radio" name="review_requested" value="Full Committee Review" checked={review_requested === "Full Committee Review"} onChange={handleChange} /> Full Committee Review</label>

              {review_requested === "Expedited Review" && (
                <>
                  <h2 className="custom-textt">If applying for Expedited Review, Kindly also fill the Expedited review application form</h2>

                  <h3 className="h2">4. Brief description of the project:</h3>
                  <h3 className="h2">Please give a brief summary (approx. 300 words) of the nature of the proposal, including the aims / objectives / hypotheses of the project, rationale, study population, and procedures / methods to be used in the project.</h3>
                  <textarea name="researchSummary" placeholder="Brief summary of the project" value={summary} 
                    onChange={(e) => setSummary(e.target.value)} className="custom-textarea" maxLength={600} required />

                  <h3 className="h2">5. State reasons why expedited review from NIEC is requested? (Tick applicable)</h3>
                  <div className="h2" style = {{display : "flex", flexDirection : "column", gap : "15px"}}>
                    {elementsList.map((item, index) => (
                      <div key={index} className="h2">
                            <label><input type="checkbox" value={item} checked={selectedElements.includes(item)} onChange={handleCheckboxChange} /> {item}</label>
                            {item === "Any other reason, specify " && selectedElements.includes(item) && ( 
                              <input type="text" placeholder="Please specify other reason" value={otherReason} 
                                onChange={(e) => setOtherReason(e.target.value)} style = {{width : "100%", padding : "10px", fontSize : "16px"}} required />)}
                          </div>
                        ))}
                      </div>

                </>
              )}
            </div>
            <div className="input-row">
          <div >
          <h2 className="h2">Protocol number</h2>
        <input type="text"  value={protocol_number} onChange={(e) => setProtocolNumber(e.target.value)}
        className="name"  placeholder="Enter protocol" required/> </div>
        <div>
        <h2 className="h2">Version number</h2>
        <input
          type="text" value={version_number } onChange={(e) => setVersionNumber(e.target.value)}
          className="name" placeholder="Enter version"  required/>
      </div>
      <div>
        <h2 className="h2">Dated</h2>
      <input type="date"  value={date_1}    onChange={(e) => setDate1(e.target.value)}className="name"required/>  </div>
        </div>      
            </div>
            <br></br>
            <button type="submit" className="name">Preview</button>
              </form>
          )
        }
      </div>
    </div>
  );
}
export default Administration;