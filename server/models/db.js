const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "clinical_forms_db",
    password: "root",
    port: 5432
});

module.exports = pool;