const mongoose=require("mongoose")
const RegisSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken: {
    type: String
  },
  tokenExpire: {
    type: Date
  }
})

const Regis = mongoose.model("Regis",RegisSchema);
module.exports=Regis;