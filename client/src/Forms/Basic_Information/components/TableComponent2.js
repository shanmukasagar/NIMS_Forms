import React from "react";

const TableComponent2 = ({ data }) => {
  return (
    <div className="table-container">
      <h3 className="h2">Investigator Details</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Qualification</th>
            <th>Department</th>
            <th>Institution</th>
            <th>Address</th>
            <th>Investigator Type</th>            
            <th>Email</th>
            <th>contact</th>
            <th>Gmail</th>
            
          </tr>
        </thead>
        <tbody>
          {data.map((investigator, index) => (
            <tr key={index}>
              
              <td>{investigator.name}</td>
              <td>{investigator.designation}</td>
              <td>{investigator.qualification}</td>
              <td>{investigator.department}</td>
              <td>{investigator.institution}</td>
              <td>{investigator.address}</td>
              <td>{investigator.investigator_type}</td>
              <td>{investigator.email}</td>
              <td>{investigator.contact}</td>
              <td>{investigator.gmail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent2;
