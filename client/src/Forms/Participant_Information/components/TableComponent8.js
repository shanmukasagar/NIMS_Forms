import React from "react";

const TableComponent8 = ({ data, setOpenTable, setEditableData }) => {
  const handleEdit = () => {
    setOpenTable(false);
    const safeData = Array.isArray(data) ? data[0] : data;
    setEditableData(safeData);
  };

  const safeDataList = Array.isArray(data) ? data : [data];

  const containerStyle = {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  };

  const titleStyle = {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  };

  const cardStyle = {
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxHeight: "500px",
    overflowY: "auto",
  };

  const rowStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginBottom: "16px",
    wordBreak: "break-word",
  };

  const labelStyle = {
    fontWeight: 600,
    color: "#444",
    fontSize: "14px",
  };

  const valueStyle = {
    color: "#222",
    fontSize: "15px",
    backgroundColor: "#fff",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
  };

  const buttonStyle = {
    padding: "10px 24px",
    fontSize: "15px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.3s",
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Payment Compensation Overview</h2>

      {safeDataList.length > 0 ? (
        safeDataList.map((entry, index) => (
          <div key={index} style={cardStyle}>
            <div style={rowStyle}>
              <span style={labelStyle}>Waiver of Consent:</span>
              <span style={valueStyle}>{entry.waiver_consent_type || "N/A"}</span>
            </div>
            {
              entry.waiver_consent_type === "Yes" && (
                <div style={rowStyle}>
                  <span style={labelStyle}>Waiver Details:</span>
                  <span style={valueStyle}>{entry.specify || "N/A"}</span>
                </div>
              )
            }
            
            <div style={rowStyle}>
              <span style={labelStyle}>Compensation Research:</span>
              <span style={valueStyle}>{entry.compensation_research_of_type || "N/A"}</span>
            </div>
            {
              entry.compensation_research_of_type === "Yes" && (
                <div style={rowStyle}>
                  <span style={labelStyle}>Compensation Specific:</span>
                  <span style={valueStyle}>{entry.specific || "N/A"}</span>
                </div>
              )
            }
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>No data found.</p>
      )}

      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={handleEdit}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default TableComponent8;
