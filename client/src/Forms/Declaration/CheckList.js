import { useNavigate } from "react-router-dom";

import { useState ,useEffect} from "react";
import "../../App.css";
import TableComponent11 from  "./components/TableComponent11.js";
import axiosInstance from "../../components/AxiosInstance.js";
const Section11 = () => {
  const [documents, setDocuments] = useState("");
  const [enclosure1, setEnclosure1] = useState("");
  const [remarks1, setRemarks1] = useState("");
  const [investigator, setInvestigator] = useState("");
  const [enclosure2, setEnclosure2] = useState("");
  const [remarks2, setRemarks2] = useState("");
  const [clinic, setClinic] = useState("");
  const [enclosure3, setEnclosure3] = useState("");
  const [remarks3, setRemarks3] = useState("");
  const [clearance, setClearance] = useState("");
  const [enclosure4, setEnclosure4] = useState("");
  const [remarks4, setRemarks4] = useState("");
  const [partners, setPartners] = useState("");
  const [enclosure5, setEnclosure5] = useState("");
  const [remarks5, setRemarks5] = useState("");
  const [protocol, setProtocol] = useState("");
  const [enclosure6, setEnclosure6] = useState("");
  const [remarks6, setRemarks6] = useState("");
  const [translate, setTranslate] = useState("");
  const [enclosure7, setEnclosure7] = useState("");
  const [remarks7, setRemarks7] = useState("");
  const [minors, setMinors] = useState("");
  const [enclosure8, setEnclosure8] = useState("");
  const [remarks8, setRemarks8] = useState("");
  const [proforma, setProforma] = useState("");
  const [enclosure10, setEnclosure10] = useState("");
  const [remarks10, setRemarks10] = useState("");
  const [advertise, setAdvertise] = useState("");
  const [enclosure11, setEnclosure11] = useState("");
  const [remarks11, setRemarks11] = useState("");
  const [insurance, setInsurance] = useState("");
  const [enclosure12, setEnclosure12] = useState("");
  const [remarks12, setRemarks12] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const[existData,setExistData]=useState(null);
  const [email]=useState("");
  
  const navigate = useNavigate();

  const handlePreview = (e) => { 
    e.preventDefault();
    setShowPreview(true); 
  };

  const confirmSubmit = async () => { 
    try {
      const userResponse = await axiosInstance.post(
        "/api/research/administrative_requirements",
        {
          documents,enclosure1,remarks1,investigator,enclosure2,  remarks2,clinic,enclosure3,remarks3,clearance,
          enclosure4, remarks4, partners,enclosure5,remarks5, protocol,enclosure6, remarks6, translate, 
            enclosure7,   remarks7, minors,  enclosure8,  remarks8, proforma, enclosure10,remarks10, 
            advertise,enclosure11,   remarks11,insurance,  enclosure12, remarks12,
        }
      );
    
      console.log("User created:", userResponse.data);
      navigate("/expedited");
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
            form_type:"administrative_requirements"// or hardcoded for now
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
  const handleEdit = () => {
    setShowPreview(false); 
  };
  if (showPreview) {
    return (
      <div >
        <h1 className="h2">Preview</h1>
        <div className="h">
       
        <p> <strong>Documents</strong> : {documents}, Enclosure: {enclosure1}, Remarks: {remarks1}</p>
        <p> <strong>Investigator</strong>: {investigator}, Enclosure: {enclosure2}, Remarks: {remarks2}</p>
        <p> <strong>Clinic</strong> : {clinic}, Enclosure: {enclosure3}, Remarks: {remarks3}</p>
        <p><strong>Clearance</strong> : {clearance}, Enclosure: {enclosure4}, Remarks: {remarks4}</p>
        <p> <strong>Partners</strong> : {partners}, Enclosure: {enclosure5}, Remarks: {remarks5}</p>
        <p> <strong>Protocol</strong> : {protocol}, Enclosure: {enclosure6}, Remarks: {remarks6}</p>
        <p><strong>Translate</strong> : {translate}, Enclosure: {enclosure7}, Remarks: {remarks7}</p>
        <p> <strong>Minors</strong> : {minors}, Enclosure: {enclosure8}, Remarks: {remarks8}</p>
        <p><strong>Proforma</strong> : {proforma}, Enclosure: {enclosure10}, Remarks: {remarks10}</p>
        <p><strong>Advertise</strong> : {advertise}, Enclosure: {enclosure11}, Remarks: {remarks11}</p>
        <p><strong>Insurance</strong> : {insurance}, Enclosure: {enclosure12}, Remarks: {remarks12}</p></div>
        <button onClick={confirmSubmit} className="name">
         Submit
        </button>
        <button onClick={handleEdit} className="name">
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
        {existData ? ( <TableComponent11 data={existData} />):
      <form onSubmit={handlePreview}>
      <h1 className="hi">12. CHECKLIST</h1>
      <h1 className="h2">ADMINISTRATIVE REQUIREMENTS</h1>
        <div className="h2">
          <h3 className="h2">
            1.Cover letter enlisting all documents enclosed{" "}
          </h3>
          <div className="radio-group">
            <label>
              <input type="radio"  name="documents" value="Yes"checked={documents === "Yes"}
              onChange={(e) => setDocuments(e.target.value)}/>{" "}Yes </label>
             <label>
              <input type="radio"  name="documents" value="No" checked={documents === "No"}
              onChange={(e) => setDocuments(e.target.value)}/>{" "}  No </label>
            <label>
              <input type="radio"   name="documents" value="NA" checked={documents === "NA"}
              onChange={(e) => setDocuments(e.target.value)}/>{" "}NA
            </label>
            <div>
              <div>
                <h5 className="h2">Enclosure no:</h5>
                <label>
                  <input type="number"  name="Enclosure1"   placeholder="Number"value={enclosure1} 
                  onChange={(e) => setEnclosure1(e.target.value)}  className="name" required />
                </label>
              </div>
            </div>
            <br></br>
            <div >
              <h5 className="h2">EC Remarks(Ifapplicable)</h5>
              <label>
                <input  type="text"  placeholder="Remarks" value={remarks1}
                 onChange={(e) => setRemarks1(e.target.value)} className="name"required />
              </label>
            </div>
          </div>
          {/* 2 */}
          <h3 className="h2">
            2.Brief CV of all Investigators (updated, signed and dated){" "}
          </h3>
          <div className="h2">
            <label>
              <input type="radio"  name="updated"  value="Yes"checked={investigator === "Yes"} 
              onChange={(e) => setInvestigator(e.target.value)}  />{" "}   Yes
            </label>
            <label>
              <input type="radio"   name="updated"    value="No" checked={investigator === "No"} 
              onChange={(e) => setInvestigator(e.target.value)} />{" "}   No
            </label>

            <label>
              <input
                type="radio" name="updated" value="NA" checked={investigator === "NA"}
                onChange={(e) => setInvestigator(e.target.value)} />{" "}
              NA
            </label>
            <div>
              <div className="h2">
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input
                    type="number" placeholder="Number" value={enclosure2}
                    onChange={(e) => setEnclosure2(Number(e.target.value))}  className="name"  required />
                </label>
              </div>
            </div>

            <div className="h2">
              <h2 className="h2">EC Remarks(Ifapplicable)</h2>
              <label>
                <input
                  type="text"  placeholder="Remarks"
                  value={remarks2} onChange={(e) => setRemarks2(e.target.value)}  className="name"  required/>
              </label>
            </div>
          </div>
          {/* 3 */}
          <h3 className="h2">
            3.Good Clinical Practice (GCP) training of investigators in last 3
            years{" "}
          </h3>
          <div className="h2">
            <label>
              <input type="radio"  name="clinic"  value="Yes"
                checked={clinic === "Yes"}   onChange={(e) => setClinic(e.target.value)} />{" "} Yes </label>
            <label>
              <input type="radio" name="clinic" value="No"
                checked={clinic === "No"} onChange={(e) => setClinic(e.target.value)}
              />{" "}
              No
            </label>

            <label>
              <input type="radio" name="clinic" value="NA"
                checked={clinic === "NA"}  onChange={(e) => setClinic(e.target.value)} />{" "}
              NA
            </label>
            <div>
              <div >
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input type="number" placeholder="Number"
                    value={enclosure3}  onChange={(e) => setEnclosure3(Number(e.target.value))}
                    className="name" required /> {""}
                </label>
              </div>
            </div>
            <br></br>

            <div>
              <h2 className="h2">EC Remarks(If applicable)</h2>
              <label>
                <input type="text" placeholder="Remarks3" value={remarks3}
                  onChange={(e) => setRemarks3(e.target.value)} className="name" required
                />
                {""}
              </label>
            </div>
          </div>

          {/* 4 */}
          <h3 className="h2">4.EC clearance of other centers</h3>
          <div className="radio-group">
            <label>
              <input type="radio"  name="clearance"   value="Yes"
                checked={clearance === "Yes"} onChange={(e) => setClearance(e.target.value)} />{" "}
              Yes
            </label>
            <label>
              <input type="radio"   name="clearance" value="No" checked={clearance === "No"}
                onChange={(e) => setClearance(e.target.value)} />{" "} No
            </label>

            <label>
              <input type="radio"  name="clearance" value="NA" checked={clearance === "NA"}
                onChange={(e) => setClearance(e.target.value)}
              />{" "}
              NA
            </label>
            <div>
              <div >
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input type="number" placeholder="Number"   value={enclosure4}
                    onChange={(e) => setEnclosure4(Number(e.target.value))} className="name"    required  />
                </label>
              </div>
            </div>
            <br></br>

            <div >
              <h2 className="h2">EC Remarks(Ifapplicable)</h2>
              <label>
                <input type="text"  placeholder="Remarks" value={remarks4}
                  onChange={(e) => setRemarks4(e.target.value)} className="name"  required />
              </label>
            </div>
          </div>

          {/* 5 */}
          <h3 className="h2">5.MOU between collaborating partners</h3>
          <div className="h2">
            <label>
              <input type="radio"  name="partners"  value="Yes" checked={partners === "Yes"}
                onChange={(e) => setPartners(e.target.value)} />{" "}
              Yes
            </label>
            <label>
              <input  type="radio"  name="partners"
                value="No"  checked={partners === "No"} onChange={(e) => setPartners(e.target.value)}  />{" "}No
            </label>

            <label>
              <input type="radio"  name="partner"
                value="NA" checked={partners === "NA"}  onChange={(e) => setPartners(e.target.value)} />{" "}
              NA
            </label>
            <div>
              <div >
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input
                    type="number"  placeholder="Number" value={enclosure5}
                    onChange={(e) => setEnclosure5(Number(e.target.value))}    className="name"  required  />
                </label>
              </div>
            </div>
            <br></br>

            <div>
              <h2 className="h2">EC Remarks(Ifapplicable)</h2>
              <label>
                <input type="text" placeholder="Remarks"   value={remarks5}
                  onChange={(e) => setRemarks5(e.target.value)}   className="name"  required />
              </label>
            </div>
          </div>
          {/* 6 */}
          <h1 className="h2">PROPOSAL RELATED </h1>

          <h3 className="h2">
            6.Copy of the detailed protocol (clearly identified numbered and
            dated) and synopsis (summary as far as possible in non-technical
            language, flowchart, diagrammatic representation of the protocol)
          </h3>
          <div className="h2">
            <label>
              <input type="radio" name="protocol"
                value="Yes" checked={protocol === "Yes"} onChange={(e) => setProtocol(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input   type="radio" name="protocol"  value="No"  checked={protocol === "No"}
                onChange={(e) => setProtocol(e.target.value)}
              />{" "}
              No
            </label>

            <label>
              <input type="radio" name="protocol"  value="NA" checked={protocol === "NA"}
                onChange={(e) => setProtocol(e.target.value)}
              />{" "}
              NA
            </label>
            <div>
              <div >
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input type="number" placeholder="Number"  value={enclosure6}
                    onChange={(e) => setEnclosure6(Number(e.target.value))} className="name" required/>
                </label>
              </div>
            </div>
            <br></br>

            <div>
              <h2 className="h2">EC Remarks(Ifapplicable)</h2>
              <label>
                <input type="text"    placeholder="Remarks"
                  value={remarks6} onChange={(e) => setRemarks6(e.target.value)}   className="name" required />
              </label>
            </div>
          </div>
          {/* 7 */}
          <h3 className="h2">
            7.Participant Information Sheet (PIS) and Informed Consent Form
            (ICF) (English and translated) with version number and dated
          </h3>
          <div className="h2">
            <label>
              <input type="radio"  name="translate"value="Yes"  checked={translate === "Yes"}
                onChange={(e) => setTranslate(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input  type="radio" name="translate" value="No"
                checked={translate === "No"} onChange={(e) => setTranslate(e.target.value)} />{" "}
              No
            </label>

            <label>
              <input type="radio"  name="translate"  value="NA"
                checked={translate === "NA"} onChange={(e) => setTranslate(e.target.value)} />{" "}
              NA
            </label>
            <div>
              <div className="h2">
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input  type="number" placeholder="Number" value={enclosure7}
                    onChange={(e) => setEnclosure7(Number(e.target.value))} className="name" required/>
                </label>
              </div>
            </div>
            <br></br>

            <div >
              <h2 className="h2">EC Remarks(Ifapplicable)</h2>
              <label>
                <input
                  type="text"  placeholder="Remarks"   value={remarks7}
                  onChange={(e) => setRemarks7(e.target.value)}   className="name" required />
              </label>
            </div>
          </div>

          {/* 8 */}
          <h3 className="h2">
            8.Assent form for minors (12-18 years) (English and Translated)
          </h3>
          <div className="h2">
            <label>
              <input type="radio" name="minor"     value="Yes"
                checked={minors === "Yes"}  onChange={(e) => setMinors(e.target.value)} />{" "}
              Yes
            </label>
            <label>
              <input type="radio"    name="minor"   value="No"
                checked={minors === "No"} onChange={(e) => setMinors(e.target.value)}  />{" "}   No
            </label>

            <label>
              <input type="radio" name="minor" value="NA"
                checked={minors === "NA"} onChange={(e) => setMinors(e.target.value)}
              />{" "}
              NA
            </label>
            <div>
              <div >
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input type="number"    placeholder="Number"  value={enclosure8}
                    onChange={(e) => setEnclosure8(Number(e.target.value))}  className="name"  required
                  />
                </label>
              </div>
            </div>
            <br></br>

            <div >
              <h2 className="h2">EC Remarks(Ifapplicable)</h2>
              <label>
                <input
                  type="text" placeholder="Remarks"  value={remarks8}
                  onChange={(e) => setRemarks8(e.target.value)}   className="name"  required />
              </label>
            </div>
          </div>

          <h3 className="h2">
            9.Application for waiver of consent if applicable
          </h3>
          {/* 10 */}
          <h3 className="h2">
            10.Proforma / Questionnaire / Case Report Forms (CRF) / Interview
            guides / Guides for Focused Group Discussions (FGDs) (English and
            translated) which are numbered and dated
          </h3>
          <div className="h2">
            <label>
              <input type="radio"   name="proforma"  value="Yes"   checked={proforma === "Yes"}
                onChange={(e) => setProforma(e.target.value)} />{" "}
              Yes
            </label>
            <label>
              <input type="radio" name="proforma"value="No"
                checked={proforma === "No"}     onChange={(e) => setProforma(e.target.value)} />{" "}
              No
            </label>

            <label>
              <input type="radio" name="proforma"  value="NA"
                checked={proforma === "NA"}  onChange={(e) => setProforma(e.target.value)}
              />{" "}
              NA
            </label>
            <div>
              <div className="h2">
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input type="number"  placeholder="Number"  value={enclosure10}
                    onChange={(e) => setEnclosure10(Number(e.target.value))} className="name"  required />
                </label>
              </div>
            </div>
            <br></br>

            <div >
              <h2 className="h2">EC Remarks(Ifapplicable)</h2>
              <label>
                <input
                  type="text" placeholder="Remarks"  value={remarks10}
                  onChange={(e) => setRemarks10(e.target.value)} className="name" required />
              </label>
            </div>
          </div>

          <h3 className="h2">
            11.Advertisement / material to recruit participants (fliers,
            posters, etc.)
          </h3>
          <div className="h2">
            <label>
              <input
                type="radio" name="advertise"  value="Yes"
                checked={advertise === "Yes"} onChange={(e) => setAdvertise(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"  name="advertise"   value="No"
                checked={advertise === "No"} onChange={(e) => setAdvertise(e.target.value)}
              />{" "}
              No
            </label>

            <label>
              <input type="radio"name="advertise"value="NA" checked={advertise === "NA"}
               onChange={(e) => setAdvertise(e.target.value)} />{" "}   NA
            </label>
            <div>
              <div className="h2">
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input type="number"placeholder="Number" value={enclosure11}
                  onChange={(e) => setEnclosure11(Number(e.target.value))}   className="name" required  />
                </label> </div>
            </div>
            <br></br>

            <div>
              <h2 className="h2">EC Remarks(Ifapplicable)</h2>
              <label>   
                <input   type="text"placeholder="Remarks"value={remarks11}
                onChange={(e) => setRemarks11(e.target.value)}  className="name"required  />     </label>
            </div>
          </div>
          <h3 className="h2">
            12.Insurance policy / A description of arrangement for insurance
            coverage for research participants, if applicable
          </h3>
          <div className="h2">
            <label>
              <input
                type="radio"
                name="insurance" value="Yes" checked={insurance === "Yes"}  
                onChange={(e) => setInsurance(e.target.value)}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio" name="insurance"  value="No"
                checked={insurance === "No"} onChange={(e) => setInsurance(e.target.value)}
              />{" "}
              No
            </label>

            <label>
              <input
                type="radio" name="insurance"   value="NA"
                checked={insurance === "NA"} onChange={(e) => setInsurance(e.target.value)}
              />{" "}
              NA
            </label>
            <div>
              <div >
                <h2 className="h2">Enclosure no:</h2>
                <label>
                  <input type="number" placeholder="Number" value={enclosure12} 
                  onChange={(e) => setEnclosure12(Number(e.target.value))} className="name" required/>
                </label>
              </div>
               </div>
            <br></br>
            <div>
              <h2 className="h2">EC Remarks(Ifapplicable)</h2>
              <label>
                <input type="text"   placeholder="Remarks"    value={remarks12} 
                onChange={(e) => setRemarks12(e.target.value)}   className="name"required/>
              </label>
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

export default Section11;