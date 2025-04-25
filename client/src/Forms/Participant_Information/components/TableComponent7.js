import React from "react";

const TableComponent7 = ({ data }) => {
  return (
    <div className="table-container">
      <h2>Informed Consent Data</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Selected Elements</th>
            <th>Consent Waiver</th>
            <th>Languages</th>
            {/* <th>Date</th> */}
            <th>Version 1</th>
            <th>Date 1</th>
            <th>Version 2</th>
            <th>Date 2</th>
            <th>Version 3</th>
            <th>Date 3</th>
            <th>Certificates</th>
            <th>Subject</th>
            <th>Specify</th>
          </tr>
        </thead>
        <tbody>  
      
          {data.map((row, i) => (
            <tr key={i}>
              
              <td>{row.selectedElements?.join(", ")}</td>
              <td>{row.seeking_waiver_of_consent_type}</td>
              <td>{row.languages}</td>
              {/* <td>{row.date}</td> */}
              <td>{row.version_1}</td>
              <td>{row.date_1}</td>
              <td>{row.version_2}</td>
              <td>{row.date_2}</td>
              <td>{row.version_3}</td>
              <td>{row.date_3}</td>
              <td>{row.certificates}</td>
              <td>{row.subject}</td>
              <td>{row.specify}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent7;
