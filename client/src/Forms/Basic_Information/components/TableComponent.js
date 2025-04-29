
import React from "react";

const TableComponent = ({ data }) => {
  return (
    <div className="table-container">
      <h2 >Administration data</h2>
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
            <th>email</th>
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
              <td>{entry.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;