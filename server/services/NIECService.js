const { pool } = require("../models/db");

const TABLE_CONFIGS = {
  amendment_form: {
    fields: [
      "email", "register_no", "title", "name", "designation", "approval_date", "study_date",
      "protocol_changes_documented", "amended_documents_submitted", "additional_info"
    ]
  },
  amendment_template: {
    fields: [
      "doc_name", "rev_version_no", "rev_date", "prev_version_info",
      "rev_section_no", "rev_page_no", "pi_name", "signed_date", "email"
    ]
  },
  study_completion_report: {
    fields: [
      "niec_approval_date", "study_start_date", "completion_date", "designation", "affiliation",
      "sponsor", "funding_source", "publications", "additional_info", "objectives",
      "study_arms", "target_enroll", "screened", "screen_failures", "enrolled", "enroll_reason",
      "patients_completed", "patients_per_arm", "lost_followup", "other_info",
      "site_closure_report", "closure_reason", "safety_summary", "protocol_violations",
      "study_summary", "niec_reg_no", "project_no", "study_title", "pi_name", "email"
    ]
  },
  study_progress_report: {
    fields: [
      "expected_total", "screened", "enrolled", "randomized", "amendment_approval_date",
      "completed", "amendment_date", "on_followup", "study_start_date", "study_end_date",
      "niec_approval_date", "amendments_made", "reference_no", "reconsent_sought",
      "reconsent_details", "benefit_risk_update", "benefit_risk_details", "adverse_events",
      "ae_description", "sae_occurred", "sae_description", "protocol_violations", "violation_details",
      "deviation_reported", "publications_present", "publication_details", "additional_details",
      "deviation_details", "study_title", "pi_name", "pi_designation", "pi_affiliation",
      "niec_reg_no", "involves_recruitment", "enrollment_status", "remarks",
      "participants_withdrawn", "withdrawn_details", "extension_needed", "extension_reason", "email"
    ]
  },
  protocol_deviation: {
    fields: [
      "date", "confirm_date", "issue_date", "name", "issue_type", "similar_issues",
      "registration_number", "issue_details", "action_taken", "participant_impact", "informed_sponsor",
      "investigator_confirm_name", "email", "subject_id", "study_number", "version", "project_title"
    ]
  },
  sae_reports: {
    fields: [
      "sae_onset_date", "report_date", "mfg_date", "study_continued", "sae_informed",
      "report_type", "subject_id", "subject_age", "subject_gender", "sae_description",
      "treatment_provided", "cost_bearer", "sae_expected", "sae_type", "suspect_drug",
      "drug_dose", "admin_route", "dosage_form", "batch_no", "therapy_period",
      "therapy_duration", "reaction_response", "concomitant_drugs", "medical_history",
      "sae_outcome", "niec_reg_no", "protocol_no", "project_title", "pi_name", "email"
    ]
  },
  termination_suspension_form: {
    fields: [
      "niec_approval", "progress_report_date", "study_start", "term_suspension_date",
      "enrolled_count", "randomized_count", "completed_count", "ongoing_count", "dropouts_count",
      "sae_count", "submission_date", "other_reasons", "niec_reg_no", "study_protocol",
      "protocol_title", "pi_name", "sponsor_name", "status", "study_report", "additional_info",
      "pi_name_confirm", "termination_reasons", "safety_issues", "efficacy_lack", "email"
    ]
  }
};

function coerceIntegerFields(data, fieldList) {
  return fieldList.map((key) => {
    if (typeof data[key] === "string" && /^\d+$/.test(data[key])) {
      return parseInt(data[key]);
    }
    return data[key];
  });
}

const NIECFormDetails = async (formData, email, tableName) => {
  try {
    const config = TABLE_CONFIGS[tableName];
    if (!config) throw new Error("Unsupported table: " + tableName);

    const dataWithEmail = { ...formData, email };

    const values = coerceIntegerFields(dataWithEmail, config.fields);
    const placeholders = config.fields.map((_, idx) => `$${idx + 1}`).join(", ");

    const query = `INSERT INTO ${tableName} (${config.fields.join(", ")}) VALUES (${placeholders}) RETURNING id`;

    await pool.query(query, values);

    return true;
  } catch (error) {
    console.log("Failed to insert into", tableName, ":", error.message);
    throw error;
  }
};

module.exports = { NIECFormDetails };
