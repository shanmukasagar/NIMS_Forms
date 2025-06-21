const tableFieldMap = {
    administrativee_details: [
        "name_of_research_principal", "department", "title", "review_requested",
        "protocol_number", "version_number", "date", "email", "date_1"
    ],

    funding_budgett_and_details: [
        "total_estimated_budget", "funding_source", "email"
    ],

    overvieww_research: [
        "summary", "type_of_study", "external_laboratory", "specify", "email"
    ],

    participantt_related_information: [
        "type_of_participants", "justification", "specifiy", "additional_safeguards",
        "advertisement_type", "advertisement_details", "payment_type", "email"
    ],

    benefits_and_risk: [
        "improvement_benefits", "reimbursement_details", "management_strategy",
        "participant_benefits", "anticipated_type", "society_benefits", "email"
    ],

    payment_compensation: [
        "waiver_consent_type", "specify", "compensation_research_of_type", "specific", "email"
    ],

    storage_and_confidentiality: [
        "document_access_type", "access_details", "drugs_access_type",
        "control_details", "sample_access_type", "sample_details", "email"
    ],

    additional_information: [
        "support_type", "additional", "email"
    ],

    administrative_requirements: [
        "documents", "enclosure1", "remarks1", "investigator", "enclosure2", "remarks2", "clinic",
        "enclosure3", "remarks3", "clearance", "enclosure4", "remarks4", "partners", "enclosure5",
        "remarks5", "protocol", "enclosure6", "remarks6", "translate", "enclosure7", "remarks7",
        "minors", "enclosure8", "remarks8", "proforma", "enclosure10", "remarks10", "advertise",
        "enclosure11", "remarks11", "insurance", "enclosure12", "remarks12", "email"
    ],

    declaration: [
        "selectedElements", "name_of_pi_research", "date_pi", "name_of_co_pi_guide",
        "date_co_pi", "name_of_co_investigator_1", "date_co_inv_1", "name_of_co_investigator_2",
        "date_co_inv_2", "email"
    ],

    expedited_review: [
        "selectedElements", "protocol_number", "version_number", "principal_investigator_name",
        "department", "title", "summary", "name_of_co_investigator_1", "date_1", "date_2", "email"
    ],

    requesting_waiver: [
        "selectedElements", "principal_investigator_name", "department",
        "title", "summary", "name_of_co_investigator_1", "date", "email"
    ],

    informedd_consent: [
        "seeking_waiver_of_consent_type", "languages", "version_number", "date",
        "version_1", "date_1", "version_2", "date_2", "version_3", "date_3",
        "specify", "certificates", "subject", "selectedElements", "email"
    ],

};

module.exports = {tableFieldMap};