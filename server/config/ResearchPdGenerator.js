const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateResearchPDF(data, fileName) {
  try{
    const outputPath = path.join(__dirname, '../media/research/projects', `${fileName}.pdf`);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Research Submission</title>
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
          </style>

        </head>
        <body>
          <h1>Clinical Research Submission</h1>

          <div style="font-size: 18px; font-family: Arial, sans-serif; color: #333;">
            <span>Last Modified:</span>
             <span>${new Date().toLocaleString()}</span>
          </div>

          <h2>1. Administration</h2>
          <div className="section">
              <div><span className="label">Name of Research Principal:</span> ${data.administration.name_of_research_principal}</div>
              <div><span className="label">Department:</span> ${data.administration.department}</div>
              <div><span className="label">Study Title:</span> ${data.administration.title}</div>
              <div><span className="label">Review Requested:</span> ${data.administration.review_requested}</div>
              <div><span className="label">Submission Date:</span> ${new Date(data.administration.date).toLocaleDateString()}</div>
              <div><span className="label">Submitted At:</span> ${new Date(data.administration.submitted_at).toLocaleString()}</div>
              <div><span className="label">Version Number:</span> ${data.administration.version_number}</div>
              <div><span className="label">Date:</span> ${new Date(data.administration.date_1).toLocaleDateString()}</div>
              <div><span className="label">Protocol Number:</span> ${data.administration.protocol_number}</div>
              <div><span className="label">Email:</span> ${data.administration.email}</div>
              <div><span className="label">Summary:</span> ${data.administration.summary}</div>

              <div><span className="label">Selected Elements:</span></div>
              ${data.administration.selected_elements.map((element, index) => (
                `<div key=${index} style={{ paddingLeft: '20px' }}>• ${element}</div>`
              ))}

              <div><span className="label">Other Reason:</span> ${data.administration.other_reason}</div>
          </div>

          <h2>2. Investigators</h2>
          <div className="section">
            <h3>Researchers</h3>
            ${data.researchers.map((researcher, index) => (
              `<div key=${index} style={{ marginBottom: '15px' }}>
                <div><span className="label">Name:</span> ${researcher.name}</div>
                <div><span className="label">Designation:</span> ${researcher.designation}</div>
                <div><span className="label">Qualification:</span> ${researcher.qualification}</div>
                <div><span className="label">Department:</span> ${researcher.department}</div>
                <div><span className="label">Investigator Type:</span> ${researcher.investigator_type.replace('_', ' ')}</div>
                <div><span className="label">Email:</span> ${researcher.email}</div>
                <div><span className="label">Alternate Gmail:</span> ${researcher.gmail}</div>
                <div><span className="label">Contact:</span> ${researcher.contact}</div>
                <div><span className="label">Approved:</span> ${researcher.approved ? 'Yes' : 'No'}</div>
                <div><span className="label">Approval Token:</span> ${researcher.approval_token}</div>
              </div>`
            ))}
          </div>

          <div className="section">
            <h2>Funding Details</h2>

            <div><span className="label">Funding Source:</span> ${data.fundingData.funding_source}</div>
            <div><span className="label">Total Estimated Budget:</span> ₹ ${data.fundingData.total_estimated_budget}</div>

            ${data.fundingData.funding_source === "self-funding" && data.fundingDetails && (
            `<>
              <div><span className="label">Proposed Budget:</span> ₹ ${data.fundingDetails.proposed_budget}</div>
              <div><span className="label">Cost Per Patient:</span> ₹ ${data.fundingDetails.cost_per_patient}</div>
              <div><span className="label">Total Project Cost:</span> ₹ ${data.fundingDetails.total_project_cost}</div>
              <div><span className="label">NIMS Investigations:</span>
                <ul>
                  ${data.fundingDetails.nims_investigations?.map((item, index) => (
                    `<div>
                      <div><span class="label">Name:</span> ${item.name}</div>
                      <div><span class="label">Cost:</span> ${item.cost}</div>
                    </div>`
                  ))}
                </ul>
              </div>
              <div><span className="label">Is Outsourced:</span> ${data.fundingDetails.is_outsourced ? "Yes" : "No"}</div>
              <div><span className="label">Outsourced Investigations:</span>
                <ul>
                  ${data.fundingDetails.outsourced_investigations?.map((item, index) => (
                     `<div>
                        <div><span class="label">Name:</span> ${item.name}</div>
                        <div><span class="label">Cost:</span> ${item.cost}</div>
                        <div><span class="label">Lab:</span> ${item.lab}</div>
                        <div><span class="label">NABL:</span> ${item.nabl}</div>
                      </div>`
                  ))}
                </ul>
              </div>
            </>`
            )}

            ${(data.fundingData.funding_source === "institutional" || data.fundingData.funding_source === "agency")
               && data.fundingDetails && (
              `<>
                <div><span className="label">Funding Agency:</span> ${data.fundingDetails.funding_agency}</div>
                <div><span className="label">Grant Per Patient:</span> ₹${data.fundingDetails.grant_per_patient}</div>
                <div><span className="label">Manpower Grant:</span> ₹${data.fundingDetails.manpower_grant}</div>
                <div><span className="label">Total Grant:</span> ₹${data.fundingDetails.total_grant}</div>
                <div><span className="label">NIMS Investigations:</span>
                  <ul>
                    ${data.fundingDetails.nims_investigations?.map((item, index) => (
                       `<div key = ${index}>
                          <div><span class="label">Name:</span> ${item.name}</div>
                          <div><span class="label">Cost:</span> ${item.cost}</div>
                        </div>`
                    ))}
                  </ul>
                </div>
                <div><span className="label">Is Outsourced:</span> ${data.fundingDetails.is_outsourced ? "Yes" : "No"}</div>
                <div><span className="label">Outsourced Investigations:</span>
                  <ul>
                    ${data.fundingDetails.outsourced_investigations?.map((item, index) => (
                      `<div>
                          <div><span class="label">Name:</span> ${item.name}</div>
                          <div><span class="label">Cost:</span> ${item.cost}</div>
                          <div><span class="label">Lab:</span> ${item.lab}</div>
                          <div><span class="label">NABL:</span> ${item.nabl}</div>
                        </div>`
                    ))}
                  </ul>
                </div>
              </>`
            )}

            ${data.fundingData.funding_source === "Pharmaceutical Industry sponsored" && data.fundingDetails && (
              `<>
                <div><span className="label">Sponsor Name:</span> ${data.fundingDetails.sponsor_name}</div>
                <div><span className="label">Sponsor PAN:</span> ${data.fundingDetails.sponsor_pan}</div>
                <div><span className="label">Sponsor GST:</span> ${data.fundingDetails.sponsor_gst}</div>
                <div><span className="label">Total Grant:</span> ₹ ${data.fundingDetails.total_grant}</div>
                <div><span className="label">Budget Items:</span>
                  <ul>
                    ${data.fundingDetails.budget_items?.map((item, index) => (
                      `<div key = ${index}>
                        <div><span class="label">${item.label}:</span> ${item.value}</div>
                      </div>`
                    ))}
                  </ul>
                </div>
                <div><span className="label">NIMS Investigations:</span>
                  <ul>
                    ${data.fundingDetails.nims_investigations?.map((item, index) => (
                      `<div key = ${index}>
                        <div><span class="label">Name:</span> ${item.name}</div>
                        <div><span class="label">Cost:</span> ${item.cost}</div>
                      </div>`
                    ))}
                  </ul>
                </div>
                <div><span className="label">Personnel:</span>
                  <ul>
                    ${data.fundingDetails.personnel?.map((person, index) => (
                      `<div key = ${index}>
                        <div><span class="label">Designation:</span> ${item.designation}</div>
                        <div><span class="label">Fees:</span> ${item.fees}</div>
                      </div>`
                    ))}
                  </ul>
                </div>
                <div><span className="label">Is Outsourced:</span> ${data.fundingDetails.is_outsourced ? "Yes" : "No"}</div>
                <div><span className="label">Outsourced Investigations:</span>
                  <ul>
                    ${data.fundingDetails.outsourced_investigations?.map((item, index) => (
                      `<div>
                        <div><span class="label">Name:</span> ${item.name}</div>
                        <div><span class="label">Lab:</span> ${item.lab}</div>
                        <div><span class="label">NABL:</span> ${item.nabl}</div>
                      </div>`
                    ))}
                  </ul>
                </div>
              </>`
            )}
          </div>
          <div className="section">
            <h2>Overview of the Research</h2>
            <div><span className="label">Summary:</span> ${data.overviewResearch.summary}</div>
            <div><span className="label">Type of Study:</span> ${data.overviewResearch.type_of_study}</div>
            <div><span className="label">Other Study Type:</span> ${data.overviewResearch.otherstudytype}</div>
            <div><span className="label">External Laboratory Involved:</span> ${data.overviewResearch.external_laboratory}</div>
            <div><span className="label">Specify (if External Lab):</span> ${data.overviewResearch.specify}</div>
            <div><span className="label">Justification:</span> ${data.overviewResearch.justification}</div>
            <div><span className="label">Sample Size:</span> ${data.overviewResearch.sample_size}</div>
            <div><span className="label">Email:</span> ${data.overviewResearch.email}</div>
          </div>

          <div className="section">
            <h2>Participants</h2>
            <div><span className="label">Type of Participants:</span> ${data.participants.type_of_participants}</div>
            <div><span className="label">Specify (if applicable):</span> ${data.participants.specifiy || 'N/A'}</div>
            <div><span className="label">Justification:</span> ${data.participants.justification}</div>
            <div><span className="label">Additional Safeguards:</span> ${data.participants.additional_safeguards}</div>
            <div><span className="label">Reimbursement Details:</span> ${data.participants.reimbursement_details}</div>
            <div><span className="label">Advertisement Details:</span> ${data.participants.advertisement_details}</div>
            <div><span className="label">Payment Type:</span> ${data.participants.payment_type}</div>
            <div><span className="label">Advertisement Type:</span> ${data.participants.advertisement_type}</div>
            <div><span className="label">Email:</span> ${data.participants.email}</div>

            {/* Vulnerable Groups */}
            <div><span className="label">Vulnerable Groups:</span></div>
            ${data.participants.vulnerablegroups.map((group, index) => (
              `<div key=${index} style={{ paddingLeft: '20px' }}>${group}</div>`
            ))}
          </div>

          <div className="section">
            <h2>Benefits Details</h2>
            <div><span className="label">Reimbursement Details:</span> ${data.benefits.reimbursement_details}</div>
            <div><span className="label">Risk Management Strategy:</span> ${data.benefits.management_strategy}</div>
            <div><span className="label">Anticipated Type of Benefits:</span> ${data.benefits.anticipated_type}</div>
            <div><span className="label">Participant Benefits:</span> ${data.benefits.participant_benefits}</div>
            <div><span className="label">Society Benefits:</span> ${data.benefits.society_benefits}</div>
            <div><span className="label">Improvement Benefits:</span> ${data.benefits.improvement_benefits}</div>
            <div><span className="label">Email:</span> ${data.benefits.email}</div>
          </div>

          <div className="section">
            <h2>Consent Details</h2>
            
            <div><span className="label">Seeking Waiver of Consent Type:</span> ${data.consentData.seeking_waiver_of_consent_type}</div>
            <div><span className="label">Specify:</span> ${data.consentData.specify}</div>
            <div><span className="label">Email:</span> ${data.consentData.email}</div>
            <div><span className="label">Version Number:</span> ${data.consentData.version_number}</div>
            <div><span className="label">Date:</span> ${new Date(data.consentData.date).toLocaleDateString()}</div>
            <div><span className="label">Subject:</span> ${data.consentData.subject}</div>
            <div><span className="label">Certificates:</span> ${data.consentData.certificates}</div>

            {/* Language details */}
            <div><span className="label">Selected Languages:</span> ${data.consentData.selectedlanguages.join(", ")}</div>
            ${data.consentData.selectedlanguages.map((lang, idx) => (
            `<div key=${idx} style={{ paddingLeft: '20px' }}>
                <div><strong>${lang}</strong></div>
                <div><span className="label">Version:</span> ${data.consentData.languagedetails[lang]?.version}</div>
                <div><span className="label">Date:</span> ${new Date(data.consentData.languagedetails[lang]?.date).toLocaleDateString()}</div>
              </div>`
            ))}

            {/* PIS selected items */}
            <div><span className="label">PIS Selected Items:</span></div>
            ${data.consentData.pisselecteditems.map((item, idx) => (
              `<div key=${idx} style={{ paddingLeft: '20px' }}>${item}</div>`
            ))}
            ${data.consentData.pisothertext && (
              `<div><span className="label">PIS Other Text:</span> ${data.consentData.pisothertext}</div>`
            )}

            {/* Summary */}
            <div><span className="label">Summary:</span> ${data.consentData.summary}</div>

            {/* Waiver Selected Elements */}
            <div><span className="label">Waiver Selected Elements:</span></div>
            ${data.consentData.selected_elements.map((el, idx) => (
              `<div key=${idx} style={{ paddingLeft: '20px' }}>${el}</div>`
            ))}
          </div>

          <div className="section">
            <h2>Compensation & Payment Details</h2>

            <div><span className="label">Waiver of Consent Type:</span> ${data.paymentState.waiver_consent_type}</div>
            <div><span className="label">Specify:</span> ${data.paymentState.specify}</div>
            <div><span className="label">Compensation for Research-Related Injury:</span> ${data.paymentState.compensation_research_of_type}</div>
            <div><span className="label">Specific Compensation Details:</span> ${data.paymentState.specific}</div>
            <div><span className="label">Email:</span> ${data.paymentState.email}</div>
          </div>


          <div className="section">
            <h2>Storage and Access Details</h2>

            <div><span className="label">Control Details:</span> ${data.storage.control_details}</div>
            <div><span className="label">Access Details:</span> ${data.storage.access_details}</div>
            <div><span className="label">Sample Access Type:</span> ${data.storage.sample_access_type}</div>
            <div><span className="label">Sample Details:</span> ${data.storage.sample_details}</div>
            <div><span className="label">Document Access Type:</span> ${data.storage.document_access_type}</div>
            <div><span className="label">Drugs Access Type:</span> ${data.storage.drugs_access_type}</div>
            <div><span className="label">Email:</span> ${data.storage.email}</div>
            ${data.storage.identifierprecautions && (
              `<div><span className="label">Identifier Precautions:</span> ${data.storage.identifierprecautions}</div>`
            )}
          </div>

          <div className="section">
            <h2>Additional Support Information</h2>

            <div><span className="label">Support Type:</span> ${data.additional.support_type}</div>
            <div><span className="label">Additional Details:</span> ${data.additional.additional}</div>
            <div><span className="label">Email:</span> ${data.additional.email}</div>
          </div>


          <div className="section">
            <h2>Declaration</h2>

            <div className="subsection">
              <h4>Selected Declarations:</h4>
              <ul>
                ${data.declaration.selected_elements.map((item, index) => (
                  `<li key=${index}>${item}</li>`
                ))}
              </ul>
            </div>

            <div><span className="label">Principal Investigator:</span> ${data.declaration.name_of_pi_research}</div>
            <div><span className="label">Date:</span> ${new Date(data.declaration.date_pi).toLocaleDateString()}</div>
            <div><span className="label">Signature:</span> ${data.declaration.sign_1}</div>

            ${data.declaration.name_of_co_pi_guide && (
              `<>
                <div><span className="label">Co-PI / Guide:</span> ${data.declaration.name_of_co_pi_guide}</div>
                <div><span className="label">Date:</span> ${new Date(data.declaration.date_co_pi).toLocaleDateString()}</div>
                <div><span className="label">Signature:</span> ${data.declaration.sign_2}</div>
              </>`
            )}

            ${data.declaration.name_of_co_investigator_1 && (
              `<>
                <div><span className="label">Co-Investigator 1:</span> ${data.declaration.name_of_co_investigator_1}</div>
                <div><span className="label">Date:</span> ${new Date(data.declaration.date_co_inv_1).toLocaleDateString()}</div>
                <div><span className="label">Signature:</span> ${data.declaration.sign_3}</div>
              </>`
            )}

            ${data.declaration.name_of_co_investigator_2 && (
              `<>
                <div><span className="label">Co-Investigator 2:</span> ${data.declaration.name_of_co_investigator_2}</div>
                <div><span className="label">Date:</span> ${new Date(data.declaration.date_co_inv_2).toLocaleDateString()}</div>
                <div><span className="label">Signature:</span> ${data.declaration.sign_4}</div>
              </>`
            )}

            ${data.declaration.name_of_hod && (
              `<>
                <div><span className="label">HOD:</span> ${data.declaration.name_of_hod}</div>
                <div><span className="label">Date:</span> ${new Date(data.declaration.date_co_inv_3).toLocaleDateString()}</div>
                <div><span className="label">Signature:</span> ${data.declaration.sign_5}</div>
              </>`
            )}
          </div>
          <h2>14. Checklist</h2>
          <div class="section" style = "margin-bottom : 20px;">
            ${data.checklist.map(item => `
              <div class="item" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <div style="width: 60%; font-weight: bold;">${item.label || item.label_name}</div>
                <div style="width: 38%; text-align: right;">
                  ${item.file_name 
                    ? `<a href="http://localhost:4000/media/research/checklist/${item.file_name}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;">📎 View File</a>` 
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

    return true;

  }
  catch(err) {
    console.log("Error occured", err.message);
    return false;
  }
  
}

module.exports = generateResearchPDF;
