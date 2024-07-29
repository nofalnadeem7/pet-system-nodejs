const mongoose=require("mongoose");
const petSchema=new mongoose.Schema({
    name:String,
    type:String,
    breed:String,
    price:Number 
});

module.exports=mongoose.model("petss",petSchema);