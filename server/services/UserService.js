const {connectToMongo, getDB} = require("../models/db");
const bcrypt = require('bcrypt');

const userRegistration = async(userData) => {
    try{
        await connectToMongo(); //connect to database
        const userCollection = getDB().collection("Users");

        const isUserExist = await userCollection.findOne({email : userData.email});
        if (isUserExist) {
            return {success : false, message : "Email Already Exist"};
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const data = {username : userData.username, email: userData.email, password: userData.password, 
            mobile: userData.mobile};

        const result = await userCollection.insertOne(data);
        if (result.acknowledged) {
            return {success : true, message : "User registered successfully "};
        }
        return {success : false, message : "User registration failed "};
    }
    catch(error) {
        console.log("User registration failed");
        throw error;
    }
}

const userAuthentication = async(userData) => {
    try{
        await connectToMongo(); //connect to database
        const userCollection = getDB().collection("Users");

        // 1. Find user by email
        const user = await userCollection.findOne({email : userData.email});
        if (!user) {
            return {success : false, message : "Invalid Credentials"};
        }
        // 2. Compare entered password with hashed password
        const isMatch = await bcrypt.compare(userData.password, user.password);
        if(!isMatch) {
            return {success : false, message : "Invalid Credentials"};
        }
        return {success : true, message : user};
    }
    catch(error) {
        console.log("User registration failed");
        throw error;
    }
}

module.exports = {userRegistration, userAuthentication};