import React from "react";

const TableComponent = ({ data, setOpenTable, setEditableData }) => {
  const handleEdit = () => {
    setOpenTable(false);
    setEditableData(data[0]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Administration Data</h2>

      {data.length > 0 && data.map((entry, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "30px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <p><strong>Name:</strong> {entry.name_of_research_principal}</p>
          <p><strong>Department:</strong> {entry.department}</p>
          <p><strong>Submission Date:</strong> {entry.date?.slice(0, 10)}</p>
          <p><strong>Title:</strong> {entry.title}</p>
          <p><strong>Review Requested:</strong> {entry.review_requested}</p>
          <p><strong>Protocol Number:</strong> {entry.protocol_number}</p>
          <p><strong>Version Number:</strong> {entry.version_number}</p>
          <p><strong>Email:</strong> {entry.email}</p>
          <p><strong>Dated:</strong> {entry.date_1}</p>
          <p><strong>Summary:</strong> {entry.summary}</p>

          <p><strong>Selected Elements:</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {Array.isArray(entry.selected_elements) && entry.selected_elements.length > 0 ? (
              entry.selected_elements.map((item, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#e0f2f1",
                    color: "#00796b",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {item}
                </span>
              ))
            ) : (
              <span style={{ fontStyle: "italic", color: "#777" }}>None</span>
            )}
          </div>

          <p><strong>Other Reason:</strong> {entry.other_reason}</p>
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
          }}
          onClick={handleEdit}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
