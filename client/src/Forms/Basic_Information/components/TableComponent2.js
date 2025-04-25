import React from "react";

const TableComponent2 = ({ data }) => {
  return (
    <div className="table-container">
       <h2>Details of Investigator data</h2>
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
         
        
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              <td>{row.designation}</td>
              <td>{row.qualification}</td>
              <td>{row.department}</td>
              <td>{row.institution}</td>
              <td>{row.address}</td>
              <td>{row.investigator_type}</td>
            
           
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent2;
