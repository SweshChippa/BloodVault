const userModel = require('./../models/userModel');

module.exports = async(req,res,next)=>{
    try {
        const user=  await userModel.findById(req.body.userId);
        // check admin
        if(user?.role !== 'admin'){
            return res.status(401).send({
                success:false,
                message:"auth admin Middleware API",
                error
            })
        }else{
            next();
        }
        
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success:false,
            message:"error in admin Middleware API",
            error
        })
    }
}