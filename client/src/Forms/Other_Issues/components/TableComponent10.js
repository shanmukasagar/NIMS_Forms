
import React from "react";

const TableComponent10 = ({ data }) => {
  return (
    <div className="table-container">
      <h2 className="h2 mb-4">Additional Information data</h2>
      <table className="custom-table">
        <thead className="bg-gray-100">
          <tr>
           
            <th>Support Type</th>
            <th >Details</th>
            <th>email</th>
        
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || index}>
            
              <td >{item.support_type}</td>
              <td >{item.additional}</td>
              <td>{item.email}</td>
         
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent10;
