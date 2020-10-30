var express = require('express');
var articleModel=require('../db/articleModel');
var router = express.Router();
var moment=require('moment');


//|编译index.ejs模板|get|page,size|返回index页面|无
router.get('/', function(req, res) {
	let page=parseInt(req.query.page||1);
	let size=parseInt(req.query.size||3);
	let username=req.session.username;
		articleModel.find().count().then(cou=>{
			let pages=Math.ceil(cou/size);
			articleModel.find().sort({'setTime':-1}).skip((page-1)*size).limit(size)
			.then(doc=>{
				var arr = doc.slice();
				for(let i=0; i<arr.length; i++){
					arr[i].newsetTime=moment(arr[i].setTime).format('YYYY-MM-DD HH-mm-ss');
				};
				res.render('index', {
					data:{
						list:arr,
						total:pages,
						username:username
					}
				});
			});
			
		})
  
});

//regist|编译regist.ejs模板|get|无|返回regist页面|无
router.get('/regist',function(req,res){
	res.render('regist', {});
});

//login|编译login.ejs模板|get|无|返回login页面|无
router.get('/login',function(req,res){
	res.render('login', {});
});

//write|编译wrtie.ejs模板|get|id|返回write页面|登陆后访问,有id是编辑页,无id是新增页
router.get('/write',function(req,res){
	let username=req.session.username;
	let id=req.query.id;
	if(id){
		id=new Object(id);
		articleModel.findById(id).then(tet=>{
			res.render('write', {
				data:{
					title:tet.title,
					content:tet.content,
					username:username,
					id:tet._id
				}
			});
		})
	}else{
		res.render('write', {
				data:{
					username:username
				}
			});
	}
});

//detail|编译detail.ejs模板|get|id|返回detail页面|无
router.get('/detail', function(req, res, next) {
	let username=req.session.username;
	let id=req.query.id;
	id=new Object(id);
	articleModel.findById(id).then(tet=>{
		let setTime=moment(tet.setTime).format('YYYY-MM-DD hh-mm-ss');
		 res.render('detail', {
		 	data:{
		 		username:username,
		 		title:tet.title,
		 		content:tet.content,
		 		setTime:setTime,
		 		author:tet.username
		 	}
		 });
	})
 
});

module.exports = router;
