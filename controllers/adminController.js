const userModel = require("../models/userModel");

// Get donar List
const getDonarListController= async(req,res)=>{
    try {
        const donarData = await userModel.find({role:'donar'}).sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            Totalcount:donarData.length,
            message:'Got Donar List Successfully',
            donarData,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success:false,
            message:'Error in getting donar list in admin controller API',
            error,
        })
    }

}


// Get Hospital List
const getHospitalListController= async(req,res)=>{
    try {
        const hospitalData = await userModel.find({role:'hospital'}).sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            Totalcount:hospitalData.length,
            message:'Got Hospital List Successfully',
            hospitalData,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success:false,
            message:'Error in getting Hospital list in admin controller API',
            error,
        })
    }

}

// Get org List
const getOrgListController= async(req,res)=>{
    try {
        const orgData = await userModel.find({role:'organisation'}).sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            Totalcount:orgData.length,
            message:'Got organisation List Successfully',
            orgData,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success:false,
            message:'Error in getting organisation list in admin controller API',
            error,
        })
    }

}

// Delete Donar

const deleteDonarController= async(req,res)=>{
    try {
        const donarData = await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success:true,
            message:'Donar Record Successfully',
            donarData,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            success:false,
            message:'Error in deleting record admin controller API',
            error,
        })
    }

}





module.exports={deleteDonarController,getOrgListController,getHospitalListController,getDonarListController}