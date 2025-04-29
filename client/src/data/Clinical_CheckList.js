export const checklist = [
    { id: 1, label: "Cover letter", status: "", enclosureNo: "", remarks: "" },
    { id: 2, label: "Brief CV of all Investigators", status: "", enclosureNo: "", remarks: "" },
    { id: 3, label: "Good Clinical Practice (GCP) training of investigators in last 3 years", status: "", enclosureNo: "", remarks: "" },
    { id: 4, label: "EC clearance of other centers", status: "", enclosureNo: "", remarks: "" },
    { id: 5, label: "Agreement between collaborating partners", status: "", enclosureNo: "", remarks: "" },
    { id: 6, label: "MTA between collaborating partners", status: "", enclosureNo: "", remarks: "" },
    { id: 7, label: "Insurance policy / certificate", status: "", enclosureNo: "", remarks: "" },
    { id: 8, label: "Copy of CTA signed with the sponsor", status: "", enclosureNo: "", remarks: "" },
    { id: 9, label: "Provide all significant previous decisions", status: "", enclosureNo: "", remarks: "" },
    { id: 10, label: "Copy of the detailed protocol and synopsis", status: "", enclosureNo: "", remarks: "" },
    { id: 11, label: "Investigators Brochure", status: "", enclosureNo: "", remarks: "" },
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

export function formatDateTime(isoString) {
    const date = new Date(isoString);
    const datePart = date.toLocaleDateString(); // e.g., "10/3/2025"
    const timePart = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // e.g., "6:30 PM"
    return `${datePart} ${timePart}`;
  }
  
  