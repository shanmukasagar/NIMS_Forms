import React from "react";


const TableComponent3 = ({ data }) => {
  return (
<div className="table-container">
      <h2>Funding Details data</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Total Estimated Budget (₹)</th>
            <th>Funding Source</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.total_estimated_budget}</td>
              <td>{entry.funding_source}</td>
              <td>{entry.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
  

export default TableComponent3;
