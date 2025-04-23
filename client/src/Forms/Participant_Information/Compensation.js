import { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";
const Section7 = (adminId) => {
  const [waiver_consent_type, setWaiverConsentType] = useState("");
  const [specify, setSpecify] = useState("");
  const [specific, setSpecific] = useState("");
  const [compensation_research_of_type, setCompensationResearchOfType] =
    useState("");
    const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();
 
  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleEdit = () => {
    setShowPreview(false);
  };

  const handleSubmit = async () => {
   

    try {
      const userResponse = await axios.post(
        "http://localhost:4000/api/research/payment_compensation",
        {
          waiver_consent_type,
          specify,
          compensation_research_of_type,
          specific,
          administrativeDetailId:adminId,
        }
      );
      const id = userResponse.data.id;
      console.log("User created:", userResponse.data);
      navigate("/participant/confidentiality");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="form-container">
      <h1 className="h1">8.PAYMENT / COMPENSATION</h1>
      {showPreview ? (
        <div className="h">
          <h2 className="h">Preview Your Responses</h2>
          <p><strong>Waiver of Consent:</strong> {waiver_consent_type}</p>
          <p><strong>Waiver Details:</strong> {specify}</p>
          <p><strong>Compensation for SAE:</strong> {compensation_research_of_type}</p>
          <p><strong>Compensation Details:</strong> {specific}</p>

          <button className="name" onClick={handleEdit}>Edit</button>
          <button className="name" onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <form onSubmit={handlePreview}>
      <h3 className="h2">
        (a)Is there a provision for treatment free of cost for research related
        injuries?{" "}
      </h3>

     
        <div className="h2">
          (a)Are you seeking waiver of consent?
          <div className="h">
            <label>
              <input
                type="radio"
                name="waiver"
                value="Yes"
                checked={waiver_consent_type === "Yes"}
                onChange={(e) => setWaiverConsentType(e.target.value)} // ✅
              />{" "}
              {""}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="waiver"
                value="No"
                checked={waiver_consent_type === "No"}
                onChange={(e) => setWaiverConsentType(e.target.value)} //
              />{" "}
              {""}
              No
            </label>
            <h3 className="h2">Kindly specify:</h3>
            <textarea
              type="text"
              name="specifydata"
              placeholder="Enter research summary"
              value={specify}
              onChange={(e) => setSpecify(e.target.value)}
              className="custom-textarea"
              maxLength={600}
              required
            />
          </div>
        </div>

        <div className="h">
          <h3>
            (b)Is there a provision for compensation of research related SAE?{" "}
          </h3>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="compensation"
                value="Yes"
                checked={compensation_research_of_type === "Yes"}
                onChange={(e) => setCompensationResearchOfType(e.target.value)}
              />{" "}
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="compensation"
                value="No"
                checked={compensation_research_of_type === "No"}
                onChange={(e) => setCompensationResearchOfType(e.target.value)}
              />{" "}
              No
            </label>
          </div>
          <h3 className="custom">Kindly specify:</h3>
          <textarea
            name="specific"
            placeholder="Enter research summary"
            value={specific}
            onChange={(e) => setSpecific(e.target.value)}
            className="custom-textarea"
            maxLength={600}
            required
          />
        </div>
<br></br>
        <button type="submit" className="name">
          Preview{" "}
        </button>
      </form>
)}
</div>
  
  );
};
export default Section7;