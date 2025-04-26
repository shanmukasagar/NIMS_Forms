import { useState ,useEffect} from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TableComponent7 from  "./components/TableComponent7.js";
function Section6(adminId) {
  const [seeking_waiver_of_consent_type, setSeekingWaiverOfConsentType] =
    useState("");
  const [languages, setLanguages] = useState("");
  const [version_number, setVersionNumber] = useState("");
  const [date, setDate] = useState("");
  const [date_1, setDate1] = useState("");
  const [version_1, setVersion1] = useState("");
  const [version_2, setVersion2] = useState("");
  const[version_3, setVersion3]=useState("") 
  const [showPreview, setShowPreview] = useState(false);
  const[date_2,setDate2] =useState("");
  const[date_3,setDate3]=useState("");
  const [certificates, setCertificates] = useState("");
  const [subject, setSubject] = useState("");
  const [specify, setSpecify] = useState("");
  const[existData,setExistData]=useState(null);
  const [email,setEmail]=useState("");
  const [selectedElements, setSelectedElements] = useState([]);
  const navigate = useNavigate();

  const elementsList = [
    "Statement that studyinvolves research &explain purpose ofresearch ",
    "Statement that consent &participation are voluntary ",
    "Expected Risks and benefits to the study subject",
    "Alternatives procedures / therapies available",
    "Contact information of PI and Member Secretary of EC ",
    "Financial compensation and medical management in SAE ",
    "Right to withdraw from study at any time ",
    "Expected duration of participation",
    "Maintenance of Confidentiality ",
    "Description of procedures to be followed, treatment schedule and probability of random assignment ",
  ];

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

  const handleBack = () => {
    setShowPreview(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axios.post(
        "http://localhost:4000/api/research/informedd_consent",
        {
          seeking_waiver_of_consent_type,
          languages, version_number, date,   version_1, date_1,version_2, date_2,version_3, date_3, certificates,   
          subject,    specify, selectedElements: selectedElements,  administrativeDetailId: adminId
        }
      );
      const id = userResponse.data.id;
      console.log("User created:", userResponse.data);
      navigate("/participant/compensation");
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
            form_type:"informedd_consent"// or hardcoded for now
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


  if (showPreview) {
    return (
     
      <div className="h">
        <h3>Preview </h3>
        <ul className="preview-section">
          <li>Waiver of Consent: {seeking_waiver_of_consent_type}</li>
          <li>Languages: {languages}</li>
          {languages === "Anyotherspecify" && (
            <>
              <li>Other Language Version: {version_number}</li>
              <li>Other Language Date: {date}</li>
            </>
          )}
          <li>Participant Info - Version: {version_1}, Date: {date_1}</li>
          <li>ICF - Version: {version_2}, Date: {date_2}</li>
          <li>English Consent - Version: {version_3}, Date: {date_3}</li>
          <li>Certificates: {certificates}</li>
          <li>Tools Used to Understand: {subject}</li>
          {subject === "Yes" && <li>Tool Specify: {specify}</li>}
          <li>Selected Elements:</li>
          <ul>
            {selectedElements.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </ul>
        <button className="name" onClick={handleBack}>
          Edit
        </button>
        <button className="name" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    );
  }
  return (
    <div className="form-container">
         {existData ? (<TableComponent7 data={existData} />) :
      <form onSubmit={handlePreview}>
      <h1 className="h1">7.INFORMED CONSENT </h1>
   
        <h2 className="h2">  (a)Are you seeking waiver of consent?</h2>
          <div className="h2">
            <label>
              <input type="radio"
                name="waiverofconsent" value="Yes" checked={seeking_waiver_of_consent_type === "Yes"}
                onChange={(e) => setSeekingWaiverOfConsentType(e.target.value)}
              />{" "}
              {""}
              Yes
            </label>
            <label>
              <input
                type="radio" name="waiverofconsent" value="No"  checked={seeking_waiver_of_consent_type === "No"}
                onChange={(e) => setSeekingWaiverOfConsentType(e.target.value)} />{" "}
              {""}
              No
            </label>
          </div>
          <br></br>
        <div className="h">
          <h3 className="h2">(b)Documents</h3>
          <div className="form-group">
            <h3 className="h2">English consent</h3>
            <label>
              <h3 className="h2">Enter version number</h3>
              <input
                type="number" name="versionnumber" placeholder="Enter version number" value={version_3}
                onChange={(e) => setVersion3(e.target.value)}  className="name" required
              />
            </label>
          </div>
          <div className="form-group">
            <h3 className="h2">Date</h3>
        <input
       type="date" placeholder="YYYY/MM/DD" value={date_3} onChange={(e) => setDate3(e.target.value)} 
       className="name" required/>
            <br></br>
          </div>
          <div className="h1">
            <h3 className="h1">partcipantInformation</h3>
            <label>
              <h3 className="h2">Enter version number</h3>
              <input
                type="number" name="versionnumber"  placeholder="Enter version number" value={version_1}
                onChange={(e) => setVersion1(e.target.value)} className="name"   required />
            </label>
          </div>
          <div className="form-group">
            <h3 className="h2">Date</h3>

            <input
              type="date"
              placeholder="YYYY/MM/DD"
              value={date_1} onChange={(e) => setDate1(e.target.value)} className="name" required />
              <br></br>
          </div>
        </div>

        <div className="h">
          <div className="form-group">
            <h3 className="h2">
              Version number of Informed Consent Form (ICF)
            </h3>

            <label>
              <h3 className="h2">Enter version number</h3>

              <input
                type="number" name="versionnumber" placeholder="Enter version number" value={version_2}
                onChange={(e) => setVersion2(e.target.value)} className="name" required/>
            </label>
          </div>

          <div className="form-group">
            <h3 className="h2">Date</h3>

            <input
              type="date" placeholder="YYYY/MM/DD"
              value={date_2} onChange={(e) => setDate2(e.target.value)} className="name"   required/>
            <br></br>
          </div>
        </div>

        <div className="h2">
          <h3 className="h2">
            (c)List the languages (apart from English) in which translations of
            Participant Information Sheet (PIS) and Informed Consent Form (ICF)
            were provided:{" "}
          </h3>
          <div className="h2">
            <label>
              <input
                type="radio" name="languagess" value="Telugu"
                checked={languages === "Telugu"}  onChange={(e) => setLanguages(e.target.value)} />{" "}
              Telugu
            </label>

            <label>
              <input
                type="radio"  name="languagess"  value="Hindi"  checked={languages === "Hindi"}
                onChange={(e) => setLanguages(e.target.value)}/>
              {""}
              Hindi
            </label>

            <label>
              <input
                type="radio"  name="languagess"
                value="Urdu" checked={languages === "Urdu"}  onChange={(e) => setLanguages(e.target.value)} />
              {""}
              Urdu
            </label>

            <label>
              <input
                type="radio"   name="languagess" value="AnyOtherSpecify"
                checked={languages === "AnyOtherSpecify"} onChange={(e) => setLanguages(e.target.value)}
              />{" "}
              Anyotherspecify
            </label>
          </div>
        </div>

        {/* Show input if "Yes" is selected */}
        {languages === "AnyOtherSpecify" && (
          <>
            <h3 className="h1">Enter version number</h3>
            <input
              type="number"  name="versionnumber"  placeholder="Enter version number"
              value={version_number}    onChange={(e) => setVersionNumber(e.target.value)}
              className="name" required={languages === "AnyOtherSpecify"}/>
            <h2 className="h">Date</h2>
            <input
              type="date"    name="studyDate" id="studyDate"
              placeholder="DD/MM/YYYY"  value={date} onChange={(e) => setDate(e.target.value)}   className="name"
              required={languages === "AnyOtherSpecify"} />
            <br />
            <br />
          </>
        )}
        <div className="h1">
          <h3  className="h2">Are Are certificate(s) of translations provided: </h3>
          <div className="radio-group">
            <label>
              <input
                type="radio" name="entercertificates" value="Yes"  checked={certificates === "Yes"}
                onChange={(e) => setCertificates(e.target.value)}
              />{" "}
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="entercertificates"    value="No"  checked={certificates === "No"}
                onChange={(e) => setCertificates(e.target.value)}
              />{" "}
              No
            </label>
          </div>
        </div>

        <div className="h2">
          (d)Will Any tools be used to determine whether the subject understood
          the study
          <div className="h">
            <label>
              <input
                type="radio" name="enter subject" value="Yes"  checked={subject === "Yes"}
                onChange={(e) => setSubject(e.target.value)}
              />{" "}
              {""}
              Yes
            </label>
            <label>
              <input
                type="radio" name="entersubject" value="No" checked={subject === "No"}
                onChange={(e) => setSubject(e.target.value)}
              />{" "}
              {""}
              No
            </label>
          </div>
          <br></br>
        </div>

        <h2 className="h2">if yes specify:</h2>
        {/* Show input if "Yes" is selected */}
        {subject === "Yes" && (
          <div className="h">
            <label>
              <input
                type="radio" name="specify" value="By Questionaire"  checked={specify === "By Questionaire"}
                onChange={(e) => setSpecify(e.target.value)} />{" "}
              By Questionaire
            </label>
            <label>
              <input
                type="radio" name="specify" value="Feedback"
                checked={specify === "Feedback"} onChange={(e) => setSpecify(e.target.value)}
              />{" "}
              Feedback
            </label>

            <label>
              <input type="radio" name="subjectDetails"  value="Others"
                checked={specify === "Others"} onChange={(e) => setSpecify(e.target.value)} />{" "} Others
            </label>
          </div>
        )}
        <div>
          <h3 className="h2">
            (e)Tick the elements contained in the Participant Information Sheet
            (PIS) and Informed Consent Form{" "}
          </h3>
          <div className="h2">  {elementsList.map((item, index) => (<label key={index} className="checkbox-label">
                <br></br>
                <input    type="checkbox" value={item} checked={selectedElements.includes(item)}  
                onChange={handleCheckboxChange}
                />
                {""}
                <br></br>
                {item}
              </label>
            ))}
          </div>
        </div>
        <br></br>
        <button type="submit" className="name">
          Preview
        </button>
      </form>
}
    </div>
  );
};
export default Section6;