import { useState ,useEffect} from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableComponent5 from  "./components/TableComponent5.js";
const Section4 = ({ adminId }) => {
  const [type_of_participants, setTypeOfParticipant] = useState("");
  const [justification, setJustification] = useState("");
  const [specifiy, setSpecifiy] = useState("");
  const [additional_safeguards, setAdditionalSafeguards] = useState("");
  const [reimbursement_details, setReimbursementDetails] = useState("");
  const [advertisement_type, setAdvertisementType] = useState("");
  const [advertisement_details, setAdvertisementDetails] = useState("");
  const [payment_type, setPaymentType] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const[existData,setExistData]=useState(null)
  const [email,setEmail]=useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userResponse = await axios.post(
        "http://localhost:4000/api/research/participantt_related_information",
        {
          type_of_participants, justification, specifiy, additional_safeguards,  reimbursement_details,   advertisement_type,advertisement_details, payment_type, administrativeDetailId: adminId,email
        }
      );
      const idd = userResponse.data.idd;
      console.log("User created:", userResponse.data);
      navigate("/participant/benefits");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/research/check/admin", { 
          params : {
            form_type:" participantt_related_information "// or hardcoded for now
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
  return (

    <div className>
    <div className="h">
    {existData ? ( <TableComponent5 data={existData} />):   !isPreview ? (
        <form onSubmit ={(e) => { e.preventDefault(); setIsPreview(true); }}>
      <h3 className="hi">SECTION C - PARTICIPANT RELATED INFORMATION</h3>
      <h3>5. Recruitment of Research Participants</h3>
   
          <h3>(a) Type of Participants in the Study:</h3>
          <select
            value={type_of_participants}
            onChange={(e) => setTypeOfParticipant(e.target.value)}
            className="name"
            required
          >
            <option value="">Select Participant Type</option>
            <option value="healthy">Healthy Volunteer</option>
            <option value="patient">Patient</option>
            <option value="vulnerable">Vulnerable Person / Special Groups</option>
            <option value="others">Others (Specify)</option>
          </select>

          {type_of_participants === "others" && (
            <>
              <h3>Specify Other Participant Type:</h3>
              <input type="text" value={specifiy}onChange={(e) => setSpecifiy(e.target.value)}
               className="name"  required  />  </>)}

            <h3>(b)Justification for inclusion (if vulnerable):</h3>
           <textarea  value={justification}   onChange={(e) => setJustification(e.target.value)} 
            className="custom-textarea"   required />
            <h3>Additional Safeguards:</h3>

          <textarea value={additional_safeguards} onChange={(e) => setAdditionalSafeguards(e.target.value)}
          className="custom-textarea"required/>

          <h3>(c) Reimbursement/Payment to the Subject:</h3>
          <label>
            <input
              type="radio"value="Yes" checked={payment_type === "Yes"}
               onChange={(e) => setPaymentType(e.target.value)}
            /> Yes
          </label>
          <label>
            <input type="radio" value="No"   checked={payment_type === "No"} 
             onChange={(e) => setPaymentType(e.target.value)}
            /> No
          </label>
          <label>
            <input type="radio"   value="NA"  checked={payment_type === "NA"} 
            onChange={(e) => setPaymentType(e.target.value)}
            /> NA
          </label>

          {payment_type === "Yes" && (
            <>
              <h3>Provide Reimbursement Details:</h3>
              <input type="text"  value={reimbursement_details} 
              onChange={(e) => setReimbursementDetails(e.target.value)} className="name"   required />
            </> )}
          <h3>(d) Will Advertisement be used to recruit subjects?</h3>

          <label>
            <input type="radio"  value="Yes"checked={advertisement_type === "Yes"}   
            onChange={(e) => setAdvertisementType(e.target.value)} /> Yes
          </label>

          <label>
            <input
              type="radio"  value="No" checked={advertisement_type === "No"} 
               onChange={(e) => setAdvertisementType(e.target.value)}  /> No </label>
             {advertisement_type === "Yes" && (
            <>
              <h3>Advertisement Details:</h3>
              <input type="text" value={advertisement_details}
              onChange={(e) => setAdvertisementDetails(e.target.value)} className="name"  required />  </>   )}
          <br></br>
          <button type="submit" className="name">Preview</button>
          </form>
          ) : (
         <div className="preview-section">
          <h3>Preview </h3>
          <p><strong>Type of Participant:</strong> {type_of_participants}</p>
          {type_of_participants === "others" && (
            <p><strong>Specify:</strong> {specifiy}</p>
          )}
          <p><strong>Justification:</strong> {justification}</p>
          <p><strong>Additional Safeguards:</strong> {additional_safeguards}</p>
          <p><strong>Payment Type:</strong> {payment_type}</p>
          {payment_type === "Yes" && (
            <p><strong>Reimbursement Details:</strong> {reimbursement_details}</p>
          )}
          <p><strong>Advertisement Used:</strong> {advertisement_type}</p>
          {advertisement_type === "Yes" && (
            <p><strong>Advertisement Details:</strong> {advertisement_details}</p>
          )}

          <button onClick={() => setIsPreview(false)} className="name">Edit</button>
          <button onClick={handleSubmit} className="name">Submit</button>
        </div>
      )}
    </div>
    </div>  
  );
};

export default Section4;