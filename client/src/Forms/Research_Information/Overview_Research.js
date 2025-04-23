



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../App.css";
const OverviewResearch = ( adminId ) => {
  const [summary, setSummary] = useState("");
  const [type_of_study, setTypeOfStudy] = useState("");
  const [external_laboratory, setExternalLaboratory] = useState("");
  const [specify, setSpecify] = useState("");
  const [image, setImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false); 

  const navigate = useNavigate();

  const Submit = async (e) => {
    e.preventDefault();

    try {
      const userResponse = await axios.post(
        "http://localhost:4000/api/research/overvieww_research",
        {
          summary,
          type_of_study,
          external_laboratory,
          specify,
          administrativeDetailId: adminId,
        }
      );
      const id = userResponse.data.id;
      console.log("User created:", userResponse.data);

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("id", id);

        const uploadResponse = await axios.post(
          "http://localhost:4000/api/research/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Image uploaded:", uploadResponse.data);
      }

      navigate("/participant/recruitment");
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleEdit = () => {
    setShowPreview(false);
  };

  if (showPreview) {
    return (
      <div className="h">
        <h3 className="h2">Preview - Research Related Information</h3>
        <p><strong>Summary:</strong> {summary}</p>
        <p><strong>Type of Study:</strong> {type_of_study}</p>
        <p><strong>External Lab Involved:</strong> {external_laboratory}</p>
        {external_laboratory === "Yes" && (
          <p><strong>Lab Details:</strong> {specify}</p>
        )}
        <p><strong>Uploaded File:</strong> {image ? image.name : "No file uploaded"}</p>

        <button onClick={Submit} className="name"> Submit</button>
        <button onClick={handleEdit} className="name">Edit</button>
      </div>
    );
  }

  return (
    <div >
      <h2 className="hi">SECTION B - RESEARCH RELATED INFORMATION</h2>
      <h2 className="h2">3. OVERVIEW OF RESEARCH</h2>
      <form>
        <h2 className="h1">(a). Summary of Study (within 300 words)</h2>
        <textarea
          name="researchSummary"
          placeholder="Enter research summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="custom-textarea"
          maxLength={600}
          required
        />

        <div>
          <h3 className="h2">(b). Type of study</h3>
          <select
            name="studyType"
            value={type_of_study}
            onChange={(e) => setTypeOfStudy(e.target.value)}
            className="name"
            required
          >
            <option value="">Select study type</option>
            <option value="interventional">Interventional</option>
            <option value="case-control">Case Control / Cohort</option>
            <option value="retrospective">Retrospective</option>
            <option value="epidomological">Epidemiological</option>
            <option value="cross-section">Cross-section</option>
            <option value="sociobehaviour">Sociobehaviour</option>
          </select>
        </div>

        <h2 className="h2">4. METHODOLOGY</h2>
        <div className="form-group">
          <h2 className="custom-text">Sample size:</h2>
          <h2 className="h2">Justification for the sample size chosen:</h2>
          <label>
            <input
              type="file"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
              className="name"
              required
            />
          </label>
        </div>

        <div className="h">
          <h3>Is there an external laboratory / outsourcing involved?</h3>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="laboratory"
                value="Yes"
                checked={external_laboratory === "Yes"}
                onChange={(e) => setExternalLaboratory(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="laboratory"
                value="No"
                checked={external_laboratory === "No"}
                onChange={(e) => setExternalLaboratory(e.target.value)}
              />{" "}
              No
            </label>
          </div>
        </div>

        {external_laboratory === "Yes" && (
          <div className="h1">
            <h3>If yes, specify:</h3>
            <input
              type="text"
              name="laboratoryDetails"
              placeholder="Enter details"
              value={specify}
              onChange={(e) => setSpecify(e.target.value)}
              className="name"
              required
            />
          </div>
        )}
<br></br>
        <button onClick={handlePreview} className="name">
          Preview
        </button>
      </form>
    </div>
  );
};

export default OverviewResearch ;