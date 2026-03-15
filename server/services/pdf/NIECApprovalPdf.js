
const PDFDocument = require("pdfkit");
const { connectToMongo, getCollection, getAdminUploadBucket } = require("../../models/db");

const downloadApprovalPdfService = async (req, res) => {
  try {
    const projectRef = req.params.projectRef;

    await connectToMongo();

    const projectsCollection = getCollection("Projects");
    const uploadBucket = getAdminUploadBucket();

    const project = await projectsCollection.findOne({
      project_ref: projectRef
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const absentees = project?.niec_absentees || [];

    const uploadedFiles = await uploadBucket.find({
      "metadata.project_ref": projectRef
    }).toArray();

    const today = new Date().toLocaleDateString("en-GB");

    /* RESPONSE HEADERS */
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=NIEC_${projectRef}.pdf`
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

      doc.image("assets/2028102.jpg", 50, 45, { width: 60 });
    /* HEADER */

    doc.fontSize(14).text("NIZAM'S INSTITUTE OF MEDICAL SCIENCES", { align: "center" });
    doc.fontSize(10).text("(A University Established under State Act)", { align: "center" });
    doc.text("Panjagutta, Hyderabad - 500082, Telangana", { align: "center" });
    doc.text("Fax: 040-23310076", { align: "center" });

    doc.moveDown();
    doc.fontSize(12).text("NIMS INSTITUTIONAL ETHICS COMMITTEE", {
      align: "center",
      underline: true
    });

    doc.moveDown(2);

    /* BODY */

    doc.fontSize(11)
      .text(`Review Letter No: EC/NIMS/${projectRef}`)
      .text(`Date: ${today}`);

    doc.moveDown();

// TO BLOCK
doc.fontSize(11).text("To");
doc.moveDown(0.5);

doc.text(project.investigator_name || "");
doc.text(project.pi_designation || "");
doc.text(project.investigator_dep || "");
doc.text(`NIMS`)
    doc.text(
      `The NIMS Institutional Ethics Committee (NIEC), Hyderabad, reviewed the project titled "${project.project_title}" with reference number in its meeting held on ${today}.`
    );

    doc.moveDown(2);

  doc.fontSize(12).text("Members Present:", { underline: true });
doc.moveDown(1);

const startX = 50;
const tableWidth = 500;
const col1Width = 50;
const col2Width = 250;
const col3Width = 200;

let y = doc.y;

// Members data
const members = [
  ["1", "Dr. B. Sesikeran, Former Director, NIN", "Chairperson"],
  ["2", "Prof. N. Purendra Prasad, Dept. of Sociology", "Vice-chairperson & Social Scientist"],
  ["3", "Dr. P.V. Chalam, Principal, Bhaskar Medical College", "Member & Surgeon"],
  ["4", "Dr. Vijay Kumar Kutala, Prof. of CP & T", "Member Secretary & Basic Medical Scientist"],
  ["5", "Dr. M. Padmaja, Assoc. Prof. of CP & T", "Member & Basic Medical Scientist"],
  ["6", "Dr. M. Noorjahan, Professor, Dept. of Biochemistry", "Scientific Member"],
  ["7", "Mrs. Uma Aysola", "Member & Lay Person"],
  ["8", "Mrs. Jyothi S. Cherukupalli", "Member & Social Scientist"],
  ["9", "Mrs. Vaishnavi Vasireddy, Advocate", "Member & Legal Person"],
  ["10", "Dr. M. Srilata, Prof. of Anaesthesiology", "Member & Clinician"],
  ["11", "Dr. T. Chiranjeevi", "Member & Lay Person"],
  ["12", "Dr.Swarnalatha", "Member & Clinican"],
];

// HEADER HEIGHT
const headerHeight = 30;

// Draw Header Box
doc.rect(startX, y, tableWidth, headerHeight).stroke();

// Vertical lines for header
doc.moveTo(startX + col1Width, y)
   .lineTo(startX + col1Width, y + headerHeight).stroke();

doc.moveTo(startX + col1Width + col2Width, y)
   .lineTo(startX + col1Width + col2Width, y + headerHeight).stroke();

// Header Text
doc.fontSize(11);
doc.text("S.No", startX + 5, y + 8);
doc.text("Name of the IEC Members", startX + col1Width + 5, y + 8);
doc.text("Designation", startX + col1Width + col2Width + 5, y + 8);

y += headerHeight;

// ROWS (Dynamic Height)
members.forEach((row) => {

  const nameHeight = doc.heightOfString(row[1], {
    width: col2Width - 10
  });

  const desigHeight = doc.heightOfString(row[2], {
    width: col3Width - 10
  });

  const rowHeight = Math.max(nameHeight, desigHeight) + 16;

  // Draw row border
  doc.rect(startX, y, tableWidth, rowHeight).stroke();

  // Vertical lines
  doc.moveTo(startX + col1Width, y)
     .lineTo(startX + col1Width, y + rowHeight).stroke();

  doc.moveTo(startX + col1Width + col2Width, y)
     .lineTo(startX + col1Width + col2Width, y + rowHeight).stroke();

  // Text
  doc.text(row[0], startX + 5, y + 8);
  doc.text(row[1], startX + col1Width + 5, y + 8, {
    width: col2Width - 10
  });
  doc.text(row[2], startX + col1Width + col2Width + 5, y + 8, {
    width: col3Width - 10
  });

  y += rowHeight;
});

doc.moveDown(2);


    /* SECOND PAGE */
/* SECOND PAGE */
doc.addPage(1);

    /* LEAVE OF ABSENCE */

    doc.fontSize(12).text("Leave of Absence:", { underline: true });
    doc.moveDown();

    if (absentees.length === 0) {
      doc.text("None");
    } else {
      absentees.forEach((name, index) => {
        doc.text(`${index + 1}. ${name}`);
      });
    }
    doc.moveDown(3);
doc.fontSize(12)
  .text("Documents Reviewed:", { underline: true });

doc.moveDown(1);

if (uploadedFiles.length === 0) {
  doc.fontSize(11).text("No documents uploaded.");
} else {
  uploadedFiles.forEach((file, index) => {
    doc.fontSize(11).text(`${index + 1}. ${file.filename}`);
  });
}

doc.moveDown(2);

/* APPROVAL PARAGRAPH */

doc.fontSize(11).text(
  `The Committee Members reviewed the Retention Letter – JUMO Material and approved the above listed documents.`
);

doc.moveDown();

doc.text(
  `After due consideration, the committee has approved the project titled "${project.project_title}" with reference number ${projectRef}.`
);

doc.moveDown();

doc.text(
  "The present approval is valid for a period of one year from the date of approval. The investigator must take re-approval after one year if the study is not initiated."
);

doc.moveDown();

doc.text(
  "The investigator is requested to submit the progress report every 6 months after initiation to NIEC for review. Any change, modification, or deviation in the protocol, or any serious adverse event must be informed to the Ethics Committee."
);

doc.moveDown();

doc.text(
  "Any protocol modification or amendment must receive IEC approval prior to implementation. The investigator should conduct the study as per the recommended Good Clinical Practice (GCP) guidelines."
);

doc.moveDown();

doc.text(
  "It is also confirmed that our Ethics Committee is constituted and functions as per Good Clinical Practice guidelines issued by the Central Drugs Standard Control Organization and Ethical Guidelines for Biomedical Research on Human Subjects issued by the Indian Council of Medical Research."
);

doc.moveDown(4);


    doc.text(`Dr.${project.niec_reviewer_name || "-"}` , { align: "right" });
    doc.text("Member Secretary (NIEC)", { align: "right" });

    doc.end();

  } catch (error) {
    console.error("PDF ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { downloadApprovalPdfService };