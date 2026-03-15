const PDFDocument = require("pdfkit");
const { getCollection } = require("../../models/db");

const downloadPBACApproval = async (req, res) => {
  try {
    let projectRef = req.params.projectRef;
    projectRef = projectRef.replace(/"/g, "").trim();

    const projectsCollection = getCollection("Projects");

    const project = await projectsCollection.findOne({
      project_ref: projectRef,
      pbac_status: "approved"
    });

    if (!project) {
      return res.status(400).json({
        message: "PBAC approval not completed"
      });
    }

  const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=PBAC_Approval_${projectRef}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);
  doc.image("assets/2028102.jpg", 50, 45, { width: 60 });5
    // ================= HEADER =================
        doc.fontSize(14).text("NIZAM'S INSTITUTE OF MEDICAL SCIENCES", { align: "center" });
    doc.fontSize(10).text("(A University Established under State Act)", { align: "center" });
    doc.text("Panjagutta, Hyderabad - 500082, Telangana", { align: "center" });
    doc.text("Fax: 040-23310076", { align: "center" });

   

    doc.moveDown(2);
    doc
      .fontSize(12)
      .text("PROJECT & BUDGET APPROVAL COMMITTEE (FACULTY)", {
        align: "center",
         underline: true
      });

    doc.moveDown(1.5);

    // PBAC Number & Date
    doc
      .font("Helvetica")
      .fontSize(11)
      .text(`PBAC No: ${project.form_number || "-"}`, { align: "left" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`
    , { align: "right" });

    doc.moveDown(1.5);

    // ================= BODY =================
    doc.fontSize(11).text(
      `The Project & Budget Approval Committee (Faculty) in its meeting held on ${new Date().toLocaleDateString()} has reviewed the research proposal submitted by ${project.investigator_name || "Investigator"}, ${project.investigator_dep || "Department"}.`
    );

    doc.moveDown();

    doc.text(
      `After detailed review and discussion, the committee has resolved the following:`
    );

    doc.moveDown(1.5);

    // Project Title
  doc.font("Helvetica-Bold")
   .text(
      `Title of the Project: ${project.project_title || "Project Title"}`,
     
   );
    doc.moveDown(4);


    // Resolution
    const resolution =
      project.pbac_status?.toLowerCase() === "approved"
        ? "APPROVED"
        : "REJECTED";
          doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`Sponsor-MRU`, { align: "center" });

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(`RESOLUTION: ${resolution}`, { align: "center" });

    doc.moveDown(3);

    // ================= SIGNATURE SECTION =================
    doc.font("Helvetica");
    doc.text("Member Secretary / Chairman");
    doc.moveDown(0.5);
    doc.text(project.pbac_reviewer_name || "PBAC Chairman");
    doc.text(`Employee ID: ${project.pbac_reviewer_id || "-"}`);
    doc.text("Project & Budget Approval Committee (Faculty)");

    doc.moveDown(2);

    // ================= COPY TO =================
    doc.text("To,");
    doc.text(project.investigator_name || "Applicant");
    doc.text(project.investigator_dep || "Department");
    doc.text("NIMS");

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating PBAC PDF" });
  }
};

module.exports = { downloadPBACApproval };