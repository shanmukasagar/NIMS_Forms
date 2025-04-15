const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const clinicalRoute = require("./routes/ClinicalRoute");

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());


//Clinical Routes
app.use('/api/clinical', clinicalRoute);

app.use('/', (req, res) => { 
    res.send('API is working');
});

app.listen(4000, async () => {
    console.log(`Server is Running Successfully on Port ${4000}`);
});
