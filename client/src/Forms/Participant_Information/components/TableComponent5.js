import React from "react";

const TableComponent5 = ({ data }) => {
  return (
    <div className="table-container">
      <h3 className>Participant Information data</h3>
      <table className="custom-table">
        <thead >
          <tr>
            <th >Type of Participant</th>
            <th >Specify (if Others)</th>
            <th >Justification</th>
            <th >Additional Safeguards</th>
            <th>Payment</th>
            <th >Reimbursement Details</th>
            <th >Advertisement Used</th>
            <th >Advertisement Details</th>
            <th>email</th>

          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td >{entry.type_of_participants}</td>
              <td >{entry.specifiy || "_"}</td>
              <td >{entry.justification}</td>
              <td >{entry.additional_safeguards}</td>
              <td >{entry.payment_type}</td>
              <td >{entry.reimbursement_details }</td>
              <td >{entry.advertisement_type}</td>
              <td >{entry.advertisement_details || "—"}</td>
              <td>{entry.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent5;
