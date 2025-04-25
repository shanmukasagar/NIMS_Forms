import React from "react";


const TableComponent3 = ({ data }) => {
  return (
<div>
      <h2>Funding Details data</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Total Estimated Budget (₹)</th>
            <th>Funding Source</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.total_estimated_budget}</td>
              <td>{entry.funding_source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
  

export default TableComponent3;
