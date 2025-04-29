import React from "react";

const TableComponent8 = ({ data }) => {
  return (
    <div className="table-container">
      <h2 className="hi">payment compensation data</h2>
      {data && data.length > 0 ? (
        data.map((entry, idx) => (
          <table key={idx} className="custom-table">
            <thead>
              <tr >
                <th>Waiver of Consent</th>
                <th >Waiver Details</th>
                <th>Compensation research</th>
                <th>compensationspecific</th>
                <th>email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                
                <td >{entry.waiver_consent_type || "N/A"}</td>
                <td >{entry.specify || "N/A"}</td>
                <td >{entry.compensation_research_of_type || "N/A"}</td>
                <td >{entry.specific || "N/A"}</td>
                <td >{entry.email || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        ))
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default TableComponent8;
