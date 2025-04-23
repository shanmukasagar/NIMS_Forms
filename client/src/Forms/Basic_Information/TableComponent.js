// TableComponent.js
import React from "react";

import "../../App.css";


const TableComponent = ({ data }) => {
  return (
    <div className="table-container">
      <h2 className="section-heading">Submitted Section Data</h2>
      <table className="custom-table">
        <thead>
          <tr>
           
            <th>Name</th>
            <th>Department</th>
            <th>Date</th>
            <th>Title</th>
            <th>Review</th>
            <th>Protocol No</th>
            <th>Version No</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx}>
             
              <td>{entry.name_of_research_principal}</td>
              <td>{entry.department}</td>
              <td>{entry.date?.slice(0, 10)}</td>
              <td>{entry.title}</td>
              <td>{entry.review_requested}</td>
              <td>{entry.protocol_number}</td>
              <td>{entry.version_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
