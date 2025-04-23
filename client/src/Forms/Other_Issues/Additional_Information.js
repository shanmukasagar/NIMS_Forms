import { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

const Section9 = (adminId) => {
  const [support_type, setSupportType] = useState("");
  const [additional, setAdditional] = useState("");
  const [preview, setPreview] = useState(false); 
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
        "http://localhost:4000/api/research/additional_information",
        {
          support_type,
          additional,
          administrativeDetailId: adminId?.adminId ?? adminId,
        }
      );
      const id = userResponse.data.id;
      console.log("User created:", userResponse.data);
      navigate("/declaration");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };


  if (preview) {
    return (
      <div className="h">
        <h5 className="h2">SECTION D: OTHER ISSUES </h5>
      
        <p><strong>Do you have any additional information to add?</strong> {support_type}</p>
        {support_type === "Yes" && (
          <p><strong>Details:</strong> {additional}</p>
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
      <form onSubmit={handlePreview}>
        <h2 className="h2">SECTION D: OTHER ISSUES </h2>
        <h2 className="h2">10.ADDITIONAL INFORMATION </h2>
        <div >
          <h3 className="h2">
            (a)Do you have any additional information to add in support of the
            application, which is not included elsewhere in the form? If yes,
            provide the details.{" "}
          </h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="additional"
                value="Yes"
                checked={support_type === "Yes"}
                onChange={(e) => setSupportType(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="additional"
                value="No"
                checked={support_type === "No"}
                onChange={(e) => setSupportType(e.target.value)}
              />{" "}
              No
            </label>
          </div>
        </div>

        {support_type === "Yes" && (
          <div className="h">
            <h3>specify:</h3>
            <input
              type="text"
              name="additionalInformation"
              placeholder="Enter details"
              checked={additional === "Yes"}
              onChange={(e) => setAdditional(e.target.value)}
              className="name"
              required
            />
            <br />
          </div>
        )}
        <button type="submit" className="name">
          Preview
        </button>
      </form>
    </div>
  );
};

export default Section9;