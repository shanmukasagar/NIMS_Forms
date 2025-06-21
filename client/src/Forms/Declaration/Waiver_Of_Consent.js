import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import TableComponent14 from  "./components/TableComponent14.js";
import axiosInstance from "../../components/AxiosInstance.js";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { IconButton, Tooltip } from '@mui/material';

function Section14({selectedForm}) {
  const [principal_investigator_name, setPrincipalInvestigatorName] =useState("");
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [selectedElements, setSelectedElements] = useState([]);
  const [summary, setSummary] = useState("");
  const [name_of_co_investigator_1, setNameOfCoInvestigator1] = useState("");
  const [image, setImage] = useState(null); 
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [showPreview, setShowPreview] = useState(false);
  const[existData,setExistData]=useState(null);
  const [email]=useState("");
  const navigate = useNavigate();
  const [openTable, setOpenTable] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [previewURL, setPreviewURL] = useState(null);

  const elementsList = [
    "research cannot practically be carried out without the waiver and the waiver is scientifically justified",
    "retrospective studies, where the participants are de-identified or cannot be contacted",
    "research on anonymized biological samples/data",
    "certain types of public health studies/surveillance programmes/programme evaluation studies",
    "research on data available in the public domain",
    "research during humanitarian emergencies and disasters, when the participant may not be in a position to give consent.",
  ];

  useEffect(() => {
    if (editableData) {
      setPrincipalInvestigatorName(editableData?.principal_investigator_name || "");
      setDepartment(editableData?.department || "");
      setTitle(editableData?.title || "");
      setSelectedElements(editableData?.selectedElements || []);
      setSummary(editableData?.summary || "");
      setNameOfCoInvestigator1(editableData?.name_of_co_investigator_1 || "");
      setImage(editableData?.image || null);
      setDate(editableData?.date ? new Date(editableData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
    }
  }, [editableData]);


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
      const userResponse = await axiosInstance.post("/api/research/requesting_waiver",
        {
          selectedElements: selectedElements,  principal_investigator_name,
          department,title,summary,name_of_co_investigator_1,date,
        }, { params : { selectedForm : selectedForm, isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", tableName : "requesting_waiver", formId : editableData?.form_id}}
      );
      const id = userResponse.data.id;
      console.log("User created:", userResponse.data);
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("id", id);
        const uploadResponse = await axiosInstance.post("/api/research/upload2",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Image uploaded:", uploadResponse.data);
      }
      alert("Application successfully completed"); 
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
            form_type:"requesting_waiver"// or hardcoded for now
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
      <div className="form-container">
        <div className="h">
          <h5 className="h2">Preview</h5>
          <p><strong>Principal Investigator Name: </strong>{principal_investigator_name}</p>
          <p><strong>Department:</strong> {department}</p>
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Selected Elements:</strong> {selectedElements.join(", ")}</p>
          <p><strong>Summary: </strong>{summary}</p>
          <p><strong>Name of PI/Researcher:</strong> {name_of_co_investigator_1}</p>
          <p><strong>Date:</strong>{date}</p>
          {previewURL ? (
            <Tooltip title="View PDF">
              <IconButton onClick={() => window.open(previewURL, '_blank')} color="error" >
                <PictureAsPdfIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          ) : (
            <p>No file uploaded</p>
          )}
          <button onClick={handleSubmit} className="name"> Submit </button>
          <button onClick={handleEdit} className="name"> Edit </button>
        </div>
      </div>
    );
  }
  return (
    <div >
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
      {(existData && openTable) ? ( <TableComponent14 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>):
        <form onSubmit={handlePreview}>
        <h1 className="hi">
          14. Application Form for Requesting Waiver of Consent
        </h1>
          <h3 className="h2">1. Principal Investigator’s name: </h3>
          <div className="h2">
          <input
            type="text" name="name" placeholder="Enter Name" value={principal_investigator_name}
            onChange={(e) => {setPrincipalInvestigatorName(e.target.value); }}
            className="name" required/>
            </div>
          <br />
          <div >
            <div className="h2"> 
              <h2 className="h2">2. Department</h2>
              <input type="text"  name="department" placeholder="Enter Department" value={department}
                onChange={(e) => {setDepartment(e.target.value);}} className="name" required/>
            </div>
            <br />
            <div className="h2">
              <h3 className="h2">3. Title </h3>
              <input type="text" name="title"  placeholder="Enter Title"value={title}
                onChange={(e) => {setTitle(e.target.value); }} className="name" required/>
            </div>
          </div>
          <br></br>

          <h3 className="h2">
            4. Reason for waiver of informed consent: (Please tick as
            applicable){" "}
          </h3>
          <div >
            <div className="h2">
              {elementsList.map((item, index) => (
                <label key={index} className="h2">
                  <br></br>
                  <input type="checkbox"
                    value={item} checked={selectedElements.includes(item)}   onChange={handleCheckboxChange} />{""}
                  <br></br>
                  {item}
                </label>
              ))}
            </div>
          </div>

          <h3 className="h2">Any other reason (please specify)</h3>
          <textarea name="researchSummary" placeholder="Specify"  value={summary}
            onChange={(e) => setSummary(e.target.value)} className="custom-textarea"  maxLength={600}  required />
          <br />
          <div className="form-group">
            <h3 className="h2">Name of Principal Investigator / Researcher</h3>
            <div className="h2">
            <label>
              <input type="text" name="researcher" placeholder="Enter researcher"value={name_of_co_investigator_1}
                onChange={(e) => setNameOfCoInvestigator1(e.target.value)}  className="name" required/>
            </label>
            </div>
          </div>
          <br></br>

          <div >
            <div className="h2">
              <h3 className="h2">signature</h3>
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
            <div className="h2" >
              <h3 className="h2">Date</h3>
              <label>
                <input type="date" name="date" value={date}
                  placeholder="YYYY/MM/DD"  onChange={(e) => setDate(e.target.value)} className="name"required />
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

export default Section14;