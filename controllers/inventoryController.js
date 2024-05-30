const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel")

const createInventoryController=async(req,res)=>{
    try {
        const {email}=req.body;
        const user=await userModel.findOne({email})
        if(!user){
            throw new Error('User Not Found');
        }
        // if(inventoryType==="in" && user.role!=='donar'){
        //     throw new Error('Not a donar account');
        // }
        // if(inventoryType==="out" && user.role!=='hospital'){
        //     throw new Error('Not a hospital');
        // }

        if(req.body.inventoryType=='out')
        {
            const requestedBloodGroup=req.body.bloodGroup;
            const requestedQuantityOfBlood=req.body.quantity;
            const organisation=new mongoose.Types.ObjectId(req.body.userId);
            // calculate blood quantity

            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {$match:{
                    organisation,
                    inventoryType:'in',
                    bloodGroup:requestedBloodGroup
                }},
                {
                    $group:{
                        _id:'$bloodGroup',
                        total:{$sum:'$quantity'}
                    }
                }
            ])
            // console.log("total In:" , totalInOfRequestedBlood);
            const totalIn=totalInOfRequestedBlood[0]?.total || 0;
            // Calculate out blood quantity

            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {$match:{
                    organisation,
                    inventoryType:'out',
                    bloodGroup:requestedBloodGroup
                }},
                {
                    $group:{
                        _id:'$bloodGroup',
                        total:{$sum:'$quantity'}
                    }
                }
            ])
            const totalOut=totalOutOfRequestedBloodGroup[0]?.total || 0;
            // console.log("total Out:" , totalOutOfRequestedBloodGroup);
            // In and out Calculate

            const availableQuantityOfBloodGroup=totalIn-totalOut;

            // quantity validation
            if(availableQuantityOfBloodGroup < requestedQuantityOfBlood){
                return res.status(500).send({
                    success:false,
                    message:`Only ${availableQuantityOfBloodGroup} ML of ${requestedBloodGroup.toUpperCase()} is available`
                })
            }
            req.body.hospital=user?._id;
            
        }else{
            req.body.donar=user?._id;
        }

        const inventory=new inventoryModel(req.body)
        await inventory.save();
        return res.status(201).send({
            success:true,
            message:'New Blood Record Added'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            sucess:false,
            message:'Error in create inventory api',
            error
        })
    }
}

//  Get All Blood Records
const getInventoryController=async(req,res)=>{
    try {
    // console.log("getInventory: "+req.body.userId);
    const inventory =await inventoryModel.find({organisation:req.body.userId}).populate("donar").populate('hospital').sort({createdAt: -1})
    return res.status(200).send({
        success:true,
        message:"Got All records Successfully",
        inventory
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
        success:false,
        message:'Error in Getting All inventory',
        error,
    })
  }
};


// Get Hospital Blood Records
const getInventoryHospitalController=async(req,res)=>{
    try {
    // console.log("getInventory: "+req.body.userId);
    const inventory =await inventoryModel.find(req.body.filters).populate("donar").populate('hospital').populate('organisation').sort({createdAt: -1})
    return res.status(200).send({
        success:true,
        message:"Got hospital consumer records successfully",
        inventory
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).send({
        success:false,
        message:'Error in Getting consumer inventory',
        error,
    })
  }
};

//  get Blood Records of 3

const getRecentInventoryController=async(req,res)=>{
    try {
        const inventory =await inventoryModel.find({organisation:req.body.userId}).sort({createdAt: -1}).limit(3)
        return res.status(200).send({
            success:true,
            message:"Got Recent 3 Inventory records Successfully",
            inventory
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Getting Recent 3 inventory records',
            error,
        })
    }
}


// Get Donar Record
const getDonarsController=async (req,res)=>{
    try {
        const organisation=req.body.userId;
        // cout
        // find donar
        console.log("getdonarcontroller",organisation);
        
        const donarId=await inventoryModel.distinct("donar",{
            organisation
        });
        console.log("getdonarcontroller donarId",donarId);
        
        const donars=await userModel.find({_id:{$in:donarId}})

        return res.status(200).send({
            success:true,
            message:"Got All Donars Successfully",
            donars,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            sucess:false,
            message:'Error in  Donar records',
            error
        })
    }
}


const getHospitalController = async(req,res)=>{
    try {
        const organisation=req.body.userId;
        // Get Hospital ID
        const hospitalId=await inventoryModel.distinct('hospital',{organisation})
        
        console.log("get Hospital orgId", hospitalId);
        // Find Hospital
        const hospitals=await userModel.find({_id:{$in:hospitalId}})
        return res.status(200).send({
            success:true,
            message:"Got All Hospitals Successfully",
            hospitals,
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in  Hospital records',
            error
        })
    }
}


// Get O Rg Profile

const getOrganisationController=async(req,res)=>{
    try {
        const donar=req.body.userId;
        // console.log("Get organisation donar id:",donar);
        const orgId=await inventoryModel.distinct('organisation',{donar})
        // console.log("get organisation orgId", orgId);
        // find Org
        
        const organisations=await userModel.find({_id:{$in:orgId}});
        // console.log("Organisations", organisations);
        return res.status(200).send({
            success:true,
            message:"Got All Organisations Successfully",
            organisations,
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            sucess:false,
            message:'Error in organisation records ',
            error
        })
    }
    
}

// Get ORg for hospital

const getOrganisationForHospitalController=async(req,res)=>{
    try {
        const hospital=req.body.userId;
        // console.log("Get organisation donar id:",donar);
        const orgId=await inventoryModel.distinct('organisation',{hospital})
        // console.log("get organisation orgId", orgId);
        // find Org
        
        const organisations=await userModel.find({_id:{$in:orgId}});
        // console.log("Organisations", organisations);
        return res.status(200).send({
            success:true,
            message:"Got All Hospital Organisations data Successfully",
            organisations,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            sucess:false,
            message:'Error in hospital organisation records ',
            error
        })
    }

}

module.exports={getRecentInventoryController,createInventoryController,getInventoryHospitalController,getOrganisationForHospitalController, getInventoryController,getDonarsController,getOrganisationController,getHospitalController}