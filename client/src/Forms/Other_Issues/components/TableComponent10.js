
import React from "react";

const TableComponent10 = ({ data }) => {
  return (
    <div className="table-container">
      <h2 className="h2 mb-4">Additional Information data</h2>
      <table className="custom-table">
        <thead className="bg-gray-100">
          <tr>
           
            <th className="border border-gray-300 px-4 py-2">Support Type</th>
            <th className="border border-gray-300 px-4 py-2">Details</th>
        
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || index}>
            
              <td className="border border-gray-300 px-4 py-2">{item.support_type}</td>
              <td className="border border-gray-300 px-4 py-2">{item.additional}</td>
         
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent10;
