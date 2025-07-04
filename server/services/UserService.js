const {connectToMongo, getDB} = require("../models/db");
const bcrypt = require('bcryptjs');

const userRegistration = async(userData) => {
    try{
        await connectToMongo(); //connect to database
        const employeeCollection = getDB().collection("Employees");

        const isUserExist = await employeeCollection.findOne({emp_code : Number(userData.email)});
        if (isUserExist) {
            return {success : false, message : "Employee code Already Exist"};
        }

        const data = {name : userData.username, emp_code: Number(userData.email), emp_pwd: userData.password, 
            mobile: userData.mobile};

        const result = await employeeCollection.insertOne(data);
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
        const employeeCollection = getDB().collection("Employees");

        const user = await employeeCollection.findOne({emp_code : Number(userData.email), emp_pwd : userData.password});
        if(user) {
            return {success : true, message : user};
        }
        return {success : false, message : "Invalid Credentials"};
    }
    catch(error) {
        console.log("User registration failed");
        throw error;
    }
}

module.exports = {userRegistration, userAuthentication};