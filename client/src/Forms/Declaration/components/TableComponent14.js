import React from "react";

const TableComponent14 = ({ data }) => {
  return (
    <div className="table-container">
      <h2>Waiverof consent data</h2>
      <table className="custom-table">
        <thead>
          <tr>
            
            <th>PI Name</th>
            <th>Department</th>
            <th>Title</th>
            <th>Summary</th>
            <th>Co-Investigator 1</th>
            <th>Date</th>
            <th>email</th>
          
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
            
              <td>{row.principal_investigator_name}</td>
              <td>{row.department}</td>
              <td>{row.title}</td>
              <td>{row.summary}</td>
              <td>{row.name_of_co_investigator_1}</td>
              <td>{row.date}</td>
              <td>{row.email}</td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent14;
