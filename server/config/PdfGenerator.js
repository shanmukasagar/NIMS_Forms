const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const {connectToMongo, getDB} = require("../models/db");

async function generateConsentPdf(data, fileName, project_ref) {
  const outputPath = path.join(__dirname, '../media/clinical/projects', `${fileName}.pdf`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const checkboxLabels = [
    "I/We certify that the information provided in this application is complete and correct.",
    "I/We confirm that all investigators have approved the submitted version of proposal / related documents.",
    "I/We confirm that this study will be conducted in accordance with the latest NDCT RULES, ICMR National Ethical Guidelines for Biomedical and Health Research involving Human Participants and other applicable regulatory guidelines.",
    "I/We will comply with all policies and guidelines of the institute and affiliated / collaborating institutions wherever applicable.",
    "I/We will ensure that personnel performing this study are qualified, appropriately trained and will adhere to the provisions of the EC approved protocol.",
    "I/We declare that the expenditure in case of injury related to the study will be taken care of.",
    "I/We agree to inform all trial subject, that the drugs are being used for investigational purposes.",
    "I/we ensure that the requirements relating to obtaining informed consent and ethics committee review and approval specified in the New Drugs and Clinical Trials Rules, 2019 and Good Clinical Practices guidelines are met.",
    "I/We confirm that we shall submit any protocol amendments, serious adverse events report, significant deviations from protocols, regular progress reports and a final report and also participate in any audit of the study if needed.",
    "I/We confirm that we will maintain accurate and complete records of all aspects of the study.",
    "I/We will protect the privacy of participants and assure safety and confidentiality of study data and biological samples.",
    "I/We hereby declare that I / any of the investigators, researchers and / or close relative(s), have no conflict of interest (Financial / Non-Financial) with the sponsor(s) and outcome of study.",
    "If Conflict of interest is present, kindly declare and specify details",
    "I/We declare / confirm that all necessary regulatory approvals will be obtained as per requirements wherever applicable.",
  ];

  const selectedDeclarations = Object.entries(data.declaration.declarations)
    .filter(([_, value]) => value === true)
    .map(([key], index) => checkboxLabels[parseInt(key.split('_')[1])]);

  const templateData = { ...data, selectedDeclarations,  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Clinical Research Submission</title>
        <style>
          @page {
            margin: 40px 30px;
          }

          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 30px;
            margin-top: 40px;
            margin-bottom: 40px;
            color: #333;
            background: #f9f9f9;
            line-height: 1.6;
          }

          h1 {
            text-align: center;
            color: #0066cc;
            margin-bottom: 30px;
            border-bottom: 2px solid #0066cc;
            padding-bottom: 10px;
          }

          h2 {
            background-color: #f0f0f0;
            padding: 10px;
            border-left: 5px solid #0066cc;
            color: #003366;
            margin-top: 30px;
          }

          .section {
            background: #fff;
            padding: 15px 20px;
            margin-bottom: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 5px 0;
          }

          .label {
            font-weight: bold;
            display: inline-block;
            width: 200px;
            color: #222;
          }

          a {
            color: #0066cc;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          .investigations{
            display : flex;
            gap : 30px;
          }
        </style>

      </head>
      <body>
        <h1>Clinical Research Submission</h1>

        <div style="font-size: 18px; font-family: Arial, sans-serif; color: #333;">
          <span>Last Modified:</span>
            <span>${new Date().toLocaleString()}</span>
        </div>

        <h2>1. Administration</h2>
        <div class="section">
          <div><span class="label">Name:</span> ${data.administration.name}</div>
          <div><span class="label">Department:</span> ${data.administration.department}</div>
          <div><span class="label">Submission Date:</span> ${new Date(data.administration.submission_date).toLocaleDateString()}</div>
          <div><span class="label">Review Type:</span> ${data.administration.review_type}</div>
          <div><span class="label">Study Title:</span> ${data.administration.study_title}</div>
          <div><span class="label">Short Title:</span> ${data.administration.short_title}</div>
          <div><span class="label">Protocol:</span> ${data.administration.protocol}</div>
          <div><span class="label">Version:</span> ${data.administration.version}</div>
          <div><span class="label">Date:</span> ${data.administration.date}</div>
        </div>

        <h2>2. Investigators</h2>
        ${data.researchers.map(res => res.name ? `
        <div class="section">
          <div><span class="label">Type:</span> ${res.type || res.role}</div>
          <div><span class="label">Name:</span> ${res.name}</div>
          <div><span class="label">Designation:</span> ${res.designation}</div>
          <div><span class="label">Qualification:</span> ${res.qualification}</div>
          <div><span class="label">Department:</span> ${res.department}</div>
          <div><span class="label">Email:</span> ${res.gmail}</div>
          <div><span class="label">Contact:</span> ${res.contact}</div>
        </div>` : '').join('')}

        <h2>3. Investigators Count</h2>
        <div class="section">
          <div><span class="label">PI Count:</span> ${data.investigatorsCount.pi_count}</div>
          <div><span class="label">Co-PI Count:</span> ${data.investigatorsCount.co_pi_count}</div>
          <div><span class="label">Duration:</span> ${data.investigatorsCount.duration}</div>
        </div>

        <h2>4. Funding Details</h2>
        <div class="section">
          <div><span class="label">Estimated Budget:</span> ${data.fundingData.estimated_budget}</div>
          <div><span class="label">Funding Source:</span> ${data.fundingData.funding_source}</div>
          ${ data.fundingData.funding_source === "Others" && (
            `<div><span class="label">Other Details:</span> ${data.fundingData.other_funding_details}</div>`
          )}

          ${data.fundingData.funding_source === "Self-funding" && data.funding_FormData ? `
            <div><strong>Proposed Budget:</strong> ₹ ${data.funding_FormData.proposedBudget}</div>
            <div><strong>Cost Per Patient:</strong> ₹ ${data.funding_FormData.costPerPatient}</div>
            <div><strong>Total Project Cost:</strong> ₹ ${data.funding_FormData.totalProjectCost}</div>
            <div><strong>NIMS Investigations:</strong>
              <ul>
                ${data.funding_FormData.nimsInvestigations?.map(item => `
                  <li>
                    <div><strong>Name:</strong> ${item.name}</div>
                    <div><strong>Cost:</strong> ${item.cost}</div>
                  </li>`).join("")}
              </ul>
            </div>
            <div><strong>Is Outsourced:</strong> ${data.funding_FormData.isOutsourced ? "Yes" : "No"}</div>
            <div><strong>Outsourced Investigations:</strong>
              <ul>
                ${data.funding_FormData.outsourcedInvestigations?.map(item => `
                  <li>
                    <div><strong>Name:</strong> ${item.name}</div>
                    <div><strong>Cost:</strong> ${item.cost}</div>
                    <div><strong>Lab:</strong> ${item.lab}</div>
                    <div><strong>NABL:</strong> ${item.nabl}</div>
                  </li>`).join("")}
              </ul>
            </div>
                      ` : ""}

            ${["Institutional funding", "Funding agency"].includes(data.fundingData.funding_source) && data.funding_FormData ? `
              <div><strong>Funding Agency:</strong> ${data.funding_FormData.fundingAgency}</div>
              <div><strong>Grant Per Patient:</strong> ₹${data.funding_FormData.grantPerPatient}</div>
              <div><strong>Manpower Grant:</strong> ₹${data.funding_FormData.manpowerGrant}</div>
              <div><strong>Total Grant:</strong> ₹${data.funding_FormData.totalGrant}</div>
              <div><strong>NIMS Investigations:</strong>
                <ul>
                  ${data.funding_FormData.nimsInvestigations?.map(item => `
                    <li>
                      <div><strong>Name:</strong> ${item.name}</div>
                      <div><strong>Cost:</strong> ${item.cost}</div>
                    </li>`).join("")}
                </ul>
              </div>
              <div><strong>Is Outsourced:</strong> ${data.funding_FormData.isOutsourced ? "Yes" : "No"}</div>
              <div><strong>Outsourced Investigations:</strong>
                <ul>
                  ${data.funding_FormData.outsourcedInvestigations?.map(item => `
                    <li>
                      <div><strong>Name:</strong> ${item.name}</div>
                      <div><strong>Cost:</strong> ${item.cost}</div>
                      <div><strong>Lab:</strong> ${item.lab}</div>
                      <div><strong>NABL:</strong> ${item.nabl}</div>
                    </li>`).join("")}
                </ul>
              </div>
            ` : ""}

            ${data.fundingData.funding_source === "Pharmaceutical Industry sponsored" && data.funding_FormData ? `
              <div><strong>Sponsor Name:</strong> ${data.funding_FormData.sponsorName}</div>
              <div><strong>Sponsor PAN:</strong> ${data.funding_FormData.sponsorPAN}</div>
              <div><strong>Sponsor GST:</strong> ${data.funding_FormData.sponsorGST}</div>
              <div><strong>Total Grant:</strong> ₹ ${data.funding_FormData.totalGrant}</div>
              <div><strong>Budget Items:</strong>
                <ul>
                  ${data.funding_FormData.budgetItems?.map(item => `
                    <li>
                      <div><strong>${item.label}:</strong> ${item.value}</div>
                    </li>`).join("")}
                </ul>
              </div>
              <div><strong>NIMS Investigations:</strong>
                <ul>
                  ${data.funding_FormData.nimsInvestigations?.map(item => `
                    <li>
                      <div><strong>Name:</strong> ${item.name}</div>
                      <div><strong>Cost:</strong> ${item.cost}</div>
                    </li>`).join("")}
                </ul>
              </div>
              <div><strong>Personnel:</strong>
                <ul>
                  ${data.funding_FormData.personnel?.map(item => `
                    <li>
                      <div><strong>Designation:</strong> ${item.designation}</div>
                      <div><strong>Fees:</strong> ${item.fees}</div>
                    </li>`).join("")}
                </ul>
              </div>
              <div><strong>Is Outsourced:</strong> ${data.funding_FormData.isOutsourced ? "Yes" : "No"}</div>
              <div><strong>Outsourced Investigations:</strong>
                <ul>
                  ${data.funding_FormData.outsourcedInvestigations?.map(item => `
                    <li>
                      <div><strong>Name:</strong> ${item.name}</div>
                      <div><strong>Lab:</strong> ${item.lab}</div>
                      <div><strong>NABL:</strong> ${item.nabl}</div>
                    </li>`).join("")}
                </ul>
              </div>
            ` : ""}
        </div>

        <h2>5. Overview Research</h2>
        <div class="section">
          <div><span class="label">Summary:</span> ${data.overviewResearch.overview_summary}</div>
          <div><span class="label">Study Type:</span> ${data.overviewResearch.study_type}</div>
          <div><span class="label">Other Type:</span> ${data.overviewResearch.other_study_type}</div>
        </div>

        <h2>6. Methodology</h2>
        <div class="section">
          <div><span class="label">Sample Size:</span> ${data.methodologyData.total_sample_size}</div>
          <div><span class="label">Participants per Site:</span> ${data.methodologyData.site_participants}</div>
          <div><span class="label">Lab Outsourcing:</span> ${data.methodologyData.lab_outsourcing}</div>
          <div><span class="label">Lab Details:</span> ${data.methodologyData.lab_details}</div>
        </div>

        <h2>7. Participants</h2>
        <div class="section">
          <div><span class="label">Type:</span> ${data.participants.participant_type}</div>
          <div>
            <span class="label">Vulnerable Groups:</span>
            <ul>
              ${data.participants.vulnerable_groups?.map((group) => (
                `<li>${group}</li>`
              )).join('')}
            </ul>
          </div>
          <div><span class="label">Other Participant:</span> ${data.participants.other_participant}</div>
          <div><span class="label">Reimbursement:</span> ${data.participants.reimbursement}</div>
          <div><span class="label">Details:</span> ${data.participants.reimbursement_details}</div>
          <div><span class="label">Additional Safeguards:</span> ${data.participants.additional_safeguards}</div>
          <div><span class="label">Justification:</span> ${data.participants.justification}</div>
        </div>

        <h2>8. Benefits</h2>
        <div class="section">
          <div><span class="label">Any Risk:</span> ${data.benefits.any_risk}</div>
          <div><span class="label">Risk Details:</span> ${data.benefits.risk_details}</div>
          <div><span class="label">Risk Strategy:</span> ${data.benefits.risk_strategy}</div>
          <div><span class="label">Participant Benefits:</span> ${data.benefits.participant_benefits}</div>
          <div><span class="label">Social Benefits:</span> ${data.benefits.social_benefits}</div>
          <div><span class="label">Scientific Benefits:</span> ${data.benefits.science_benefits}</div>
        </div>

        <h2>9. Consent</h2>
        <div class="section">
          <div><span class="label">Waiver Consent:</span> ${data.consentData.waiver_consent}</div>
          <div><span class="label">Translated Languages:</span> ${data.consentData.translated_languages.join(', ')}</div>
          <div><span class="label">Other Reason:</span> ${data.consentData.other_reason}</div>
        </div>

        <h2>10. Payment</h2>
        <div class="section">
          <div><span class="label">Injury Treatment:</span> ${data.paymentState.injury_treatment}</div>
          <div><span class="label">SAE Compensation:</span> ${data.paymentState.sae_compensation}</div>
        </div>

        <h2>11. Storage</h2>
        <div class="section">
          <div><span class="label">Docs Control:</span> ${data.storage.docs_control}</div>
          <div><span class="label">Drugs Control:</span> ${data.storage.drugs_control}</div>
        </div>

        <h2>12. Additional Info</h2>
        <div class="section">
          <div><span class="label">Any Additional:</span> ${data.additional.any_additional}</div>
          <div><span class="label">Details:</span> ${data.additional.additional_info}</div>
        </div>

        <h2>13. Declaration</h2>
        <ul>
          ${selectedDeclarations.map(label => `<li>${label}</li>`).join('')}
        </ul>

        <h4>Principal Investigator</h4>
        <div><strong>Name:</strong> ${data.declaration.pi_name}</div>
        <div><strong>Signature:</strong> ${data.declaration.pi_signature}</div>
        <div><strong>Date:</strong> ${data.declaration.pi_date || "N/A"}</div>

        <h4>Guide</h4>
        <div><strong>Name:</strong> ${data.declaration.guide_name}</div>
        <div><strong>Signature:</strong> ${data.declaration.guide_signature}</div>
        <div><strong>Date:</strong> ${data.declaration.guide_date || "N/A"}</div>

        <h4>Head of Department</h4>
        <div><strong>Name:</strong> ${data.declaration.hod_name}</div>
        <div><strong>Signature:</strong> ${data.declaration.hod_signature}</div>
        <div><strong>Date:</strong> ${data.declaration.hod_date || "N/A"}</div>

        <h4>Co-Investigator 1</h4>
        <div><strong>Name:</strong> ${data.declaration.co1_name}</div>
        <div><strong>Signature:</strong> ${data.declaration.co1_signature}</div>
        <div><strong>Date:</strong> ${data.declaration.co1_date || "N/A"}</div>

        <h4>Co-Investigator 2</h4>
        <div><strong>Name:</strong> ${data.declaration.co2_name}</div>
        <div><strong>Signature:</strong> ${data.declaration.co2_signature}</div>
        <div><strong>Date:</strong> ${data.declaration.co2_date || "N/A"}</div>

        <h2>14. Checklist</h2>
        <div class="section" style = "margin-bottom : 20px;">
          ${data.checklist.map(item => `
            <div class="item" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <div style="width: 60%; font-weight: bold;">${item.label}</div>
              <div style="width: 38%; text-align: right;">
                ${item.file_name 
                  ? `<a href="http://localhost:4000/media/clinical/checklist/${item.file_name}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;">📎 View File</a>` 
                  : 'File: null'}
              </div>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  await page.pdf({ path: outputPath, format: 'A4', printBackground: true });
  await browser.close();

  try{
    await connectToMongo();
    const projectsCollection = getDB().collection("Projects");
    const projectData = await projectsCollection.findOne({project_ref : project_ref});
    const previousFileName = projectData.project_pdf;
    if(previousFileName !== "") {
      const previousName = previousFileName.split("/").at(-1);
      const filePath = path.join(__dirname, "media/clinical/projects", previousName);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log("File deleted successfully.");
          }
        });
      } 
    }
    
    const result = await projectsCollection.updateOne({project_ref : project_ref},
      { $set : { project_pdf : `media/clinical/projects/${fileName}` }
    });

    return true;
  }
  catch(error) {
    console.log("Error occured while updating project_pdf", error.message);
    throw error;
  }

  return outputPath;
}

module.exports = generateConsentPdf;
