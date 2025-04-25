import React from "react";

const TableComponent8 = ({ data }) => {
  return (
    <div className="table-container">
  
      {data && data.length > 0 ? (
        data.map((entry, idx) => (
          <table key={idx} className="custom-table">
            <thead>
              <tr >
                <th className>Field</th>
                <th >Response</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-medium">Waiver of Consent</td>
                <td className="border px-4 py-2">{entry.waiver_consent_type || "N/A"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Waiver Details</td>
                <td className="border px-4 py-2">{entry.specify || "N/A"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Compensation for SAE</td>
                <td className="border px-4 py-2">{entry.compensation_research_of_type || "N/A"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-medium">Compensation Details</td>
                <td className="border px-4 py-2">{entry.specific || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        ))
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default TableComponent8;
