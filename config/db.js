const mongoose =require("mongoose");
const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
        console.log(`Connected to mongodo database ${mongoose.connection.host}`);
    }
    catch(error)
    {
        console.log(`mongoose Database error ${error}`)
    }
}

module.exports=connectDB;