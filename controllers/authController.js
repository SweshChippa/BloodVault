const userModel = require("../models/userModel");
const bcrypt =require('bcryptjs')
const jwt=require('jsonwebtoken');
const registerController=async (req,res)=>{
    try {
        const existingUser = await userModel.findOne({email:req.body.email})
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'User Already Exists'
            })
        }
        // hashed password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(req.body.password,salt)
        req.body.password=hashedPassword
        // rest data
        const user = new userModel(req.body)
        await user.save()
        return res.status(201).send({
            success:true,
            message:'User Registered Succesfully',
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Register API',
            error
        })
    }
}


const loginController=async (req,res)=>{
    try {
        const existingUser=await userModel.findOne({
            email:req.body.email
        })
        if(!existingUser)
        {
            return res.status(404).send({
                success:false,
                message:"Invalid Credentials"
            })
        }
        // check Role
        if(existingUser.role!=req.body.role){
            return res.status(500).send({
                success:false,
                message:'Role Does not match'
            })
        }
        const comparePassword=await bcrypt.compare(req.body.password,existingUser.password)
        if(!comparePassword){
            return res.status(500).send({
                success:false,
                message:"Invalid Credentials"
            })
        }
        const token =jwt.sign({userId:existingUser._id},process.env.JWT_SECRET,{expiresIn:'1d'})
        return res.status(200).send({
            success:true,
            message:"Login Successfully",
            token,
            existingUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"error in Login API",
            error
        })
        
    }
}

// Get current user

const currentUserController=async (req,res)=>{
    try {
        const user = await userModel.findOne({
            _id:req.body.userId
        })
        return res.status(200).send({
            success:true,
            message:'user Fetched Successfully',
            user
        })
    } catch (error) {
        return res.status(500).send({
            success:false,
            message:"unable to get current user",
            error
        })
        
    }
}

module.exports={registerController,loginController,currentUserController};