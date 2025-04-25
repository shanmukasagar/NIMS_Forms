
import React from "react";

const TableComponent9 = ({ data }) => {
    return (
        <div className="table-container">
          <h2>Storage and Confidentiality</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Sample Access</th>
            <th>Sample Details</th>
            <th>Document Access</th>
            <th>Control Details</th>
            <th>Drugs Access</th>
            <th>Access Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.sample_access_type}</td>
              <td>{row.sample_details}</td>
              <td>{row.document_access_type}</td>
              <td>{row.control_details}</td>
              <td>{row.drugs_access_type}</td>
              <td>{row.access_details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  };
  export default TableComponent9;