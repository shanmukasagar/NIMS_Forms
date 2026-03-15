const { Pool } = require("pg");
require('dotenv').config();
const  {MongoClient,GridFSBucket } = require('mongodb');



// const pool = new Pool({
//     user: "shanmukasagar",
//     host: "ep-red-grass-a1ch12cb-pooler.ap-southeast-1.aws.neon.tech" ,
//     database: "research_forms",
//     password: "NIMSforms@123",
//     port: 5432,
//     ssl: { rejectUnauthorized: false }
// });

/* ===== PostgreSQL ===== */
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "new_nimsresearch",
  password: "naveen",
  port: 5432,
});


let client;
let isConnected = false;
const uri = process.env.MONGO_URI;
const dbName = process.env.WAYPOINT;

client = new MongoClient(uri, { }); // Create mongoclient

async function connectToMongo() {
    try {
        if(!isConnected) {
            await client.connect();
            isConnected = true;
            console.log('Connected to MongoDB');
        } else {
            console.log('Connection is already active');
        }
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        isConnected = false;
        throw error; // Throw error to indicate failure to connect
    }
}

const getDB = () => {
    if(!client){
        throw new Error('MongoDB client is not connected');
    }
    else{
        return client.db(dbName);
    }
};

// 🔹 Get Collection
const getCollection = (name) => {
  return getDB().collection(name);
};

// 🔹 Bucket for raw uploads
const getAdminUploadBucket = () => {
  return new GridFSBucket(getDB(), {
    bucketName: "adminUploads"
  });
};

module.exports = { 
    connectToMongo, 
    getDB,
    pool,
      getAdminUploadBucket,
      getCollection
    
};
