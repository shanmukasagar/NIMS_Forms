// TableComponent.js
import React from "react";

import "../../App.css";


const TableComponent2 = ({ data }) => {
  return (
    <div>
      <h2>Submitted Investigator Details</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Role</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Qualification</th>
            <th>Department</th>
            <th>Institution</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>Principal Investigator</td>
                <td>{item.pi_name}</td>
                <td>{item.pi_designation}</td>
                <td>{item.pi_qualification}</td>
                <td>{item.pi_department}</td>
                <td>{item.pi_institution}</td>
                <td>{item.pi_address}</td>
              </tr>
              <tr>
                <td>Co-investigator / Guide</td>
                <td>{item.coi_name}</td>
                <td>{item.coi_designation}</td>
                <td>{item.coi_qualification}</td>
                <td>{item.coi_department}</td>
                <td>{item.coi_institution}</td>
                <td>{item.coi_address}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent2;
