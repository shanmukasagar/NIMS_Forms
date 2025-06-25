import React from "react";

const TableComponent4 = ({ data, setEditableData, setOpenTable }) => {
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
      <h2 style={titleStyle}>Overview Research Data</h2>

      {safeDataList.map((entry, index) => (
        <div key={index} style={cardStyle}>
          <div style={rowStyle}>
            <span style={labelStyle}>Summary:</span>
            <span style={valueStyle}>{entry.summary}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Type of Study:</span>
            <span style={valueStyle}>{entry.type_of_study}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>External Lab:</span>
            <span style={valueStyle}>{entry.external_laboratory}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Lab Details:</span>
            <span style={valueStyle}>{entry.specify || "N/A"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Other Study Type:</span>
            <span style={valueStyle}>{entry.otherstudytype || "N/A"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Sample Size:</span>
            <span style={valueStyle}>{entry.sample_size || "N/A"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Justification:</span>
            <span style={valueStyle}>{entry.justification || "N/A"}</span>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Email:</span>
            <span style={valueStyle}>{entry.email}</span>
          </div>
        </div>
      ))}

      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={handleEdit}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default TableComponent4;
