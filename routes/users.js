var express = require('express');
var router = express.Router();
var userModel=require('../db/userModel');
var bcrypt=require('bcrypt')


//  /regist|注册业务|post|username,password,password2|重定向|注册成功重定向到/login,失败重定向到/regist
router.post('/regist', function(req, res) {
  let {username,password,password2}=req.body;
  password=bcrypt.hashSync(password,10);
  userModel.find({username})
  .then(function(tet){
  	if(tet.length>0){
  		res.redirect('/regist');
  	}else{
  		let setTime=Date.now();
  		userModel.insertMany({username,password,setTime}).then(function(tet){
  			res.redirect('/login');
  		}).catch(function(err){
  			res.redirect('/regist');
  		})
  	}
  });
  
});

//  /login|登陆业务|post|username,password|重定向|登陆成功重定向到/,失败重定向到/login
router.post('/login',function(req,res){
	let {username,password}=req.body;
	userModel.find({username}).then(tet=>{
		if(tet.length>0){
			if(bcrypt.compareSync(password,tet[0].password)){
				req.session.username = username
	      req.session.isLogin = true; 
	      res.redirect('/');
			}else{
				res.redirect('/login');
			};
		}else{
			res.redirect('/login');
		};
	})
	.catch(function(){
        // res.send('登陆失败')
        res.redirect('/login')
   });
});

//  /logout|退出登陆业务|get|无|重定向|退出登陆后重定向到/login
router.get('/logout',function(req,res){
	req.session.username = null;
  req.session.isLogin = false; 
  console.log(req.session);
  res.redirect('/login');
})

module.exports = router;
