import { useState ,useEffect} from "react";


import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";
import TableComponent9 from  "./components/TableComponent9.js";
const Section8 = (adminId) => {
  const[sample_access_type,setSampleAccessType]=useState("");
  const[sample_details,setSampleDetails]=useState("");

  const [control_details, setControlDetails] = useState("");
  const [access_details, setAccessDetails] = useState("");
  const [drugs_access_type, setDrugsAccessType] = useState("");
  const [document_access_type, setDocumentAccessType] = useState("");
  const [preview, setPreview] = useState(false); 
  const[existData,setExistData]=useState(null)
  const [email,setEmail]=useState("");
  const navigate = useNavigate();
 
  

  const handlePreview = (e) => {
    e.preventDefault();
    setPreview(true);
  };

  const handleEdit = () => {
    setPreview(false);
  };

  const handleSubmit = async () => {

    try {
      const userResponse = await axios.post(
        "http://localhost:4000/api/research/storage_and_confidentiality",
        {
          document_access_type,
          access_details,
          drugs_access_type,
          control_details,
          sample_access_type,
          sample_details,
          administrativeDetailId:adminId,
          email,

        }
      );
      const id = userResponse.data.id;
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
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/research/check/admin", { 
          params : {
            form_type:"storage_and_confidentiality"// or hardcoded for now
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


  if (preview) {
    return (
      <div className="h">
        <h3 className="h1">Preview </h3>
        <p><strong>Sample Access Type:</strong> {sample_access_type}</p>
        {sample_access_type === "Yes" && (
          <>
            <p><strong>Sample Details:</strong> {sample_details}</p>
          </>
        )}
        <p><strong>Document Access Type:</strong> {document_access_type}</p>
        {document_access_type === "Yes" && (
          <p><strong>Control Details:</strong> {control_details}</p>
        )}
        <p><strong>Drugs Access Type:</strong> {drugs_access_type}</p>
        {drugs_access_type === "Yes" && (
          <p><strong>Access Details:</strong> {access_details}</p>
        )}

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
      {existData ? (<TableComponent9 data={existData} />) :
      <form onSubmit={handlePreview}>
<h1 className="h1">9. STORAGE AND CONFIDENTIALITY </h1>

      <h1 className="h2">(a)Identifying Information: Study Involves samples / data.</h1>
      <div className="h2">
          <h3 className="h2">
          
          </h3>
          <div className="radio-group">
            <label>
              <input type="radio" name="sampleaccesstype" value="Yes" checked={sample_access_type === "Yes"} onChange={(e) => setSampleAccessType(e.target.value)}   />{" "} Yes
            </label>
            <label>
              <input
                type="radio" name="sampleaccesstype" value="No" checked={sample_access_type === "No"}  onChange={(e) => setSampleAccessType(e.target.value)}/>{" "}No
            </label>
            <label>
              <input type="radio"  name="sampleaccesstype" value="NA" checked={sample_access_type === "NA"} onChange={(e) => setSampleAccessType(e.target.value)}/>{" "}NA
            </label>
          </div>
        </div>
<br></br>

        {/* Show input if "Yes" is selected */}
        {sample_access_type === "Yes" && (
          <div className="h2">
           
            <label>
            <input
              type="radio"
              name="sampledetails"
              value="Unidentified"
              checked={sample_details === "Unidentified"}
              onChange={(e) => setSampleDetails(e.target.value)}
            />{""}
            Unidentified
            </label>
        
          <label>
              <input
                type="radio"
                name="sampledetails"
                value="Identifiable"
                checked={sample_details === "Identifiable"}
                onChange={(e) => setSampleDetails(e.target.value)}
              />{" "}
         Identifiable
            </label><br></br>
            <br></br>
            <h3 className="h2">
            If identifiers must be retained, what additional precautions will be taken to ensure that
access is limited / confidentiality is maintained? (e.g. data stored in a cabinet, password
protected computer etc.) Kindly specify? </h3>
            </div>



        )}
      
        <div>
          <h1 className="h2">
            (b)Will the study documents be under access control?
          </h1>
          <div className="h2">
            <label>
              <input
                type="radio"
                name="accessControl"
                value="Yes"
                checked={document_access_type === "Yes"}
                onChange={(e) => setDocumentAccessType(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="accessControl"
                value="No"
                checked={document_access_type === "No"}
                onChange={(e) => setDocumentAccessType(e.target.value)}
              />{" "}
              No
            </label>
            <label>
              <input
                type="radio"
                name="accessControl"
                value="NA"
                checked={document_access_type === "NA"}
                onChange={(e) => setDocumentAccessType(e.target.value)}
              />{" "}
              NA
            </label>
          </div>
        </div>

        {/* Show input if "Yes" is selected */}
        {document_access_type === "Yes" && (
          <div className="h2">
            <h5>Specify Access Control Details:</h5>
            <input
              type="text"
              name="accessDetails"
              placeholder="Enter details"
              value={control_details}
              onChange={(e) => setControlDetails(e.target.value)}
              className="name"
              required
            />
            <br />
          </div>
        )}

        <div >
          <h1 className="h2">
            (c)Will the study drugs / devices be under access control?
          </h1>
          <div className="h2">
            <label>
              <input
                type="radio"
                name="drugsControl"
                value="Yes"
                checked={drugs_access_type === "Yes"}
                onChange={(e) => setDrugsAccessType(e.target.value)} //
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="drugsControl"
                value="No"
                checked={drugs_access_type === "No"}
                onChange={(e) => setDrugsAccessType(e.target.value)} //
              />{" "}
              No
            </label>
            <label>
              <input type="radio"  name="drugsControl" value="NA" checked={drugs_access_type === "NA"}onChange={(e) => setDrugsAccessType(e.target.value)}  />{" "}NA
            </label>
          </div>
        </div>

        {drugs_access_type === "Yes" && (
          <div className="h2">
            <h5>Specify Access Control Details:</h5>
            <input type="text" name="drugsDetails"placeholder="Enter details"  value={access_details} onChange={(e) => setAccessDetails(e.target.value)}  className="name"   required
            />
            <br /></div>  )}
<br></br>
        <button type="submit" className="name">
          Preview
        </button>
      </form>
}
    </div>
  );
};

export default Section8;