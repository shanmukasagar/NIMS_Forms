import React from "react";

const ConsentDisplayComponent = ({ data, setOpenTable, setEditableData }) => {
  const handleEdit = () => {
    setOpenTable(false);
    setEditableData(data[0]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "24px" }}>Informed Consent Data</h2>

      {data.map((entry, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "30px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
          }}
        >
          <p><strong>Email:</strong> {entry.email}</p>
          <p><strong>Consent Waiver Type:</strong> {entry.seeking_waiver_of_consent_type || "—"}</p>
          <p><strong>Version Number:</strong> {entry.version_number || "—"}</p>
          <p><strong>Date:</strong> {entry.date?.slice(0, 10) || "—"}</p>
          <p><strong>Certificates:</strong> {entry.certificates || "—"}</p>
          <p><strong>Subject:</strong> {entry.subject || "—"}</p>
          <p><strong>Specify (Tool):</strong> {entry.specify || "—"}</p>
          <p><strong>Summary:</strong> {entry.summary || "—"}</p>

          <p><strong>Selected Languages:</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {entry.selectedlanguages?.length ? (
              entry.selectedlanguages.map((lang, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#e3f2fd",
                    color: "#1565c0",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {lang}
                </span>
              ))
            ) : (
              <span style={{ fontStyle: "italic", color: "#777" }}>None</span>
            )}
          </div>

          <p><strong>Other Language Name:</strong> {entry.otherlanguagename || "—"}</p>

          <p><strong>PIS Selected Items:</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {entry.pisselecteditems?.length ? (
              entry.pisselecteditems.map((item, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#fff3e0",
                    color: "#ef6c00",
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

          <p><strong>PIS Other Text:</strong> {entry.pisothertext || "—"}</p>

          <p><strong>Selected Elements:</strong></p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
            {entry.selected_elements?.length ? (
              entry.selected_elements.map((item, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: "#ede7f6",
                    color: "#6a1b9a",
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
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleEdit}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ConsentDisplayComponent;
