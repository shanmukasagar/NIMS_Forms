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
                  <a href={entry.image_url} target="_blank" rel="noopener noreferrer">View File</a>
                ) : (
                  "No file"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent4;
