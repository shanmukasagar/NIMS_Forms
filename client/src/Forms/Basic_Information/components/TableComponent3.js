import React from "react";


const TableComponent3 = ({ data, setOpenTable, setEditableData }) => {

  const handleEdit = () => {
    setOpenTable(false);
    setEditableData(data[0]);
  }

  return (
    <div className="table-container">
      <h2>Funding Details data</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Total Estimated Budget (₹)</th>
            <th>Funding Source</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.total_estimated_budget}</td>
              <td>{entry.funding_source}</td>
              <td>{entry.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
        <button style={{ padding: "8px 16px", fontSize: "14px", cursor: "pointer" , width : "150px"}} onClick = {handleEdit}>
          Edit
        </button>
      </div>
    </div>
  );
};
  

export default TableComponent3;
