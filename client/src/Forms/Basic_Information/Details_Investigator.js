
import { useState ,useEffect} from "react";
import "../../App.css";
import axios from "axios";
import TableComponent2 from "./components/TableComponent2.js"; 
import "../../App.css";

import { useNavigate } from "react-router-dom";

const DetailsInvestigator =({adminId}) => { 
  const [piName, setPiName] = useState("");
  const [piDesignation, setPiDesignation] = useState("");
  const [piQualification, setPiQualification] = useState("");
  const [piDepartment, setPiDepartment] = useState("");
  const [piInstitution, setPiInstitution] = useState("");
  const [piAddress, setPiAddress] = useState("");
  const [piInvestigatorType] = useState("Principal_Investigator");

  const [coiName, setCoiName] = useState("");
  const [coiDesignation, setCoiDesignation] = useState("");
  const [coiQualification, setCoiQualification] = useState("");
  const [coiDepartment, setCoiDepartment] = useState("");
  const [coiInstitution, setCoiInstitution] = useState("");
  const [coiAddress, setCoiAddress] = useState("");
  const [coiInvestigatorType] = useState("Co-investigator");
 
  const [email,setEmail]=useState("")
  const [showPreview, setShowPreview] = useState(false);
  const[existData,setExistData]=useState(null)
  const navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();

    try {
      const investigatorss = [
        {
          name: piName,
          designation: piDesignation,
          qualification: piQualification,
          department: piDepartment,
          institution: piInstitution,
          address: piAddress,
          investigator_type: piInvestigatorType,
          administrativeDetailId: adminId ,
          email// Now using the adminId prop
        },
        {
          name: coiName,
          designation: coiDesignation,
          qualification: coiQualification,
          department: coiDepartment,
          institution: coiInstitution,
          address: coiAddress,
          investigator_type: coiInvestigatorType,
          administrativeDetailId: adminId,
           // Now using the adminId prop
        },
      ];

      await axios.post("http://localhost:4000/api/research/investigatorss", investigatorss);

      console.log("Investigators created");
      navigate("/basic/funding", { state: { adminId } }); // Passing adminId in navigate state as well
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
            form_type:"investigatorss"// or hardcoded for now
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
        <h2 className="h2">Preview </h2>

        <div className="h">
          <h3>Principal Investigator:</h3>
          <p><strong>Name:</strong> {piName}</p>
          <p><strong>Designation:</strong> {piDesignation}</p>
          <p><strong>Qualification:</strong> {piQualification}</p>
          <p><strong>Department:</strong> {piDepartment}</p>
          <p><strong>Institution:</strong> {piInstitution}</p>
          <p><strong>Address:</strong> {piAddress}</p>
        </div>

        <div className="h">
          <h3>Co-investigator:</h3>
          <p><strong>Name:</strong> {coiName}</p>
          <p><strong>Designation:</strong> {coiDesignation}</p>
          <p><strong>Qualification:</strong> {coiQualification}</p>
          <p><strong>Department:</strong> {coiDepartment}</p>
          <p><strong>Institution:</strong> {coiInstitution}</p>
          <p><strong>Address:</strong> {coiAddress}</p>
        </div>

        <button onClick={Submit} className="name">Submit</button>
        <button onClick={handleEdit} className="name">Edit</button>
      </div>
    );
  }

  return (
    <div className="form-container">
       {existData ? (<TableComponent2 data={existData} />) :
         <form>
      <h3 className="h2">G. Details of Investigators / Researcher(s): </h3>
     
      
        <div className="form-row">
          <div className="h">
            <h3>Principal Investigator / Researcher:</h3>
            <input type="text" placeholder="Enter Name" value={piName} onChange={(e) => setPiName(e.target.value)} required className="name" />
            <input type="text" placeholder="Enter Designation" value={piDesignation} onChange={(e) => setPiDesignation(e.target.value)} required className="name" />
            <input type="text" placeholder="Qualification" value={piQualification} onChange={(e) => setPiQualification(e.target.value)} required className="name" />
            <input type="text" placeholder="Department" value={piDepartment} onChange={(e) => setPiDepartment(e.target.value)} required className="name" />
            <input type="text" placeholder="Institution" value={piInstitution} onChange={(e) => setPiInstitution(e.target.value)} required className="name" />
            <textarea placeholder="Address" value={piAddress} onChange={(e) => setPiAddress(e.target.value)} required className="custom-textarea" />
          </div>

          <div className="h">
            <h3>Co-investigator(s) / Guide(s):</h3>
            <input type="text" placeholder="Name" value={coiName} onChange={(e) => setCoiName(e.target.value)} required className="name" />
            <input type="text" placeholder="Designation" value={coiDesignation} onChange={(e) => setCoiDesignation(e.target.value)} required className="name" />
            <input type="text" placeholder="Qualification" value={coiQualification} onChange={(e) => setCoiQualification(e.target.value)} required className="name" />
            <input type="text" placeholder="Department" value={coiDepartment} onChange={(e) => setCoiDepartment(e.target.value)} required className="name" />
            <input type="text" placeholder="Institution" value={coiInstitution} onChange={(e) => setCoiInstitution(e.target.value)} required className="name" />
            <textarea placeholder="Address" value={coiAddress} onChange={(e) => setCoiAddress(e.target.value)} required className="custom-textarea" />
          </div>
        </div>

        <button onClick={handlePreview} className="name">
          Preview
        </button>
      </form>
}
    </div>
  );
};

export default DetailsInvestigator;