import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "./components/TableComponent.js"; 
import "../../App.css";
import axiosInstance from "../../components/AxiosInstance.js";

function Administration({ setAdminId }) {
const [name_of_research_principal, setNameOfResearchPrincipal] = useState("");
const [department, setDepartment] = useState("");
const [title, setTitle] = useState("");
const [review_requested, setReviewRequested] = useState("");
const [protocol_number, setProtocolNumber] = useState("");
const [version_number, setVersionNumber] = useState("");
const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
const [date_1,setDate1]=useState("")
const [email]=useState("")
const [showPreview, setShowPreview] = useState(false);
const[existData,setExistData]=useState(null);
const navigate = useNavigate();
const [formData, setFormData] = useState({review_requested: "",email:""});

const handleChange = async (e) => {
  const value = e.target.value;

  if (value === "Expedited Review") {
    try {
      const response = await axiosInstance.get("/api/research/check/admin", {
        params: {
          form_type: "expedited_review",
          email: formData.email, 
        },
      });

      if (response.data.length <= 0) { 
        navigate("/expedited");
        return ;
      }
    } 
    catch (err) {
      console.error("Error checking form status:", err);
    }
  } 
  setFormData((prev) => ({
    ...prev,
    [e.target.name]: value,
  }));
  setReviewRequested(value);
};

const handleFinalSubmit = async () => {
    try {
      const userResponse = await axiosInstance.post("/api/research/administrativee_details", {
        name_of_research_principal,department,title,review_requested,protocol_number,version_number,date, email ,date_1},
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

  if (showPreview) {
    return (
      <div className="form-container">
        <div className="h">
          <h2 className="h2">Preview</h2>
          <p><strong>Name of Research principal:</strong> {name_of_research_principal}</p>
          <p><strong>Department:</strong> {department}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Title:</strong> {title}</p>
          <p><strong>Review requested:</strong> {review_requested}</p>
          <p><strong>Protocol Number:</strong>  {protocol_number}</p>
          <p><strong>Version Number:</strong>  {version_number}</p>
          <p><strong>Dated:</strong>  {date_1}</p>
          <br></br>
          <button className="name" onClick={handleFinalSubmit}>Submit</button>
          <br></br>
          <button className="name" onClick={handleEdit}>Edit</button>
        </div>
      </div>
    );
  }
  return (
    <div className="form-container">
      <div className="h">
      {existData ? (<TableComponent data={existData} />) :
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
                <input type="text" value={department}   placeholder="Enter Department"    
                onChange={(e) => {setDepartment(e.target.value);}}  className="name" required/>  </div>
                 <div className="form-group">
                <h2 className="h2">Date of submission</h2>
                <input type="date" value={date} readOnly className="name" required />
              </div>

              <div >
                <h2 className="h2">Title of the study</h2>
                <input  type="text" value={title}placeholder="Enter title"  onChange={(e) => { setTitle(e.target.value);}}className="name"required/>
              </div>
            </div>
            <div>

            <div>
           <h2 className="h2">Type of review requested: </h2>
           <label>
             <input type="radio" name="review_requested"  value="Expedited Review"
                checked={review_requested === "Expedited Review"} onChange={handleChange} />
                Expedited Review
              </label>
           <label>
              <input   type="radio" name="review_requested"
               value="Full Committee Review" checked={review_requested === "Full Committee Review"}
                onChange={handleChange}/>
                Full Committee Review
            </label>
            <h2 className="custom-textt">If applying for Expedited Review, Kindly also fill the Expedited review application form</h2>
            </div>
           
            <div className="input-row">
          <div >
           <h2 className="h2">Protocol number</h2>
         <input type="text"  value={protocol_number} onChange={(e) => setProtocolNumber(e.target.value)}
        className="name"  placeholder="Enter protocol" required/> </div>
        <div>
        <h2 className="h2">Version number</h2>
        <input
          type="number" value={version_number} onChange={(e) => setVersionNumber(e.target.value)}
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