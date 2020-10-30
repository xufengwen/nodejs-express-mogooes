const mongoose=require('mongoose');
const articleSchema=mongoose.Schema({
	title:String,
	content:String,
	setTime:Number,
	username:String
});
const articleModel=mongoose.model('articles',articleSchema);
module.exports=articleModel;
