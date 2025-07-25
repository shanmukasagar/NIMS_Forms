import { useState ,useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import TableComponent10 from  "./components/TableComponent10.js";
import axiosInstance from "../../components/AxiosInstance.js";
import {useProject} from "../../components/ResearchContext";

const Section9 = ({selectedForm}) => {
const [support_type, setSupportType] = useState("");
const [additional, setAdditional] = useState("");

const fetchOnce = useRef(false);

const [preview, setPreview] = useState(false); 
const navigate = useNavigate();
const[existData,setExistData]=useState(null)
const [openTable, setOpenTable] = useState(false);
const [editableData, setEditableData] = useState({});
const [email]=useState("");

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

useEffect(() => {
  if (editableData) {
    setSupportType(editableData?.support_type || "");
    setAdditional(editableData?.additional || "");
  }
}, [editableData]);


  const handlePreview = (e) => {
    e.preventDefault();
    setPreview(true);
  };

  const handleEdit = () => {
    setPreview(false);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true); // Show loading
      const userResponse = await axiosInstance.post(
        "/api/research/additional_information",
        {
          support_type,
          additional, 
          email,
        }, { params : { selectedForm : selectedForm, 
          isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", 
          tableName : "additional_information", 
          formId: (editableData && Object.keys(editableData).length > 0 )? editableData?.form_id : projectId, 
      }}
      );
      console.log("User created:", userResponse.data);
      navigate("/declaration");
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
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"additional_information",// or hardcoded for now
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
        <h5 className="h2">preview </h5>
        <p><strong>Do you have any additional information to add?</strong> {support_type}</p>
        {support_type === "Yes" && (
          <p><strong>Details:</strong> {additional}</p>)}
        <button className="name" onClick={handleSubmit}  disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
        <button className="name" onClick={handleEdit}>Edit </button>
      </div>
    );
  }
  return (
    <div className="form-container">
        {(existData && openTable) ? (<TableComponent10 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData} />) :
      <form onSubmit={handlePreview}>
        <h1 className="hi">SECTION D: OTHER ISSUES </h1>
        <h2 className="h2">10. ADDITIONAL INFORMATION </h2>
        <div >
          <h3 className="h2">
            (a) Do you have any additional information to add in support of the
            application, which is not included elsewhere in the form? If yes,
            provide the details.{" "}
          </h3>
          <div className="radio-group">
            <label>
              <input required
                type="radio" name="additional" value="Yes"  checked={support_type === "Yes"}
                onChange={(e) => setSupportType(e.target.value)} />{" "}
              Yes
            </label>
            <label>
              <input type="radio"  name="additional" value="No" checked={support_type === "No"}
                onChange={(e) => setSupportType(e.target.value)}  />{" "}
              No
            </label>
          </div>
        </div>

        {support_type === "Yes" && (
          <div className="h">
            <h3>If yes, specify:</h3>
            <input type="text" name="additionalInformation"  placeholder="Enter details"  checked={additional === "Yes"} style = {{width : "100%"}}
            onChange={(e) => setAdditional(e.target.value)} className="name" required value = {additional}/>
            
          </div>
        )}
        <button type="submit" className="name">
          Preview
        </button>
      </form>
  }
    </div>
  );
};

export default Section9;