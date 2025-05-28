import { useState, useEffect } from "react";
import TableComponent2 from "./components/TableComponent2";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../components/AxiosInstance";

const styles = {
  formContainer: {
    maxWidth: "900px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
    fontFamily: "Arial, sans-serif",
  },
  formTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  investigatorCard: {
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#fff",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "8px",
    marginBottom: "17px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "18px",
  },
  btn: {
    padding: "10px 20px",
    margin: "10px 10px 0 0",
    fontSize: "14px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  btnSecondary: {
    backgroundColor: "#6c757d",
  },
  previewCard: {
    padding: "15px",
    marginBottom: "15px",
    border: "1px solid #bbb",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
};

const DetailsInvestigator = () => {
  const navigate = useNavigate();
  const [existData, setExistData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const [principal, setPrincipal] = useState({
    name: "", designation: "", qualification: "", department: "", Email: "", contact: "", investigator_type: "Principal_Investigator"
  });

  const [guide, setGuide] = useState({
    name: "", designation: "", qualification: "", department: "", Email: "", contact: "", investigator_type: "Guide"
  });

  const [coInvestigators, setCoInvestigators] = useState([
    { name: "", designation: "", qualification: "", department: "", Email: "", contact: "", investigator_type: "Co-investigator" },
    { name: "", designation: "", qualification: "", department: "", Email: "", contact: "", investigator_type: "Co-investigator" },
  ]);

  const handleCoInvestigatorChange = (index, field, value) => {
    const updated = [...coInvestigators];
    updated[index][field] = value;
    setCoInvestigators(updated);
  };

  const Submit = async (e) => {
    e.preventDefault();
    try {
      const allInvestigators = [principal, guide, ...coInvestigators].filter(inv => inv.name);
      await axiosInstance.post("/api/research/investigatorss", allInvestigators);
      console.log("Investigators created");
      navigate("/basic/funding");
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleEdit = () => setShowPreview(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/api/research/check/admin", {
          params: { form_type: "investigatorss" },
        });
        if (response.data.length > 0) setExistData(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setExistData(null);
      }
    };
    fetchData();
  }, []);

  const renderInvestigatorInput = (data, setData, prefix = "", required = false) => (
    <div style={styles.investigatorCard}>
      <h4>{prefix}</h4>
      <input style={styles.input} type="text" placeholder="Name" value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })} required={required} />
      <input style={styles.input} type="text" placeholder="Designation" value={data.designation}
        onChange={(e) => setData({ ...data, designation: e.target.value })} required={required} />
      <input style={styles.input} type="text" placeholder="Qualification" value={data.qualification}
        onChange={(e) => setData({ ...data, qualification: e.target.value })} required={required} />
      <input style={styles.input} type="text" placeholder="Department" value={data.department}
        onChange={(e) => setData({ ...data, department: e.target.value })} required={required} />
      <input style={styles.input} type="email" placeholder="Email" value={data.Email}
        onChange={(e) => setData({ ...data, Email: e.target.value })} required={required} />
      <input style={styles.input} type="text" placeholder="Contact No" value={data.contact}
        onChange={(e) => setData({ ...data, contact: e.target.value })} required={required} />
    </div>
  );

  if (showPreview) {
    return (
      <div style={styles.formContainer}>
        <h2 style={styles.formTitle}>Preview</h2>
        {[{ title: "Principal Investigator", data: principal },
          { title: "Guide", data: guide },
          ...coInvestigators.map((coi, index) => ({ title: `Co-Investigator ${index + 1}`, data: coi }))
        ].map((section, idx) => (
          <div key={idx} style={styles.previewCard}>
            <h3>{section.title}</h3>
            {Object.entries(section.data).map(([key, value]) => (
              <p key={key}><strong>{key}:</strong> {value}</p>
            ))}
          </div>
        ))}
        <button onClick={Submit} style={styles.btn}>Submit</button>
        <button onClick={handleEdit} style={{ ...styles.btn, ...styles.btnSecondary }}>Edit</button>
      </div>
    );
  }

  return (
    <div style={styles.formContainer}>
      {existData ? (
        <TableComponent2 data={existData} />
      ) : (
        <form onSubmit={handlePreview}>
          <h2 style={styles.formTitle}>G. Details of Investigators / Researcher(s):</h2>
          {renderInvestigatorInput(principal, setPrincipal, "Principal Investigator", true)}
          {renderInvestigatorInput(guide, setGuide, "Guide", false)}
          {coInvestigators.map((coi, index) =>
            renderInvestigatorInput(coi, (newData) => {
              const updated = [...coInvestigators];
              updated[index] = newData;
              setCoInvestigators(updated);
            }, `Co-Investigator ${index + 1}`)
          )}
          <button type="submit" style={styles.btn}>Preview</button>
        </form>
      )}
    </div>
  );
};

export default DetailsInvestigator;
