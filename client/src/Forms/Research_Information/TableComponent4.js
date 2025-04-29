// src/components/TableComponent4.js
import React from "react";

const TableComponent4 = ({ data }) => {
  return (
    <div className="table-container">
      <h2 className="h2">Overview Research Data</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Summary</th>
            <th>Type of Study</th>
            <th>External Lab</th>
            <th>Lab Details</th>
            <th>email</th>
        
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.summary}</td>
              <td>{entry.type_of_study}</td>
              <td>{entry.external_laboratory}</td>
              <td>{entry.specify || "N/A"}</td>
              <td>{entry.email}</td>
            
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent4;
