const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/object',{});
const conn=mongoose.connection;
conn.on('error',function(){
	console.log("数据库连接错误！");
});
conn.once('open',function(){
	console.log("数据库连接成功");
})
