const {connectToMongo, getDB} = require("../models/db");
const bcrypt = require('bcryptjs');

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
        const employeeCollection = getDB().collection("Employees");

        // 1. Find user by email
        const user1 = await userCollection.findOne({email : userData.email});
        const user2 = await employeeCollection.findOne({emp_code : userData.email, emp_pwd : userData.password});
        if(!user1 && !user2) {
            return {success : false, message : "Invalid Credentials"};
        }
        if(user2) {
            return {success : true, message : user2};
        }
        // 2. Compare entered password with hashed password
        const isMatch = await bcrypt.compare(userData.password, user1.password);
        if(!isMatch) {
            return {success : false, message : "Invalid Credentials"};
        }

        return {success : true, message : user1};
    }
    catch(error) {
        console.log("User registration failed");
        throw error;
    }
}

module.exports = {userRegistration, userAuthentication};