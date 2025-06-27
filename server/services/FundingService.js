const { pool } = require("../models/db");

const TABLE_CONFIGS = {
    funded_studies: {
        fields: [
        "name", "budget", "study", "grant_patient", "manpower", "invest", "name_invest_1", "unit_1",
        "name_invest_2", "unit_2", "name_invest_3", "unit_3", "total_grant", "out_investigation",
        "invest_name_1", "unit_cost_1", "lab_name_1", "address_1", "nabl_1", "invest_name_2",
        "unit_cost_2", "lab_name_2", "address_2", "nabl_2", "email"
        ]
    }
};

function coerceIntegerFields(data, fieldList) {
  return fieldList.map((key) => {
    const val = data[key];
    return /^\d+$/.test(val) ? parseInt(val, 10) : val;
  });
}

const FundedFormDetails = async (formData, email, tableName, imageUrl) => {
  try {
    const config = TABLE_CONFIGS[tableName];
    if (!config) throw new Error(`Unsupported table: ${tableName}`);

    const dataWithEmail = { ...formData, email };
    const values = coerceIntegerFields(dataWithEmail, config.fields);
    const placeholders = config.fields.map((_, idx) => `$${idx + 1}`).join(", ");
    const columns = config.fields.join(", ");

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING id`;

    await pool.query(query, values);
    return true;
  } catch (error) {
    console.error(`Failed to insert into ${tableName}:`, error.message);
    throw error;
  }
};

const FundedFormData = async (email, tableName) => {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const { rows } = await client.query(`SELECT * FROM ${tableName} WHERE email = $1`, [email]);

    await client.query("COMMIT");

    return { formsResult: rows };
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error("Error fetching form data:", error.message);
    throw error;
  } finally {
    if (client) client.release();
  }
};

module.exports = { FundedFormDetails, FundedFormData };
