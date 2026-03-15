const PDFDocument = require("pdfkit");

const { getCollection } = require("../../models/db");
const downloadApproval = async (req, res) => {

try {
  let projectRef = req.params.projectRef;
  projectRef = projectRef.replace(/"/g, "").trim();

  const projectsCollection = getCollection("Projects");

const approval = await projectsCollection.findOne({

    project_ref: projectRef,
   status: "approved"
});
  console.log("Found Document:", approval);

  if (!approval) {
    return res.status(400).json({
      message: "isrc approval not found"
    });
  }
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ISRC_Approval_${projectRef}.pdf`
    );

    doc.pipe(res);

    doc.image("assets/2028102.jpg", 50, 45, { width: 60 });

    /* ================= HEADER ================= */

    doc
      .fontSize(16)
      .text("NIZAM'S INSTITUTE OF MEDICAL SCIENCES", {
        align: "center",
      });

    doc
      .fontSize(11)
      .text("(A University established under State Act)", {
        align: "center",
      });

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .text(
        "Panjagutta, Hyderabad - 500082, Telangana\nPhone: 040-23489000 | www.nims.edu.in",
        { align: "center" }
      );

    doc.moveDown(1.5);

    /* ================= TITLE ================= */

    doc
      .fontSize(14)
      .text("INSTITUTIONAL SCIENTIFIC RESEARCH COMMITTEE (ISRC)", {
        align: "center",
        underline: true,
      });

    doc.moveDown(1.5);

    /* ================= FILE INFO ================= */

    // const today = new Date().toLocaleDateString();
const today = new Date().toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});
    doc
      .fontSize(11)
      .text(`File No: NIMS/ISRC/${projectRef}`)
      .text(`Date: ${today}`, { align: "right" });

    doc.moveDown(5);

    /* ================= BODY ================= */

    doc
      .fontSize(12)
      .text(
        `NIMS Institutional Scientific Research Committee(ISRC) Hyderabad in its meeting held on ${today} has reviewed the research project titled "${approval.project_title}".`,
        { align: "justify" }
      );

    doc.moveDown(1);
    
      doc.text(
      `After Consideration,the institutional Scientific Research Committee Has approved the project "${approval.project_title}".`,
      { align: "justify" }
    );

    doc.moveDown(1);

 

      doc.text(
      `It is also confirmed that our Institutional Scientific Research Committee (ISRC) is constituted and functions as per the guidelines of the National Board of Examinations.`,
      { align: "justify" }
    );

    doc.moveDown(5);
    /* ================= SIGNATURE SECTION ================= */

  
    doc.text("Member Secretary", { align: "right" });
    doc.text(`Dr. ${approval.reviewer_name}`, { align: "right" });
    doc.text(`(Reviewer ID: ${approval.reviewer_id})`, { align: "right" });
    doc.text("Institutional Scientific Review Committee (ISRC-NIMS)", {
      align: "right",
    });

    doc.moveDown(0.5);

  
    doc.end();
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({
      message: "Failed to generate approval letter",
    });
  }
};

module.exports = { downloadApproval };

