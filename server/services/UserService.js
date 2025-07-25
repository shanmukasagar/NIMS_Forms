const {connectToMongo, getDB} = require("../models/db");
const bcrypt = require('bcryptjs');
const { Long } = require('mongodb');

const userRegistration = async(userData) => {
    try{
        await connectToMongo(); //connect to database
        const employeeCollection = getDB().collection("Employees");

        const isUserExist = await employeeCollection.findOne({emp_code : Long.fromString(userData.email)});
        if (isUserExist) {
            return {success : false, message : "Employee code Already Exist"};
        }

        const data = {
            name : userData.username, 
            emp_code: Long.fromString(userData.email), 
            emp_pwd: userData.password, 
            mobile: userData.mobile,
            allowed_logins : userData.allowed_logins
        };

        const result = await employeeCollection.insertOne(data);
        if (result.acknowledged) {
            const reviewerTypes = [
                { type: "isrc", role: "ISRC Member Secretary" },
                { type: "niec", role: "NIMS IEC CommitteeMember-secretary" },
                { type: "pbac", role: "PBAC Member Secretary" }
            ];

            const reviewersCollection = getDB().collection("AssignReviewers");

            for (const { type, role } of reviewerTypes) {
                if (userData.allowed_logins.includes(role)) {
                    const reviewer = {
                        name: data.name,
                        emp_code: data.emp_code,
                        type: type
                    };
                    await reviewersCollection.insertOne(reviewer);
                }
            }

            return { success: true, message: "User registered successfully" };
        }

return { success: false, message: "User registration failed" };

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

        if (!user) {
            return { success: false, message: "Invalid Credentials" };
        }

        if (!user.allowed_logins || !user.allowed_logins.includes(userData.selectedRole)) {
            return { success: false, message: "Access denied: Role not allowed" };
        }

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

const deleteUserService = async (empCode) => {
    try {
        await connectToMongo();
        const employeeCollection = getDB().collection("Employees");
        const reviewerCollection = getDB().collection("AssignReviewers");

        const result = await employeeCollection.deleteOne({ emp_code: Number(empCode) });

        if (result.deletedCount === 1) {
            const deleteResponse = await reviewerCollection.deleteMany({ emp_code: Number(empCode) });
            return { success: true, message: "User deleted successfully" };
        } else {
            return { success: false, message: "User not found" };
        }
    } catch (error) {
        console.log("Delete user failed:", error.message);
        throw error;
    }
};

module.exports = {userRegistration, userAuthentication, deleteUserService};