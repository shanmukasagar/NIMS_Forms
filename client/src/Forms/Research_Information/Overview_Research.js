import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";

import "../../App.css";
import TableComponent4 from  "./TableComponent4.js";
import axiosInstance from "../../components/AxiosInstance.js";

const OverviewResearch = ({selectedForm}) => {
const [summary, setSummary] = useState("");
const [type_of_study, setTypeOfStudy] = useState("");
const [external_laboratory, setExternalLaboratory] = useState("");
const [specify, setSpecify] = useState("");
const [image, setImage] = useState(null);
const [otherStudyType, setOtherStudyType] = useState("");
const [sampleSize, setSampleSize] = useState("");
const [justification, setJustification] = useState("");

const[existData,setExistData]=useState(null)
const [email]=useState("")
const [showPreview, setShowPreview] = useState(false); 
const navigate = useNavigate();

const [openTable, setOpenTable] = useState(false);
const [editableData, setEditableData] = useState({})
const [previewURL, setPreviewURL] = useState(null);

const Submit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axiosInstance.post("/api/research/overvieww_research",
        {
          summary, type_of_study, external_laboratory, specify, otherStudyType, sampleSize, justification,  email,
        }, { params : { selectedForm : selectedForm, isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", tableName : "overvieww_research", formId : editableData?.form_id}}
      );
      const id = userResponse.data.id;
      console.log("User created:", userResponse.data);

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("id", id);

        const uploadResponse = await axiosInstance.post("/api/research/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Image uploaded:", uploadResponse.data);
      }
      navigate("/participant/recruitment");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    setSummary(editableData?.summary || "");
    setTypeOfStudy(editableData?.type_of_study || "");
    setExternalLaboratory(editableData?.external_laboratory || "");
    setSpecify(editableData?.specify || "");
    setImage(editableData?.image || null); // Assuming image could be null or a URL/blob
    setOtherStudyType(editableData?.otherStudyType);
    setJustification(editableData?.justification);
    setSampleSize(editableData?.sample_size)
  }, [editableData])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"overvieww_research"
          }
        });
        if (response.data.length > 0) {
          setExistData([response.data[response.data.length - 1]]);
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

  const handleFileChange = (e) => { // Handle file change
    const file = e.target.files[0];

    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    setImage(file);

    const url = URL.createObjectURL(file);
    setPreviewURL(url);
  };

  if (showPreview) {
    return (
      <div className="h">
        <h3 className="h2">Preview</h3>
        <p><strong>Summary:</strong> {summary}</p>
        <p><strong>Type of Study:</strong> {type_of_study}</p>
        {
          type_of_study === "others" && (
            <p><strong>Other Study Type:</strong> {otherStudyType}</p>
          )
        }
        <p><strong>External Lab Involved:</strong> {external_laboratory}</p>
        {external_laboratory === "Yes" && (
          <p><strong>Lab Details:</strong> {specify}</p> )}
          <p><strong>sample size:</strong>{sampleSize} </p> 
        <p><strong>Justification:</strong>{justification} </p>  
        <button onClick={Submit} className="name"> Submit</button>
        <button onClick={handleEdit} className="name">Edit</button>
      </div>
    );
  }

    return (
    <div >
    {(existData && openTable ) ? (<TableComponent4 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>) :
    (  <form onSubmit={handlePreview}>
      <h2 className="hi">SECTION B - RESEARCH RELATED INFORMATION</h2>
      <h2 className="h2">3. OVERVIEW OF RESEARCH</h2>
        <h2 className="h1">(a). Summary of study (within 300 words)</h2>
        <textarea name="researchSummary" placeholder="Enter research summary" value={summary}
          onChange={(e) => setSummary(e.target.value)} className="custom-textarea"   maxLength={600} required/>
        <div>
          <h3 className="h2">(b). Type of study</h3>
          <select name="studyType" value={type_of_study} onChange={(e) => setTypeOfStudy(e.target.value)} className="name" required >
            <option value="" disabled>Select study type</option>
            <option value="interventional">Interventional Studies</option>
            <option value="case-control">Case Control / Cohort / Prospective Observation Study</option>

            <option value="retrospective">Retrospective</option>
            <option value="epidemiological">Epidemiological / Public Health</option>
            <option value="cross-sectional">Cross-sectional</option>
            <option value="sociobehavioural">Socio-behavioural</option>
            <option value="others">Any Others</option>
          </select>
        </div>
        {type_of_study === "others" && (
          <div className="h1">
            <h3>If others, specify:</h3>
            <input  style = {{width : "100%"}} type="text" name="otherStudyType"  placeholder="Enter details"   value={otherStudyType} 
              onChange={(e) => setOtherStudyType(e.target.value)} className="name"  required/>
          </div>
        )}

        <h2 className="h2">4. METHODOLOGY</h2>
        <div className="form-group">
          <h2 className="custom-text">Sample size:</h2>
          <input  style = {{width : "100%"}} type="text" name="sample_size"  placeholder="Sample Size"   value={sampleSize} 
              onChange={(e) => setSampleSize(e.target.value)} className="name"  required/>
          <h2 className="h2">Justification for the sample size chosen:</h2>
          <input  style = {{width : "100%"}} type="text" name="justification"  placeholder="Enter Justification"   value={justification} 
              onChange={(e) => setJustification(e.target.value)} className="name"  required/>
        </div>

        <div className="h">
          <h3>Is there an external laboratory / outsourcing involved for investigations?</h3>
          <div className="radio-group">
            <label>
              <input type="radio" name="laboratory" value="Yes" checked={external_laboratory === "Yes"}  
              onChange={(e) => setExternalLaboratory(e.target.value)} required  />{" "}
              Yes
            </label>
            <label>
              <input type="radio"  name="laboratory"   value="No"
                checked={external_laboratory === "No"} onChange={(e) => setExternalLaboratory(e.target.value)}
              />{" "}
              No
            </label>
            <label>
              <input type="radio"  name="laboratory"   value="NA"
                checked={external_laboratory === "NA"} onChange={(e) => setExternalLaboratory(e.target.value)}
              />{" "}
              NA
            </label>
          </div>
        </div>

        {external_laboratory === "Yes" && (
          <div className="h1">
            <h3>If yes, specify:</h3>
            <input  style = {{width : "100%"}} type="text" name="laboratoryDetails"  placeholder="Enter details"   value={specify} 
              onChange={(e) => setSpecify(e.target.value)} className="name"  required/>
              
          </div>
        )}
       <br></br>
        <button type = "submit" className="name">Preview </button>
       </form>
      )
      }
    </div>
  );
};

export default OverviewResearch ;