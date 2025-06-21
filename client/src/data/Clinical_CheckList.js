export const checklist = [
  { id: 1, label: "Cover letter", required: true },
  { id: 2, label: "Brief CV of all Investigators- Updated, signed and dated", required: true },
  { id: 3, label: "Good Clinical Practice (GCP) training of investigators in last 3 years", required: true },
  { id: 4, label: "EC clearance of other centers", required: false },
  { id: 5, label: "Agreement between collaborating partners", required: false },
  { id: 6, label: "MTA between collaborating partners", required: false },
  { id: 7, label: "Insurance policy / certificate", required: true },
  { id: 8, label: "Copy of CTA signed with the sponsor", required: true },
  { id: 9, label: "Provide all significant previous decisions (e.g. those leading to a negative decision or modified protocol) by other ECs / Regulatory authorities for proposed study (whether in same location or elsewhere) and modification(s) to protocol", required: false},
  { id: 10, label: "Copy of the detailed protocol (clearly identified numbered and dated) and synopsis (summary as far as possible in non-technical language, flowchart, diagrammatic representation of the protocol)", required: true },
  { id: 11, label: "Investigators Brochure (If applicable for drug / biologicals / device trials)", required: true },
  { id: 12, label: "Participant Information Sheet (PIS) and Informed Consent Form (ICF) (English and translated) with version number and dated", required: true },
  { id: 13, label: "Assent form for minors (12-18 years) (English and Translated)", required: false },
  { id: 14, label: "Proforma / Questionnaire / Case Report Forms (CRF) / Interview guides / Guides for Focused Group Discussions (FGDs) (English and translated)", required: true },
  { id: 15, label: "Advertisement / material to recruit participants (fliers, posters, etc.)", required: false },
  { id: 17, label: "DCGI Approval letter", required: true },
  { id: 18, label: "Others specify", required: false }
];




export const InvestigatorsInformation = {
    investigators: {
        principal: {
            name: "",
            designation: "",
            qualification: "",
            department: "",
            address: "",
            contact: ""
        },
        coInvestigators: [
            {
                name: "",
                designation: "",
                qualification: "",
                department: "",
                address: "",
                contact: ""
            },
            {
                name: "",
                designation: "",
                qualification: "",
                department: "",
                address: "",
                contact: ""
            }
        ]
    }
}

export const investigators = [ 
    { name: "", designation: "", qualification: "", department: "", gmail: "", contact: "", type: "principal" }, 
    { name: "", designation: "", qualification: "", department: "", gmail: "", contact: "", type: "guide" }, 
    { name: "", designation: "", qualification: "", department: "", gmail: "", contact: "", type: "co-investigator" }, 
    { name: "", designation: "", qualification: "", department: "", gmail: "", contact: "", type: "co-investigator" } 
];



export function formatDateTime(isoString) {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString(); // e.g., "10/3/2025"
    const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., "6:30 PM"
    return `${datePart}`;
  }
  
  