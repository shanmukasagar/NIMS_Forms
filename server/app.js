const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');


const clinicalRoute = require("./routes/ClinicalRoute");
const userRoute = require("./routes/UserRoute");

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

//Clinical Routes
app.use('/api/clinical', clinicalRoute);
app.use('/api/user', userRoute);

app.use('/', (req, res) => { 
    res.send('API is working');
});

app.listen(process.env.PORT, async () => {
    console.log(`Server is Running Successfully on Port ${process.env.PORT}`);
});
