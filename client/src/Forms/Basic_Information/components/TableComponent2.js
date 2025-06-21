import React from "react";

const styles = {
  fieldRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "0.5rem",
    fontSize: "16px",
    lineHeight: 1.5,
  },
  fieldValue: {
    color: "#333",
  }
};


const renderField = (label, value) => (
  <div style={styles.fieldRow}>
    <strong>{label}:</strong>
    <span style={styles.fieldValue}>{value || "-"}</span>
  </div>
);


const InvestigatorCard = ({ title, investigator }) => (
  <div className="investigator-card">
    <h4>{title}</h4>
    {renderField("Name", investigator.name)}
    {renderField("Designation", investigator.designation)}
    {renderField("Qualification", investigator.qualification)}
    {renderField("Department", investigator.department)}
    {renderField("Email", investigator.gmail)}
    {renderField("Contact", investigator.contact)}
  </div>
);

const TableComponent2 = ({ data, setOpenTable, setEditableData }) => {

  const handleEdit = () => {
    setOpenTable(false);
    setEditableData(data);
  }

  const principal = data.find((inv) => inv.investigator_type === "Principal_Investigator");
  const guide = data.find((inv) => inv.investigator_type === "Guide");
  const coInvestigators = data.filter((inv) => inv.investigator_type === "Co-investigator");

  return (
    <div className="investigator-details">
      <h3 className="h2">Investigator Details</h3>

      {principal && <InvestigatorCard title="Principal Investigator" investigator={principal} />}
      {guide && <InvestigatorCard title="Guide" investigator={guide} />}
      {coInvestigators.length > 0 && (
        <>
          {coInvestigators.map((co, index) => (
            <InvestigatorCard
              key={index}
              title={`Co-Investigator ${index + 1}`}
              investigator={co}
            />
          ))}
        </>
      )}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
        <button style={{ padding: "8px 16px", fontSize: "14px", cursor: "pointer" , width : "150px"}} onClick = {handleEdit}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default TableComponent2;
