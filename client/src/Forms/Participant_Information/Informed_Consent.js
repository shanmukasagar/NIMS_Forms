import { useState ,useEffect, useRef} from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import TableComponent7 from  "./components/TableComponent7.js";
import axiosInstance from "../../components/AxiosInstance.js";
import {useProject} from "../../components/ResearchContext";

function Section6({selectedForm}) {

  const [seeking_waiver_of_consent_type, setSeekingWaiverOfConsentType] = useState("");
  const [version_number, setVersionNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languageDetails, setLanguageDetails] = useState({});
  const [otherLanguageName, setOtherLanguageName] = useState("");
   const [PISSelectedItems, setPISSelectedItems] = useState([]);
  const [PISOtherText, setPISOtherText] = useState("");
  const [certificates, setCertificates] = useState("");
  const [subject, setSubject] = useState("");
  const [specify, setSpecify] = useState("");
  const [selectedElements, setSelectedElements] = useState([]);
  const [summary, setSummary] = useState("");

  const fetchOnce = useRef(false);
  const [showPreview, setShowPreview] = useState(false);
  const[existData,setExistData]=useState(null);
  const [email]=useState("");
  const [selectedPISElements, setSelectedPISElements] = useState([]);
  const navigate = useNavigate();
  const [openTable, setOpenTable] = useState(false);
  const [editableData, setEditableData] = useState({});

  const [previewURL, setPreviewURL] = useState(null);
  const [image, setImage] = useState(null);

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
      setSeekingWaiverOfConsentType(editableData?.seeking_waiver_of_consent_type || "");
      setVersionNumber(editableData?.version_number || "");
      
      const isoDate = editableData?.date;
      setDate(isoDate ? new Date(isoDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);

      setSelectedLanguages(editableData?.selectedlanguages || []);
      setLanguageDetails(editableData?.languagedetails || {});
      setOtherLanguageName(editableData?.otherlanguagename || "");

      setPISSelectedItems(editableData?.pisselecteditems || []);
      setPISOtherText(editableData?.pisothertext || "");

      setCertificates(editableData?.certificates || "");
      setSubject(editableData?.subject || "");
      setSpecify(editableData?.specify || "");

      // Newly added fields
      setSelectedElements(editableData?.selected_elements || []);
      setSummary(editableData?.summary || "");
    }
  }, [editableData]);


  const languagesList = ["Telugu", "Hindi", "Urdu", "AnyOtherSpecify"];

  //Handle ckeckbox change
  const handleCheckboxChange = (e) => { 
    const { value, checked } = e.target;
    if (checked) {
      setSelectedLanguages((prev) => [...prev, value]);
      setLanguageDetails((prev) => ({
        ...prev,
        [value]: { version: "", date: "" },
      }));
    } else {
      setSelectedLanguages((prev) => prev.filter((lang) => lang !== value));
      setLanguageDetails((prev) => {
        const updated = { ...prev };
        delete updated[value];
        return updated;
      });
      if (value === "AnyOtherSpecify") setOtherLanguageName("");
    }
  };

  //Language details
  const handleDetailChange = (lang, field, value) => {
    setLanguageDetails((prev) => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  //Waver consent elements list
  const elementsList = [
    "research cannot practically be carried out without the waiver and the waiver is scientifically justified",
    "retrospective studies, where the participants are de-identified or cannot be contacted",
    "research on anonymized biological samples/data",
    "certain types of public health studies/surveillance programmes/programme evaluation studies",
    "research on data available in the public domain",
    "research during humanitarian emergencies and disasters, when the participant may not be in a position to give consent.",
  ];


  const PISChecklistItems = [
    "Statement that study involves research & explain purpose of research",
    "Statement that consent & participation are voluntary",
    "Expected Risks and benefits to the study subject",
    "Alternatives procedures / therapies available",
    "Contact information of PI and Member Secretary of EC",
    "Financial compensation and medical management in SAE",
    "Right to withdraw from study at any time",
    "Expected duration of participation",
    "Maintenance of Confidentiality",
    "Description of procedures to be followed, treatment schedule and probability of random assignment",
    "Anticipated prorated payment if any",
    "Responsibility of subject",
    "Statement that placebo shall not have any therapeutic effect (if placebo- controlled trial)",
    "Others specify"
  ];

  //handle consent form elements
  const handleConsentCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedElements([...selectedElements, value]);
    } else {
      setSelectedElements(selectedElements.filter((item) => item !== value));
    }
  };

  //Handle PIS checkbox change
  const handlePISCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setPISSelectedItems((prev) => [...prev, value]);
    } else {
      setPISSelectedItems((prev) => prev.filter((item) => item !== value));
      if (value === "Others specify") {
        setPISOtherText(""); // Clear if unchecked
      }
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
      const userResponse = await axiosInstance.post("/api/research/informedd_consent",
        {seeking_waiver_of_consent_type, version_number, date, selectedLanguages, languageDetails, otherLanguageName, 
          PISSelectedItems, PISOtherText, certificates, subject, specify, selected_elements : selectedElements, summary, email
        }, { params : { selectedForm : selectedForm, 
          isEdit: (editableData && Object.keys(editableData).length > 0 )? "true" : "false", 
          tableName : "informedd_consent", 
          formId : (editableData && Object.keys(editableData).length > 0 )? editableData?.form_id : projectId,
        }}
      );
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
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"informedd_consent",   // or hardcoded for now
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

  if (showPreview) {
    return (
      <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "20px", background: "#f9f9f9" }}>
        <h3 style={{ fontSize: "20px", marginBottom: "15px" }}>Preview</h3>
        <ul style={{ listStyleType: "none", paddingLeft: "0", lineHeight: "1.8" }}>
          <li><strong>Waiver of Consent:</strong> {seeking_waiver_of_consent_type}</li>
          
          {seeking_waiver_of_consent_type === "Yes" && (
            <>
              <li>
                <strong>Selected Waiver Elements:</strong>
                <ul style={{ marginLeft: "20px" }}>
                  {selectedElements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </li>
              {summary && (
                <li><strong>Other Reason:</strong> {summary}</li>
              )}
            </>
          )}

          <li><strong>Version Number:</strong> {version_number}</li>
          <li><strong>Date:</strong> {date}</li>
          <li>
            <strong>Selected Languages:</strong>
            <ul style={{ marginLeft: "20px" }}>
              {selectedLanguages.map((lang, i) => (
                <li key={i}>{lang}</li>
              ))}
            </ul>
          </li>
          <li><strong>Language Details:</strong> {JSON.stringify(languageDetails)}</li>
          {otherLanguageName && <li><strong>Other Language:</strong> {otherLanguageName}</li>}
          <li>
            <strong>Selected PIS Elements:</strong>
            <ul style={{ marginLeft: "20px" }}>
              {PISSelectedItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </li>
          {PISOtherText && <li><strong>Other PIS Text:</strong> {PISOtherText}</li>}
          <li><strong>Certificates:</strong> {certificates}</li>
          <li><strong>Tools Used to Understand:</strong> {subject}</li>
          {subject === "Yes" && <li><strong>Tool Specify:</strong> {specify}</li>}
        </ul>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button style={{ padding: "10px 16px", cursor: "pointer", backgroundColor: "#007BFF", color: "#fff", border: "none", 
            borderRadius: "5px" }} onClick={handleBack}>Edit</button>
          <button style={{ padding: "10px 16px", cursor: "pointer", backgroundColor: "#28a745", color: "#fff", border: "none", 
            borderRadius: "5px" }} onClick={handleSubmit}>Submit</button>
        </div>
      </div>

    );
  }
  return (
    <div className="form-container">
         {(existData && openTable) ? (<TableComponent7 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>) :
      <form onSubmit={handlePreview}>
      <h1 className="h1">7. INFORMED CONSENT </h1>
   
        <h2 className="h2">  (a)Are you seeking waiver of consent?</h2>
          <div className="h2">
            <label>
              <input type="radio" name="waiverofconsent" value="Yes" checked={seeking_waiver_of_consent_type === "Yes"} 
                 onChange={(e) => setSeekingWaiverOfConsentType(e.target.value)} required/> Yes 
            </label>
            <label>
              <input type="radio" name="waiverofconsent" value="No"  checked={seeking_waiver_of_consent_type === "No"}
                onChange={(e) => setSeekingWaiverOfConsentType(e.target.value)} />No
            </label>
          </div>
          <p>If yes, Kindly fill the request for waiver of consent form</p>
          {seeking_waiver_of_consent_type === "Yes" && (
            <>
              <h3 style={{ marginBottom: "10px" }}>4. Reason for waiver of informed consent: (Please tick as applicable)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                {elementsList.map((item, index) => (
                  <div key={index} style={{ display: "flex", alignItems: "center" }}><input type="checkbox" value={item} 
                    checked={selectedElements.includes(item)} onChange={handleConsentCheckboxChange} style={{ marginRight: "8px" }} />
                      <span>{item}</span></div>
                ))}
              </div>
              <h3 style={{ marginBottom: "10px" }}>Any other reason (please specify)</h3>
              <textarea name="researchSummary" placeholder="Specify" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={600} required 
                   style={{ width: "100%", minHeight: "100px", padding: "10px", fontSize: "14px", borderRadius: "5px", border: "1px solid #ccc" }} />
            </>
          )}
          {seeking_waiver_of_consent_type === "No" && (
            <>
          <div className="h">
            <div className="form-group">
              <h3 className="h2">Specify details of english consent document</h3>
              <label>
                <h3 className="h2">Enter version number</h3>
                <input name="versionnumber" placeholder="Enter version number" value={version_number}
                  onChange={(e) => setVersionNumber(e.target.value)}  className="name" required />
              </label>
            </div>
            <div className="form-group">
              <h3 className="h2">Date of Participant Information Sheet(PIS)  and Informed Consent Form
                 (ICF): </h3>
              <input type="date" placeholder="YYYY/MM/DD" value={date} onChange={(e) => setDate(e.target.value)} className="name" required/>
            </div>
          </div>

          <div className="h2">
            <h3 className="h2">(c) List the languages (apart from English) in which translations of
              Participant Information Sheet (PIS) and Informed Consent Form (ICF)
              were provided:{" "}
            </h3>
            <div>
              <h3>Select Languages</h3>
              <div className="checkbox-row" style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px" }}>
                {languagesList.map((lang) => (
                  <label key={lang} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input type="checkbox" name="languages" value={lang} checked={selectedLanguages.includes(lang)} onChange={handleCheckboxChange} />
                    {lang === "AnyOtherSpecify" ? "Any Other (Specify)" : lang}
                  </label>
                ))}
              </div>

              {selectedLanguages.map((lang) => (
                <div key={lang} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", marginLeft: "10px" }}>
                  {lang === "AnyOtherSpecify" && (
                    <label>Language Name: <input type="text" className="name" value={otherLanguageName} 
                      onChange={(e) => setOtherLanguageName(e.target.value)} /></label>
                  )}
                  <label>Version Number: <input type="text" className="name" value={languageDetails[lang]?.version || ""} 
                    onChange={(e) => handleDetailChange(lang, "version", e.target.value)} /></label>
                  <label>Date: <input type="date" className="name" value={languageDetails[lang]?.date || ""} 
                    onChange={(e) => handleDetailChange(lang, "date", e.target.value)} /></label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h1">
            <h3  className="h2"> Are certificate(s) of translations provided: </h3>
            <div className="radio-group">
              <label>
                <input type="radio" name="entercertificates" value="Yes"  checked={certificates === "Yes"}
                  onChange={(e) => setCertificates(e.target.value)} />{" "}
                Yes
              </label>
              

              <label>
                <input type="radio"
                  name="entercertificates" value="No"  checked={certificates === "No"}
                  onChange={(e) => setCertificates(e.target.value)}  />{" "}
                No
              </label>
            </div>
          </div>
          <div className="h2">
            (d) Will Any tools be used to determine whether the subject understood
            the study
            <div className="h">
              <label>
                <input type="radio" name="enter subject" value="Yes"  checked={subject === "Yes"}
                  onChange={(e) => setSubject(e.target.value)} />{" "}
                {""}
                Yes
              </label>
              <label>
                <input type="radio" name="entersubject" value="No" checked={subject === "No"}
                  onChange={(e) => setSubject(e.target.value)}
                />{" "}
                {""}
                No
              </label>
            </div>
            
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
              <input type="radio" name="specify" value="Feedback"
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
            (e) Tick the elements contained in the Participant Information Sheet
            (PIS) and Informed Consent Form{" "}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {PISChecklistItems.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  checked={PISSelectedItems.includes(item)}
                  onChange={handlePISCheckboxChange}
                />{" "}
                {item}
              </label>
            ))}

            {PISSelectedItems.includes("Others specify") && (
              <div style={{ marginTop: "10px", marginLeft: "20px" }}>
                <label>
                  Please specify:{" "}
                  <input className = "name" style = {{width : "100%"}}
                    type="text"
                    value={PISOtherText}
                    onChange={(e) => setPISOtherText(e.target.value)}
                  />
                </label>
              </div>
            )}
          </div>
    </div>
    </>
  )}
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