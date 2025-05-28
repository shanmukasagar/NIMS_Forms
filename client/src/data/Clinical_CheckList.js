export const checklist = [
    { id: 1, label: "Cover letter", status: "", enclosure_no: "", remarks: "" },
    { id: 2, label: "Brief CV of all Investigators", status: "", enclosure_no: "", remarks: "" },
    { id: 3, label: "Good Clinical Practice (GCP) training of investigators in last 3 years", status: "", enclosure_no: "", remarks: "" },
    { id: 4, label: "EC clearance of other centers", status: "", enclosure_no: "", remarks: "" },
    { id: 5, label: "Agreement between collaborating partners", status: "", enclosure_no: "", remarks: "" },
    { id: 6, label: "MTA between collaborating partners", status: "", enclosure_no: "", remarks: "" },
    { id: 7, label: "Insurance policy / certificate", status: "", enclosure_no: "", remarks: "" },
    { id: 8, label: "Copy of CTA signed with the sponsor", status: "", enclosure_no: "", remarks: "" },
    { id: 9, label: "Provide all significant previous decisions", status: "", enclosure_no: "", remarks: "" },
    { id: 10, label: "Copy of the detailed protocol and synopsis", status: "", enclosure_no: "", remarks: "" },
    { id: 11, label: "Investigators Brochure", status: "", enclosure_no: "", remarks: "" },
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
    { name: "", designation: "", qualification: "", department: "", email: "", contact: "", type: "principal" }, 
    { name: "", designation: "", qualification: "", department: "", email: "", contact: "", type: "guide" }, 
    { name: "", designation: "", qualification: "", department: "", email: "", contact: "", type: "co-investigator" }, 
    { name: "", designation: "", qualification: "", department: "", email: "", contact: "", type: "co-investigator" } 
];



export function formatDateTime(isoString) {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString(); // e.g., "10/3/2025"
    const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., "6:30 PM"
    return `${datePart}`;
  }
  
  