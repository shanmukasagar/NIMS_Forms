// src/components/TableComponent4.js
import React from "react";

const TableComponent4 = ({ data }) => {
  return (
    <div className="table-container">
      <h2 className="h2">Research data</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Summary</th>
            <th>Type of Study</th>
            <th>External Lab</th>
            <th>Lab Details</th>
            <th>Uploaded File</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.summary}</td>
              <td>{entry.type_of_study}</td>
              <td>{entry.external_laboratory}</td>
              <td>{entry.specify || "N/A"}</td>
              <td>
                {entry.image_url ? (
                   <img src={entry.image_url} alt="Uploaded" style={{ maxWidth: "100px", maxHeight: "100px" }} />
                ) : (
                  "No file"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
        <button style={{ padding: "8px 16px", fontSize: "14px", cursor: "pointer" , width : "150px"}}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default TableComponent4;
