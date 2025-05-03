import "../../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "./components/TableComponent.js"; 
import axiosInstance from "../../components/AxiosInstance.js";

function Administration({ setAdminId }) {
const [name_of_research_principal, setNameOfResearchPrincipal] = useState("");
const [department, setDepartment] = useState("");
const [title, setTitle] = useState("");
const [review_requested, setReviewRequested] = useState("");
const [protocol_number, setProtocolNumber] = useState("");
const [version_number, setVersionNumber] = useState("");
const [date, setDate] = useState("");
const [email]=useState("")
const [showPreview, setShowPreview] = useState(false);
const[existData,setExistData]=useState(null)
const navigate = useNavigate();
const handleFinalSubmit = async () => {
    try {
      const userResponse = await axiosInstance.post("/api/research/administrativee_details", {
        name_of_research_principal,department,title,review_requested,protocol_number,version_number,date, email },
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
          <p><strong>A.Name of Research principal:</strong> {name_of_research_principal}</p>
          <p><strong>B.Department:</strong> {department}</p>
          <p><strong>C.Date:</strong> {date}</p>
          <p><strong>D.Title:</strong> {title}</p>
          <p><strong>E.Review requested:</strong> {review_requested}</p>
          <p><strong>F.Protocol Number:</strong>  {protocol_number}</p>
          <p><strong>G.Version Number:</strong>  {version_number}</p>
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
        <h2 className="h2">1. ADMINISTRATIVE DETAILS</h2>
            <h2 className="h2">A. Name of Researcher/ Principal</h2>
            <input type="text" placeholder="Enter Name"  value={name_of_research_principal} 
            onChange={(e) => {setNameOfResearchPrincipal(e.target.value);
              }}
              className="name"
              required
            />
            <div className="form-row">
              <div className="form-group">
                <h2 className="h2">B. Department</h2>
                <input type="text" value={department}   placeholder="Enter Department"    
                onChange={(e) => {setDepartment(e.target.value);}}  className="name" required/>  </div>
                 <div className="form-group">
                <h2 className="h2">C. Date</h2>
                <input
                  type="date" value={date} onChange={(e) => setDate(e.target.value)}  className="name"required
                />
              </div>

              <div >
                <h2 className="h2">D. Title</h2>
                <input  type="text" value={title}placeholder="Enter title" 
                onChange={(e) => { setTitle(e.target.value);}}className="name"required/>
              </div>
            </div>

            <div >
              <h2 className="h2">E. Type of review requested: </h2>
              <label>  <input  type="radio"  name="review_requested"value="Expedited Review"
              checked={review_requested === "Expedited Review"} onChange={(e) => setReviewRequested(e.target.value)}/>
                Expedited Review
              </label>
              <label>
                <input type="radio" name="review_requested"
                  value="Full Committee Review" checked={review_requested === "Full Committee Review"} 
                  onChange={(e) => setReviewRequested(e.target.value)}/>
                Full Committee Review
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <h2 className="h2">F. Protocol number</h2>
                <input  type="number" value={protocol_number} onChange={(e) => {setProtocolNumber(e.target.value);}}
                  className="name"placeholder="Enter protocol"required/>
              </div>
              <div >
                <h2 className="h2" >G. Version number</h2>
                <input type="number" value={version_number} onChange={(e) => {setVersionNumber(e.target.value);  }}
                className="name"placeholder="Enter version " required/></div>
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