import React from "react";


const TableComponent6 = ({ data }) => {
  return (
    <div className="table-container">
      <h3 className="hi">Benefits and Risks data</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Anticipated Risk</th>
            <th>Reimbursement Details</th>
            <th>Risk Management Strategy</th>
            <th>Participant Benefits</th>
            <th>Society Benefits</th>
            <th>Scientific Benefits</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.anticipated_type}</td>
              <td>{entry.reimbursement_details || "N/A"}</td>
              <td>{entry.management_strategy}</td>
              <td>{entry.participant_benefits}</td>
              <td>{entry.society_benefits}</td>
              <td>{entry.improvement_benefits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent6;
