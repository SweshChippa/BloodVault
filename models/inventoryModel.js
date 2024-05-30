const mongoose = require('mongoose')

const inventorySchema=new mongoose.Schema({
    inventoryType:{
        type:String,
        required:[true,'inventory type require'],
        enum:["in","out"]
    },
    bloodGroup:{
        type:String,
        require:[true,'Blood group is required'],
        enum:['O+','O-','AB+','AB-','A+','A-','B+','B-']
    },
    quantity:{
        type:Number,
        required:[true,'Blood quantity is require']
    },
    email:{
        type:String,
        required:[true,'Donar email is required']
    },
    organisation:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'organisaion is require']
    },
    hospital:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:function(){
            return this.inventoryType==="out"
        }
    },
    donar:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:function(){
            return this.inventoryType==="in"
        }
    } 
},{timestamps:true});

module.exports = mongoose.model("Inventory",inventorySchema)