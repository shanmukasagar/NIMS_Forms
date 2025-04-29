import React from "react";

const TableComponent11 = ({ data }) => {
  return (
    <div className="table-container">
      <h3 className="hi">checklist data</h3>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Documents</th>
            <th>Enclosure No.</th>
            <th>Remarks</th>
        
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <>
              <tr key={`${index}-doc1`}>
                <td>Documents</td>
                <td>{entry.enclosure1}</td>
                <td>{entry.remarks1}</td>
             
              </tr>
              <tr key={`${index}-doc2`}>
                <td>Investigator</td>
                <td>{entry.enclosure2}</td>
                <td>{entry.remarks2}</td>
              </tr>
              <tr key={`${index}-doc3`}>
                <td>Clinic </td>
                <td>{entry.enclosure3}</td>
                <td>{entry.remarks3}</td>
              </tr>
              <tr key={`${index}-doc4`}>
                <td> Clearance</td>
                <td>{entry.enclosure4}</td>
                <td>{entry.remarks4}</td>
              </tr>
              <tr key={`${index}-doc5`}>
                <td> Partners</td>
                <td>{entry.enclosure5}</td>
                <td>{entry.remarks5}</td>
              </tr>
              <tr key={`${index}-doc6`}>
                <td> Protocol</td>
                <td>{entry.enclosure6}</td>
                <td>{entry.remarks6}</td>
              </tr>
              <tr key={`${index}-doc7`}>
                <td>Translated</td>
                <td>{entry.enclosure7}</td>
                <td>{entry.remarks7}</td>
              </tr>
              <tr key={`${index}-doc8`}>
                <td>Minors</td>
                <td>{entry.enclosure8}</td>
                <td>{entry.remarks8}</td>
              </tr>
              <tr key={`${index}-doc9`}>
                <td>Proforma </td>
                <td>{entry.enclosure10}</td>
                <td>{entry.remarks10}</td>
              </tr>
              <tr key={`${index}-doc10`}>
                <td>Advertisement </td>
                <td>{entry.enclosure11}</td>
                <td>{entry.remarks11}</td>
              </tr>
              <tr key={`${index}-doc11`}>
                <td>Insurance</td>
                <td>{entry.enclosure12}</td>
                <td>{entry.remarks12}</td>
               
              </tr>
<tr>
                <td>email</td>
               
                 <td>{entry.email}</td></tr>
              {/* <tr key={`${index}-doc11`}>
                <td>email</td>
                <td>{entry.email}</td>
               
              </tr> */}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent11;
