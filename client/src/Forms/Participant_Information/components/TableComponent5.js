import React from "react";

const TableComponent5 = ({ data }) => {
  return (
    <div className="table-container">
      <h3 className>Participant Information data</h3>
      <table className="custom-table">
        <thead className>
          <tr>
            <th className>Type of Participant</th>
            <th className>Specify (if Others)</th>
            <th className>Justification</th>
            <th className>Additional Safeguards</th>
            <th className>Payment</th>
            <th className>Reimbursement Details</th>
            <th className>Advertisement Used</th>
            <th className>Advertisement Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className>{entry.type_of_participants}</td>
              <td className>{entry.specifiy || "_"}</td>
              <td className>{entry.justification}</td>
              <td className>{entry.additional_safeguards}</td>
              <td className>{entry.payment_type}</td>
              <td className>{entry.reimbursement_details }</td>
              <td className>{entry.advertisement_type}</td>
              <td className>{entry.advertisement_details || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent5;
