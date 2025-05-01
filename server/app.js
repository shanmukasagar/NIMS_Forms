const express = require('express');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');


const clinicalRoute = require("./routes/ClinicalRoute");
const userRoute = require("./routes/UserRoute");
const researchRoute = require("./routes/ResearchRoute");
const checkAdminRoute=require("./routes/CheckAdminRoute");

const app = express();

// Middleware
app.use(cookieParser());
const allowedOrigins = ['http://localhost:3000', 'http://172.26.0.50:3000'];

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

//Clinical Routes
app.use('/api/clinical', clinicalRoute);
app.use('/api/user', userRoute);
app.use("/api/research", researchRoute);
app.use("/api/research/check", checkAdminRoute);


app.use('/', (req, res) => { 
    res.send('API is working');
});

app.listen(process.env.PORT, '0.0.0.0', async () => {
    console.log(`Server is Running Successfully on Port ${process.env.PORT}`);
});
