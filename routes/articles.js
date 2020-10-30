const express=require('express');
let router = express.Router();
let articleModel=require('../db/articleModel');
const fs = require('fs');
const path = require('path');
var multiparty = require('multiparty');
/*
/articles
/articles
/articles/upload|文件上传业务|post|file|json|{err:0,msg:'图片路径'}
*/
///write|文章修改和新增业务|post|title,content,username,id|重定向|有id是修改业务,无id是新增业务,成功重定向/,失败重定向/write
router.post('/write',function(req,res){
	let {title,content,id}=req.body;
	let username=req.session.username;
	let setTime=Date.now();
	if(id){
		id=new Object(id);
		articleModel.updateOne({_id:id},{$set:{title,content,setTime,username}})
		.then(tet=>{
				res.redirect('/');
		})
		.catch(tet=>{
			res.redirect('/write');
		})
	}else{
		articleModel.insertMany({title,content,username,setTime})
		.then(tet=>{
			res.redirect('/');
		})
		.catch(err=>{
			res.redirect('/write');
		})
	}
});

//  /delete|文章删除业务|get|id|重定向|失败成功都重定向到/
router.get('/delete',function(req,res){
	
	let id=new Object(req.query.id);
	console.log(id);
	articleModel.deleteOne({_id:id})
	.then(tet=>{
		res.redirect('/');
	}).catch(err=>{
		res.redirect('/');
	})
})

router.post('/upload',(req,res,next)=>{
    // 每次访问该接口,都新建一个form对象来解析文件数据
    var form = new multiparty.Form();
    form.parse(req,(err,field,files)=>{
        if(err){
            console.log('文件上传失败')
        }else{
            // console.log('----field-----')
               console.log(field);
            var file = files.filedata[0];
//             console.log('----file-----')
//             console.log(files)
            // 读取流
            var read = fs.createReadStream(file.path);
            // 写入流
            var write = fs.createWriteStream(path.join(__dirname,"..",'public/imgs/',file.originalFilename))
//          // 管道流,图片写入指定目录
            read.pipe(write);
            write.on('close',function(){
                console.log('图片上传完成')
                res.send({
                    err:0,
                    msg:'/imgs/'+file.originalFilename
                })
            })
        }
    })
})
module.exports=router;
