import React from "react";

const TableComponent12 = ({ data }) => {
  return (
    <div className="table-container">
      <h2>Declaration data</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Selected Elements</th>
            <th>PI Name</th>
            <th>PI Date</th>
            <th>Co-PI Name</th>
            <th>Co-PI Date</th>
            <th>Co-Investigator 1</th>
            <th>Date 1</th>
            <th>Co-Investigator 2</th>
            <th>Date 2</th>
        
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>{row.selectedElements?.join(", ")}</td>
              <td>{row.name_of_pi_research}</td>
              <td>{row.date_pi}</td>
              <td>{row.name_of_co_pi_guide}</td>
              <td>{row.date_co_pi}</td>
              <td>{row.name_of_co_investigator_1}</td>
              <td>{row.date_co_inv_1}</td>
              <td>{row.name_of_co_investigator_2}</td>
              <td>{row.date_co_inv_2}</td>
           
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent12;
