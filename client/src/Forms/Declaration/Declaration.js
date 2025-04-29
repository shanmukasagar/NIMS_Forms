import { useState,useEffect } from "react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

import TableComponent12 from  "./components/TableComponent12.js";
import axiosInstance from "../../components/AxiosInstance.js";
const Section10 = () => {
  const [name_of_pi_research, setNameOfPiResearch] = useState("");
  const [image1, setImage1] = useState("null");
  const [date_pi, setDatePi] = useState(new Date().toISOString().split("T")[0]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [name_of_co_pi_guide, setNameOfCoPiGuide] = useState("");
  const [image2, setImage2] = useState("null");
  const [date_co_pi, setDateCoPi] = useState(
  new Date().toISOString().split("T")[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [name_of_co_investigator_1, setNameOfCoInvestigator1] = useState("");
  const [image3, setImage3] = useState("null");
  const [date_co_inv_1, setDateCoInv1] = useState(
  new Date().toISOString().split("T")[0]);
  const [name_of_co_investigator_2, setNameOfCoInvestigator2] = useState("");
  const [image4, setImage4] = useState("null");
  const [date_co_inv_2, setDateCoInv2] = useState(
  new Date().toISOString().split("T")[0]);
  const[existData,setExistData]=useState(null);
  const [email]=useState("");
  const navigate = useNavigate();

  const elementsList = [
    "I/We certify that the information provided in this application is complete and correct.",
    "I/We confirm that all investigators have approved the submitted version of proposal /related documents",
    "I/We confirm that this study will be conducted in accordance with the latest ICMR National Ethical Guidelines for Biomedical and Health Research involving HumanParticipants and other applicable regulations and guidelines including responsible",

   "I/We will comply with all policies and guidelines of the institute and affiliated / collaborating institutions wherever applicable",
    "I/We confirm that we shall submit any protocol amendments, adverse events report,significant deviations from protocols, regular progress reports and a final report and also participate in any audit of the study if needed",

    "I/We confirm that we will maintain accurate and complete records of all aspects of the study.",
    " I/We will protect the privacy of participants and assure safety and confidentiality of study data and biological samples.",
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
  const confirmSubmit = async () => {
      const userResponse = await axiosInstance.post( "/api/research/declaration",
        {
          selectedElements: selectedElements,name_of_pi_research, date_pi,name_of_co_pi_guide,date_co_pi, 
           name_of_co_investigator_1,  date_co_inv_1,name_of_co_investigator_2,date_co_inv_2,email
        }
      );
     
      console.log("User created:", userResponse.data); 
      const formData = new FormData();
      if (image1) formData.append("images", image1);
      if (image2) formData.append("images", image2);
      if (image3) formData.append("images", image3);
      if (image4) formData.append("images", image4);  
    try {
      const response = await axiosInstance.post("/api/research/upload-declaration", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("declarationmodelUpload successful:", response.data);

      navigate("/checklist");
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
            form_type:"declaration"// or hardcoded for now
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
      <div >
        <h3 className="hi">Preview </h3>
        <ul className="h">
          <li> <strong>PI/Researcher:</strong> {name_of_pi_research}  </li>
          <li><strong>PI Date:</strong> {date_pi} </li>
          <li><strong>Co-PI/Guide:</strong> {name_of_co_pi_guide} </li>
          <li><strong>Co-PI Date:</strong> {date_co_pi} </li>
          <li><strong>Co-Investigator 1:</strong> {name_of_co_investigator_1}</li>
          <li><strong>Co-Investigator 1 Date:</strong> {date_co_inv_1}</li>
          <li><strong>Co-Investigator 2:</strong> {name_of_co_investigator_2}</li>
          <li><strong>Co-Investigator 2 Date:</strong> {date_co_inv_2}</li>
          <li><strong>Selected Declarations:</strong>
           <ul>
              {selectedElements.map((el, i) => ( <li key={i}>{el}</li>))}  </ul>
          </li>
          <li>
            <strong>Signatures:</strong>
            <ul>
              <li>Image 1: {image1?.name || "No file selected"}</li>
              <li>Image 2: {image2?.name || "No file selected"}</li>
              <li>Image 3: {image3?.name || "No file selected"}</li>
              <li>Image 4: {image4?.name || "No file selected"}</li>
            </ul>
          </li>
        </ul>
        <button onClick={() => setShowPreview(false)} className="name"> Edit</button>
        <button onClick={confirmSubmit} className="name"> Submit  </button>
      </div>
    );
  }
  return (
    <div className="form-container">
         {existData ? ( <TableComponent12 data={existData} />):
      <form onSubmit={handlePreview}>
        <div className="h">
          <h3 className="hi">SECTION E: DECLARATION AND CHECKLIST</h3>
          <div>
            <h3 className="hi">11. DECLARATION (Please tick as applicable) </h3>
            <div className="h2">
              {elementsList.map((item, index) => (
                <label key={index} className="checkbox-label">
                  <br></br>
                  <input type="checkbox" value={item} checked={selectedElements.includes(item)}
                   onChange={handleCheckboxChange} /> {""}
                 <br></br>
                  {item}
              </label>
              ))}
            </div>
            <div >
              <h3 className="h2">Name of PI/Researcher</h3>
              <label>
                <input type="text"  name="researcher" placeholder="Enter researcher"  value={name_of_pi_research}
                  onChange={(e) => setNameOfPiResearch(e.target.value)}  className="name" required />
              </label>
            </div>
            <br></br>

            <div className="form-row">
              <div className="form-group">
                <h3 className="h2">signature</h3>
                <label>
                  <input
                    type="file" name="images" onChange={(e) => setImage1(e.target.files[0])} 
                    className="name"required/>
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

            <div className="form-group">
              <h3 className="h2">Name of Co-PI / Guide: </h3>
              <label>
                <input  type="text" name="text"   placeholder="Enter guide" value={name_of_co_pi_guide}
                  onChange={(e) => setNameOfCoPiGuide(e.target.value)} className="name" required />
              </label>
            </div>
            <br></br>

            <div className="form-row">
              <div className="form-group">
                <h3 className="h2">signature</h3>
                <label>
                  <input  type="file"name="images"
                    onChange={(e) => setImage2(e.target.files[0])} className="name" required />
                </label>
              </div>
              <div className="form-group">
                <h3 className="h2">Date</h3>
                <label>
                  <input type="date" name="date_co_pi"
                    value={date_co_pi} onChange={(e) => setDateCoPi(e.target.value)} className="name"  required />
                </label>
                <br />
              </div>
            </div>

            <div className="form-group">
              <h3 className="h2">
                Name of Co- investigator / Co-Guide:{" "}
              </h3>
              <label>
                <input  type="text" name="coguide" placeholder="Enter guide"  value={name_of_co_investigator_1}
                  onChange={(e) => setNameOfCoInvestigator1(e.target.value)}  className="name" required />
              </label>
            </div>
            <br></br>

            <div className="form-row">
              <div className="form-group">
                <h3 className="h2">signature</h3>
                <label>
                  <input type="file" name="images" onChange={(e) => setImage3(e.target.files[0])} className="name"
               required />
                </label>
              </div>
              <div className="form-group">
                <h3 className="h2">Date</h3>
                <label>
                  <input  type="date" name="date" value={date_co_inv_1}
                    onChange={(e) => setDateCoInv1(e.target.value)} className="name" required />
                </label>
                <br />
              </div>
            </div>
            <div className="form-group">
              <h3 className="h2">
                Name of Co- investigator / Co-Guide:{" "}
              </h3>
              <label>
                <input type="text" name="guidde"  placeholder="Enter guidde"  value={name_of_co_investigator_2} 
                onChange={(e) => setNameOfCoInvestigator2(e.target.value)}  className="name" required  />
              </label>
            </div>
            <br></br>
            <div className="form-row">
              <div className="form-group">
                <h3 className="h2">signature</h3>
                <label>
                  <input type="file" name="images" onChange={(e) => setImage4(e.target.files[0])}  
                  className="name" required />
                </label>
              </div>
              <div className="form-group">
                <h3 className="h2">Date</h3>
                <label> <input type="date" placeholder="YYYY/MM/DD"  name="date" value={date_co_inv_2 || ""}  
                onChange={(e) => setDateCoInv2(e.target.value)} className="name"   required/> </label>
                <br />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="name">
          Preview
        </button>
      </form>
  }
    </div>
  );
};
export default Section10;