const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
	username:String,
	password:String,
	setTime:Number
});
const userModel=mongoose.model('users',userSchema);
module.exports=userModel;
