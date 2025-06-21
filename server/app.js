const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const path = require('path');

const clinicalRoute = require("./routes/ClinicalRoute");
const userRoute = require("./routes/UserRoute");
const researchRoute = require("./routes/ResearchRoute");
const checkAdminRoute=require("./routes/CheckAdminRoute");
const NIECRoute = require("./routes/NIECRoute");
const InvestigatorRoute = require("./routes/InvestigatorRoute");
const ISRCRoute = require("./routes/ISRCRoute");

const app = express();

// Middleware
app.use(cookieParser());
const allowedOrigins = ['http://localhost', 'http://localhost:3000', 'http://172.26.0.50', 'http://172.26.0.50:3000' ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
// Serve images from the media/niec folder
app.use('/media/NIEC', express.static(path.join(__dirname, 'media/NIEC')));
app.use('/media/clinical/declaration/', express.static(path.join(__dirname, 'media/clinical/declaration')));
app.use('/media/clinical/payment_compensation/', express.static(path.join(__dirname, 'media/clinical/payment_compensation')));
app.use('/media/research/checklist/', express.static(path.join(__dirname, 'media/research/checklist')));
app.use('/media/clinical/checklist/', express.static(path.join(__dirname, 'media/clinical/checklist')));
app.use('/media/clinical/projects/', express.static(path.join(__dirname, 'media/clinical/projects')));


//Clinical Routes
app.use('/api/clinical', clinicalRoute);
app.use('/api/user', userRoute);
app.use("/api/research", researchRoute);
app.use("/api/research/check", checkAdminRoute);
app.use("/api/niec", NIECRoute);
app.use("/api/investigator", InvestigatorRoute);
app.use("/api/isrc", ISRCRoute);


app.use('/', (req, res) => { 
    res.send('API is working');
});

app.listen(process.env.PORT, '0.0.0.0', async () => {
    console.log(`Server is Running Successfully on Port ${process.env.PORT}`);
});
