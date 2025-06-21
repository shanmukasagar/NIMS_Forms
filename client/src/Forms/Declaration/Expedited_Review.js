
import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css"; 
import TableComponent13 from  "./components/TableComponent13.js";
import axiosInstance from "../../components/AxiosInstance.js";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { IconButton, Tooltip } from '@mui/material';

function Section13({selectedForm}) {
  const [protocol_number, setProtocolNumber] = useState("");
  const [version_number, setVersionNumber] = useState("");
  const [principal_investigator_name, setPrincipalInvestigatorName] = useState("");
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [selectedElements, setSelectedElements] = useState([]);
  const [summary, setSummary] = useState("");
  const [name_of_co_investigator_1, setNameOfCoInvestigator1] = useState("");
  const [image, setImage] = useState(null); 
  const [date_1, setDate1] = useState(new Date().toISOString().split("T")[0]);
  const [date_2, setDate2] = useState(new Date().toISOString().split("T")[0]);

  const [showPreview, setShowPreview] = useState(false);
  const[existData,setExistData]=useState(null);
  const [email]=useState("");
  const navigate = useNavigate();
  const [openTable, setOpenTable] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [previewURL, setPreviewURL] = useState(null);

  useEffect(() => {
    if (editableData) {
      setProtocolNumber(editableData?.protocol_number || "");
      setVersionNumber(editableData?.version_number || "");
      setPrincipalInvestigatorName(editableData?.principal_investigator_name || "");
      setDepartment(editableData?.department || "");
      setTitle(editableData?.title || "");
      setSelectedElements(editableData?.selectedElements || []);
      setSummary(editableData?.summary || "");
      setNameOfCoInvestigator1(editableData?.name_of_co_investigator_1 || "");
      setImage(editableData?.image || null);
      setDate1(editableData?.date_1 ? new Date(editableData.date_1).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
      setDate2(editableData?.date_2 ? new Date(editableData.date_2).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    }
  }, [editableData]);


  const elementsList = [
    "No more than minimal risk to the trial participants",
    "Research involving clinical documentation materials that are nonidentifiable (data, documents, records);",
    "Research involving non-identifiable specimen and human tissue from sources like blood banks, tissue banks and left-over clinical samples;",
    "Any other reason, specify ",
  ];

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setSelectedElements([...selectedElements, value]);
    } else {
      setSelectedElements(selectedElements.filter((item) => item !== value));
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axiosInstance.post("/api/research/expedited_review", {
        selectedElements: selectedElements, protocol_number,version_number,principal_investigator_name, department,
        title,   summary,name_of_co_investigator_1, date_1, date_2,email
      }, { params : { selectedForm : selectedForm, isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", tableName : "expedited_review", formId : editableData?.form_id}});
      const id = userResponse.data.id;
      console.log("User created:", userResponse.data);

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("id", id);
        const uploadResponse = await axiosInstance.post(
          "/api/research/upload1",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Image uploaded:", uploadResponse.data);
      }
      navigate("/");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"expedited_review"
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

  const handleEdit = () => {
    setShowPreview(false);
  };

  // Handle file change
  const handleFileChange = (e) => { 
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
        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
          <h5 className="h2">Preview</h5>
          <p><strong>Protocol Number:</strong> {protocol_number}</p>
          <p><strong>Version Number: </strong>{version_number}</p>
          <p><strong>Date:</strong> {date_1}</p>
          <p><strong>Principal Investigator Name: </strong>{principal_investigator_name}</p>
          <p><strong>Department:</strong> {department}</p>
          <p><strong>Title</strong> {title}</p>
          <p> <strong>Summary:</strong> {summary}</p>
          <p><strong>Selected Elements: </strong>{selectedElements.join(", ")}</p>
          <p><strong>Name of PI/Researcher:</strong> {name_of_co_investigator_1}</p>
          <p><strong>Date: </strong>{date_2}</p>
          <p><strong>Uploaded File:</strong> </p>    {previewURL ? (
            <Tooltip title="View PDF">
              <IconButton onClick={() => window.open(previewURL, '_blank')} color="error" >
                <PictureAsPdfIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          ) : (
            <p>No file uploaded</p>
          )}

          <button onClick={handleSubmit} className="name">
             Submit
          </button>
          <button onClick={handleEdit} className="name">
            Edit
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      {(existData && openTable) ? ( <TableComponent13 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>):
        <form onSubmit={handlePreview}>
        <h1 className="hi">13. Application for Expedited Review</h1>
          <div >
            <div className="h2">
              <h2 className="h2">Study Protocol No:</h2>
              <input
                type="number" name="protocolnumber"
                placeholder="Number" value={protocol_number} onChange={(e) => 
                {setProtocolNumber(e.target.value)}}   className= "name"  required />
            </div>
            <br></br>
            <div className="h2">
              <h2 className="h2">Version number</h2>
              <input type="number"maxLength={10} pattern="\g{10}" name="version number"
                placeholder="Number" value={version_number} 
                onChange={(e) =>{ setVersionNumber(e.target.value);}} className="name"required />
            </div>
          </div>

          <div  className="h2">
            <h2 className="h2">Date</h2>
            <label>
              <input type="date" name="date"value={date_1}
                placeholder="YYYY/MM/DD" onChange={(e) => setDate1(e.target.value)}className="name"
                required
              />
            </label>
            <br />
          </div>
          <div className="h2">
          <h3 className="h2">1. Principal Investigator’s name: </h3>
          <input type="text" name="name"  placeholder="Enter Name"   value={principal_investigator_name} 
          onChange={(e) => { setPrincipalInvestigatorName(e.target.value); }} className="name" required/>
          </div>
          <br />
          <div >
            <div className="h2">
              <h2 className="h2">2. Department</h2>
              <input type="text"name="department"
                placeholder="Enter Department"   value={department} onChange={(e) => { 
                setDepartment(e.target.value);}}
                className="name"required/>
            </div><br />
            <div className="h2">
              <h2 className="h2">3. Title Of Project</h2>
              <input
                type="text" name="title" placeholder="Enter Title" value={title}  
                onChange={(e) => {setTitle(e.target.value);
                }}className="name"required/>
            </div>
          </div>
          <br></br>
          <h3 className="h2">4. Brief description of the project:</h3>
          <h3 className="h2">
            Please give a brief summary (approx. 300 words) of the nature of the
            proposal, including the aims / objectives / hypotheses of the
            project, rationale, study population, and procedures / methods to be
            used in the project.{" "}
          </h3>
          <textarea
            name="researchSummary" placeholder="Brief summary of the project" value={summary}
            onChange={(e) => setSummary(e.target.value)} className="custom-textarea"
             maxLength={600}required />
          <br />
          <h3 className="h2">
            5. State reasons why expedited review from NIEC is requested? (Tick
            applicable){" "}
          </h3>
          <div >
            <div className="h2"> 
              {elementsList.map((item, index) => (
                <label key={index} className="h2">
                  <br></br>
                  <input type="checkbox" value={item} checked={selectedElements.includes(item)}
                    onChange={handleCheckboxChange}/>   {""}
                  <br></br>
                  {item}
                </label> ))}
            </div>
          </div>
          <div className="h2" >
            <h2 className="h2">Name of PI / Researcher</h2>
            <label>
              <input type="text" name="researcher"  placeholder="Name"
                value={name_of_co_investigator_1} onChange={(e) => setNameOfCoInvestigator1(e.target.value)}
                className="name" required />
            </label>
          </div>
          <br></br>
          <div className="form-row">
            <div >
              <h2 className="h2">signature</h2>
              <label>
                <input type="file" name="image" accept="application/pdf"
                  onChange={handleFileChange}  className="name" required/>
              </label>
                {previewURL && (
                  <Tooltip title="View PDF">
                    <IconButton onClick={() => window.open(previewURL, '_blank')} color="error" >
                      <PictureAsPdfIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                )}
            </div>
            <div className="h2">
              <h2 className="h2">Date</h2>
              <label>
           <input type="date" name="date"  value={date_2}   placeholder="YYYY/MM/DD" 
            onChange={(e) => setDate2(e.target.value)} className="name"required /> 
             </label>
              <br />
            </div>
          </div>
          <button type="submit" className="name">
            Preview
          </button>
        </form>
}
</div>
</div>
);
}
export default Section13;