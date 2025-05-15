// server/routes/CheckAdminRoute.js
const express = require("express");
const router = express.Router();
const { pool } = require("../models/db");
const {verifyToken} = require("../config/VerifyToken");

router.get("/admin", verifyToken, async (req, res) => {
  const form_type = req.query.form_type;
  const email = req.user.email; // You can also get from req.query.email

  let tableName;

  switch (form_type?.trim()) {
    case "administrativee_details":
      tableName = "administrativee_details";
      break;
    case "investigatorss":
      tableName = "investigatorss";
      break;
    case "funding_budgett_and_details":
      tableName = "funding_budgett_and_details";
      break;
    case "overvieww_research":
      tableName = "overvieww_research";
      break;
    case "participantt_related_information":
      tableName = "participantt_related_information"; 
      break;
    case "benefits_and_risk":
      tableName = "benefits_and_risk";
      break;
    case "informedd_consent":
      tableName = "informedd_consent";
      break;
    case "payment_compensation":
      tableName = "payment_compensation";
      break;
      case "storage_and_confidentiality":
        tableName = "storage_and_confidentiality";
        break;

     case "additional_information":
     tableName = "additional_information";
     break;
    
    case "declaration":
     tableName = "declaration";
     break;
             
    case "administrative_requirements":
      tableName = "administrative_requirements";
      break;

    case "expedited_review":
      tableName = "expedited_review";
      break;
      case "requesting_waiver":
        tableName = "requesting_waiver";
        break;
  
  
    default:
      return res.status(400).json({ message: "Invalid form_type" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM ${tableName} WHERE email = $1`,
      [email]
    );
    // if (form_type === "expedited_review") {
    //   // const formFilled = result.rows.length > 0;
    //   return res.status(200).json({ formFilled});
    // }
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).json({ message: "Database query failed" });
  }
});

module.exports = router;
