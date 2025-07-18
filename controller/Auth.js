import express from "express";
import AuthModel from "../models/authSchema.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// User Registration
const register = async (req, res) =>{
    const salt = 8;
    try {
        const {email, password, role} = req.body;

        if (!email|| !password|| !role){
            return res.status(400).json({message: "All fields are required!!!"});
        }
        // If User Already Exist
        const existingUser = await AuthModel.findOne({email})
        
        if(existingUser){
            return res.status(400).json({message:"User already exist ❌"});
        }
        // Hash Password
        const hashPassword = await bcrypt.hash(password, salt)

        // Create User
        const user = new AuthModel({
            email,
            password:hashPassword,
            role
        })

        // Save User to Database
        await user.save();

        // Generate Token
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRETKEY, {
             expiresIn: "7d"
        })
        res.cookie("token", token, {
            httpOnly:true,
            secure:true,
            sameSite:"Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        return res.status(201).json({message:"User registered successfully", user:{id: user._id, email, role}});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"});
    }
}

// User Login
const login = async (req, res) =>{
    try {
        const {email, password} = req.body;
        if(!email || !password){
             console.log("Received in backend:", req.body);
        return res.status(400).json({message:"Email and password are required"});
        }

        const user = await AuthModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRETKEY, {
            expiresIn:"7d"
        })
        res.cookie("token", token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        return res.status(200).json({
        message: "Login Successful 👍",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"});
    }
}

// User Logout
const logout = async (req, res) =>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure:true,
            sameSite:"Strict",
        })
        return res.status(200).json({message:"Logout Successful ✅"});

    } catch (error) {
        res.json({message:"Server error"});
        console.log(error)
    }
} 

// Users Data
const getUserData =async(req, res) =>{

    try {

        const {id} = req.params;

        const UserData = await AuthModel.findById(id).select("-password");
        if(!UserData){
            return res.status(404).json({message:"User not found"});

    }
        return res.status(200).json(UserData);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Server error"});

    }
}

export {register, login, logout, getUserData};