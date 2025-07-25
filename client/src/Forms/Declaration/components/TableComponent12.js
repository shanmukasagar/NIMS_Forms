import React from "react";

const TableComponent12 = ({ data, setOpenTable, setEditableData }) => {
  const handleEdit = () => {
    setOpenTable(false);
    const safeData = Array.isArray(data) ? data[0] : data;
    setEditableData(safeData);
  };

  const safeDataList = Array.isArray(data) ? data : [data];

  const containerStyle = {
    padding: "20px",
    maxWidth: "700px",
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
    maxHeight: "600px",
    overflowY: "auto",
  };

  const sectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "20px",
    wordBreak: "break-word",
  };

  const labelStyle = {
    fontWeight: 600,
    color: "#555",
    fontSize: "14px",
  };

  const valueStyle = {
    backgroundColor: "#fff",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "15px",
    color: "#222",
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
      <h2 style={titleStyle}>Declaration Data</h2>

      {safeDataList.map((item, index) => (
        <div key={index} style={cardStyle}>
          <div style={sectionStyle}>
            <div>
              <div style={labelStyle}>Selected Elements</div>
              {item.selected_elements?.length > 0
                ? item.selected_elements.map((val, idx) => (
                    <p key={idx} style={valueStyle}>{val}</p>
                  ))
                : <div style={valueStyle}>N/A</div>}
            </div>

            <div>
              <div style={labelStyle}>Email</div>
              <div style={valueStyle}>{item.email || "N/A"}</div>
            </div>

            <div>
              <div style={labelStyle}>Prinicipal Investigator Name</div>
              <div style={valueStyle}>{item.name_of_pi_research || "N/A"}</div>
            </div>

            <div>
              <div style={labelStyle}>Prinicipal Investigator Signature</div>
              <div style={valueStyle}>{item.sign_1 || "N/A"}</div>
            </div>

            <div>
              <div style={labelStyle}>Prinicipal Investigator Date</div>
              <div style={valueStyle}>{item.date_pi || "N/A"}</div>
            </div>

            <div>
              <div style={labelStyle}>Guide Name</div>
              <div style={valueStyle}>{item.name_of_co_pi_guide || "N/A"}</div>
            </div>

            <div>
              <div style={labelStyle}>Guide Signature</div>
              <div style={valueStyle}>{item.sign_2 || "N/A"}</div>
            </div>

            <div>
              <div style={labelStyle}>Guide Date</div>
              <div style={valueStyle}>{item.date_co_pi || "N/A"}</div>
            </div>

            <div>
              <div style={labelStyle}>HOD Name</div>
              <div style={valueStyle}>{item.name_of_hod || "N/A"}</div>
            </div>

            <div>
              <div style={labelStyle}>HOD Signature</div>
              <div style={valueStyle}>{item.sign_5 || "N/A"}</div>
            </div>

            <div>
              <div style={labelStyle}>HOD Date</div>
              <div style={valueStyle}>{item.date_co_inv_3 || "N/A"}</div>
            </div>
            <div>
              {item.co_investigators && Array.isArray(item.co_investigators) && item.co_investigators.length > 0 ? (
                item.co_investigators.map((co, idx) => (
                  <div key={idx} style={{ marginBottom: "16px" }}>
                    <div style={labelStyle}>Co-Investigator {idx + 1}</div>

                    <div>
                      <div style={labelStyle}>Name</div>
                      <div style={valueStyle}>{co.name || "N/A"}</div>
                    </div>

                    <div>
                      <div style={labelStyle}>Signature</div>
                      <div style={valueStyle}>{co.signature || "N/A"}</div>
                    </div>

                    <div>
                      <div style={labelStyle}>Date</div>
                      <div style={valueStyle}>{co.date || "N/A"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <div style={labelStyle}>Co-Investigators</div>
                  <div style={valueStyle}>None</div>
                </div>
              )}
            </div>
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

export default TableComponent12;
