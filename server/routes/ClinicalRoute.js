const express = require('express');
const router = express.Router();

const {addClinical} = require("../controllers/AddClinicalController")

router.post("/add", addClinical);

module.exports = router;