import React, { useState,useEffect, useRef } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

import TableComponent12 from  "./components/TableComponent12.js";
import axiosInstance from "../../components/AxiosInstance.js";

import {useProject} from "../../components/ResearchContext";

const Section10 = ({selectedForm, user}) => {

  const [name_of_pi_research, setNameOfPiResearch] = useState("");
  const [sign_1, setSign1] = useState("");
  const [date_pi, setDatePi] = useState(new Date().toISOString().split("T")[0]);

  const [selectedElements, setSelectedElements] = useState([]);
  const fetchOnce = useRef(false);

  const [name_of_co_pi_guide, setNameOfCoPiGuide] = useState("");
  const [sign_2, setSign2] = useState("");
  const [date_co_pi, setDateCoPi] = useState(  new Date().toISOString().split("T")[0]);

  const [name_of_hod, setNameOfHod] = useState("");
  const [sign_5, setSign5] = useState("");
  const [date_co_inv_3, setDateCoInv3] = useState(  new Date().toISOString().split("T")[0]);

  const [isDisabled, setIsDisabled] = useState(true);

  const [showPreview, setShowPreview] = useState(false);
  const[existData,setExistData]=useState(null);
  const [email]=useState("");
  const navigate = useNavigate();
  const [openTable, setOpenTable] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [previewURL, setPreviewURL] = useState({"image1" : null, "image2" : null, "image3" : null, "image4" : null});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [coInvestigators, setCoInvestigators] = useState([
    { name: "", sign: "", date: new Date().toISOString().split("T")[0] }
  ]);

  const elementsList = [
    "I/We certify that the information provided in this application is complete and correct.",
    "I/We confirm that all investigators have approved the submitted version of proposal /related documents",
    "I/We confirm that this study will be conducted in accordance with the latest ICMR National Ethical Guidelines for Biomedical and Health Research involving HumanParticipants and other applicable regulations and guidelines including responsible",

   "I/We will comply with all policies and guidelines of the institute and affiliated / collaborating institutions wherever applicable",
    "I/We confirm that we shall submit any protocol amendments, adverse events report,significant deviations from protocols, regular progress reports and a final report and also participate in any audit of the study if needed",

    "I/We confirm that we will maintain accurate and complete records of all aspects of the study.",
    " I/We will protect the privacy of participants and assure safety and confidentiality of study data and biological samples.",
  ];

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
    if (editableData && Object.keys(editableData).length > 0) {
      setSelectedElements(editableData?.selected_elements || []);

      setNameOfPiResearch(editableData?.name_of_pi_research || "");
      setSign1(editableData?.sign_1 || "");
      setDatePi(
        editableData?.date_pi
          ? new Date(editableData.date_pi).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );

      setNameOfCoPiGuide(editableData?.name_of_co_pi_guide || "");
      setSign2(editableData?.sign_2 || "");
      setDateCoPi(
        editableData?.date_co_pi
          ? new Date(editableData.date_co_pi).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );

      setNameOfHod(editableData?.name_of_hod || "");
      setSign5(editableData?.sign_5 || "");
      setDateCoInv3(
        editableData?.date_co_inv_3
          ? new Date(editableData.date_co_inv_3).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0]
      );
      setCoInvestigators(editableData?.co_investigators);
    }
  }, [editableData]);

  // Add co investigator
  const addCoInvestigator = () => { 
    setCoInvestigators(prev => [
      ...prev,
      { name: "", sign: "", date: new Date().toISOString().split("T")[0] }
    ]);
  };

  //Delete co investigator
  const deleteCoInvestigator = (index) => {
    const updated = [...coInvestigators];
    updated.splice(index, 1);
    setCoInvestigators(updated);
  };

  // Handle co investigator change
  const handleChange = (index, field, value) => { 
    const updated = [...coInvestigators];
    updated[index][field] = value;
    setCoInvestigators(updated);
  };


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

  const confirmSubmit = async () => {
    try{
      setIsSubmitting(true);
      const userResponse = await axiosInstance.post( "/api/research/declaration",
        {
          selected_elements: selectedElements, 
          name_of_pi_research, date_pi, sign_1, 
          name_of_co_pi_guide, date_co_pi,  sign_2, 
          name_of_hod, date_co_inv_3,  sign_5, 
          email,
          co_investigators : coInvestigators
        }, 
        {
          params: {
            selectedForm: selectedForm,
            isEdit: editableData && Object.keys(editableData).length > 0 ? "true" : "false",
            tableName: "declaration",
            formId: (editableData && Object.keys(editableData).length > 0 ) ? editableData?.form_id : projectId
          },
        }
      );
      console.log("User created:", userResponse.data); 
      navigate("/checklist");
    }
    catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message );
    }
    finally {
      setIsSubmitting(false); // Hide loading
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const investigatorResponse = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"investigatorss",              // or hardcoded for now
            formId : projectId
          }
        });

        if(investigatorResponse.data.length > 0) {
          const prinicipal_Investigator = investigatorResponse.data?.filter((item) => item.investigator_type === "Principal_Investigator");
          const disabledOrNot = prinicipal_Investigator[0]?.emp_code;
          setIsDisabled(disabledOrNot === user);
        }
        
        const response = await axiosInstance.get("/api/research/check/admin", { 
          params : {
            form_type:"declaration",              // or hardcoded for now
            formId : projectId
          }
        });
        if (response.data.length > 0) {
          setExistData([response.data[response.data.length - 1]]); // You probably meant setExistData, not setExistData
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
      <div >
        <h3 className="hi">Preview </h3>

        <ul className="h">
          <li>
            <strong>PI / Researcher:</strong>
            <ul>
              <li><strong>Name:</strong> {name_of_pi_research}</li>
              <li><strong>Signature:</strong> {sign_1 || "Not signed"}</li>
              <li><strong>Date:</strong> {date_pi}</li>
            </ul>
          </li>

          <li>
            <strong>Co-PI / Guide:</strong>
            <ul>
              <li><strong>Name:</strong> {name_of_co_pi_guide}</li>
              <li><strong>Signature:</strong> {sign_2 || "Not signed"}</li>
              <li><strong>Date:</strong> {date_co_pi}</li>
            </ul>
          </li>
        <li>
          <strong>Co Investigators:</strong>
          <ul>
            {coInvestigators.map((co, index) => (
              <li key={index}>
                <strong>Co-Investigator {index + 1}:</strong>
                <ul>
                  <li><strong>Name:</strong> {co.name || "Not provided"}</li>
                  <li><strong>Signature:</strong> {co.sign || "Not signed"}</li>
                  <li><strong>Date:</strong> {co.date || "Not selected"}</li>
                </ul>
              </li>
            ))}
          </ul>
        </li>

          <li>
            <strong>HOD:</strong>
            <ul>
              <li><strong>Name:</strong> {name_of_hod}</li>
              <li><strong>Signature:</strong> {sign_5 || "Not signed"}</li>
              <li><strong>Date:</strong> {date_co_inv_3}</li>
            </ul>
          </li>

          <li>
            <strong>Selected Declarations:</strong>
            <ul>
              {selectedElements.map((el, i) => (
                <li key={i}>{el}</li>
              ))}
            </ul>
          </li>
        </ul>
        <button onClick={() => setShowPreview(false)} className="name"> Edit</button>
        <button onClick={confirmSubmit} className="name" disabled={isSubmitting}> {isSubmitting ? "Submitting..." : "Submit"}  </button>
      </div>
    );
  }
  return (
    <div className="form-container">
         {(existData && openTable) ? ( <TableComponent12 data={existData} setOpenTable = {setOpenTable} setEditableData = {setEditableData}/>):
      <form onSubmit={handlePreview}>
        <div className="h">
          <h3 className="hi">SECTION E: DECLARATION AND CHECKLIST</h3>
          <div>
            <h3 className="hi">11. DECLARATION (Please tick as applicable) </h3>
            <div className="h2">
              <div style = {{display : "flex", flexDirection : "column", gap : "10px"}}>
                {elementsList.map((item, index) => (
                    <label key={index} className="checkbox-label">
                      <input type="checkbox" value={item} checked={selectedElements.includes(item)}
                      onChange={handleCheckboxChange} /> {""}
                      {item}
                    </label>
                ))}
              </div>
            </div>
            <div style = {{display : "flex", justifyContent : "space-between"}}>
              <div >
                <h3 className="h2">Name of Principal Investigator</h3>
                <label>
                  <input type="text"  name="researcher" placeholder="Enter researcher"  value={name_of_pi_research}
                    onChange={(e) => setNameOfPiResearch(e.target.value)}  className="name"  required/>
                </label>
              </div>
              <div className="form-group">
                <h3 className="h2">Signature</h3>
                <label>
                  <input type="text" name="images" value={sign_1} className="name"  
               onChange={(e) => setSign1(e.target.value)}   placeholder="Enter your signature" required/>
                </label>
              </div>
            
              <div className="form-group">
                <h3 className="h2">Date</h3>
                <label>
                  <input
                    type="date" name="date" value={date_pi}
                    placeholder="YYYY/MM/DD"   onChange={(e) => setDatePi(e.target.value)} 
                    className="name" required />
                </label>
                <br />
              </div>
            </div>
            <div style = {{display : "flex", justifyContent : "space-between"}}>
              <div className="form-group">
                <h3 className="h2">Name of Guide: </h3>
                <label>
                  <input  type="text" name="text"   placeholder="Enter guide" value={name_of_co_pi_guide}
                    onChange={(e) => setNameOfCoPiGuide(e.target.value)} className="name" disabled = {isDisabled} />
                </label>
              </div>
              <div className="form-group">
                <h3 className="h2">Signature</h3>
                <label>
                  <input type="text" name="sign2" value={sign_2} className="name"  
               onChange={(e) => setSign2(e.target.value)}   placeholder="Enter your signature" disabled = {isDisabled}/>
                </label>
              </div>
             
              <div className="form-group">
                <h3 className="h2">Date</h3>
                <label>
                  <input type="date" name="date_co_pi"
                    value={date_co_pi} onChange={(e) => setDateCoPi(e.target.value)} className="name" disabled = {isDisabled} />
                </label>
                <br />
              </div>
            </div>
  
            <div style = {{display : "flex", justifyContent : "space-between"}}>
              <div >
                <h3 className="h2">Name of Head Of Department</h3>
                <label>
                  <input type="text"  name="hod" placeholder="Enter hod"  value={name_of_hod}
                    onChange={(e) => setNameOfHod(e.target.value)}  className="name" disabled = {isDisabled} />
                </label>
              </div>
              <div className="form-group">
                <h3 className="h2">Signature</h3>
                <label>
                  <input type="text" name="sign"  value={sign_5} onChange={(e) => setSign5(e.target.value)} 
                    placeholder="Enter your signature" className="name" disabled = {isDisabled}/>
                </label>
              </div>
            
              <div className="form-group">
                <h3 className="h2">Date</h3>
                <label>
                  <input  type="date" name="date" value={date_co_inv_3} disabled = {isDisabled}
                    onChange={(e) => setDateCoInv3(e.target.value)} className="name"  />
                </label>
                <br />
              </div>
            </div>
            <div>
              {coInvestigators.length > 0 && coInvestigators.map((co, index) => (
                <div key={index} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", gap: "20px", marginBottom: "20px", flexWrap: "wrap",
                    border: "1px solid #ccc", padding: "15px", borderRadius: "8px", position: "relative"
                  }}>
                  <div className="form-group" style={{ flex: 1, minWidth: "250px" }}>
                    <h3 className="h2">Name of Co-investigator {index + 1}</h3>
                    <label>
                      <input type="text" placeholder="Enter name" value={co.name} 
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        className="name" disabled={isDisabled} />
                    </label>
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: "250px" }}>
                    <h3 className="h2">Signature</h3>
                    <label> 
                      <input type="text" placeholder="Enter signature"
                        value={co.sign} onChange={(e) => handleChange(index, "sign", e.target.value)}
                        className="name" disabled={isDisabled} />
                    </label>
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: "250px" }}>
                    <h3 className="h2">Date</h3>
                    <label>
                      <input type="date" value={co.date} onChange={(e) => handleChange(index, "date", e.target.value)}
                        className="name" disabled={isDisabled} />
                    </label>
                  </div>

                  {coInvestigators.length > 1 && (
                    <button type="button" onClick={() => deleteCoInvestigator(index)}
                      style={{ position: "absolute", top: "10px", right: "10px", background: "#ff4d4d",
                        color: "#fff", border: "none", padding: "6px 10px", borderRadius: "4px", cursor: "pointer"
                      }} disabled={isDisabled} > Delete </button>
                  )}
                </div>
              ))}

      <button type="button" onClick={addCoInvestigator} style={{ backgroundColor: "#4CAF50",
          color: "#fff", border: "none", padding: "10px 16px", borderRadius: "5px",
          cursor: "pointer" }} disabled={isDisabled} >
        Add Co-Investigator
      </button>
    </div>
          </div>
        </div>
        <button type="submit" className="name"> Preview </button>
      </form>
  }
    </div>
  );
};
export default Section10;