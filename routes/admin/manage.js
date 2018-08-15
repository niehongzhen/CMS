//用户页面路由
var router = require('koa-router')();
var sd = require('silly-datetime');//引入时间格式化的中间件

//引入自定义模块
var Db = require('../../model/db.js');//mongodb数据库模块
var tools = require('../../model/tools.js');//引入自定义的工具模块

router.get('/',async (ctx)=>{
    //查找管理员列表的数据
    var data = await Db.find('admin_user',{});
    //时间格式化的第一种方法：
    // data.forEach((item,index)=>{
    //     if(item.lastTime){
    //         item.lastTime = sd.format(item.lastTime, 'YYYY-MM-DD HH:mm');
    //     }
    // })
    //时间格式化的第二种方法：配置模板管道
    await ctx.render('admin/manage/list',{list:data});
})

//增加管理员页面
router.get('/add',async (ctx)=>{
    await ctx.render('admin/manage/add');
})

//检查管理员名字是否已经被注册
router.get('/checkName',async (ctx)=>{
    var userName = ctx.query.username;//获取传递的用户名参数
    var data = await Db.find('admin_user',{'username':userName});
    if(data.length > 0){//表示已经被注册
        ctx.body = false;
    }else{
        ctx.body = true;
    }
})

//增加管理员方法
router.post('/doAdd',async (ctx)=>{
    var userData = ctx.request.body;
//    将信息保存到数据库
    var data = await Db.insert('admin_user',{
        username:userData.username,
        password:tools.md5(userData.password),
        status:0
    });
    if(data.result.ok){//表示添加成功,跳转到管理员列表页面
        ctx.body = '<script>alert("增加成功！");location.href = "/admin/manage";</script>'
    }else{
        ctx.body = '<script>alert("增加失败，请重试！");location.href = "/admin/manage/add";</script>'
    }
});

//编辑管理员
router.get('/edit',async (ctx)=>{
    var _id = ctx.query.id;
    //查找数据
    var data = await Db.find('admin_user',{'_id':Db.getObjectId(_id)});
    if(data.length > 0){
        await ctx.render('admin/manage/edit',{
            list:data[0]
        });
    }else{
        ctx.body = '<script>alert("参数有误，请重试！");location.href="/admin/manage";</script>'
    }
});

//校验原密码和新密码是否一致
router.get('/checkPassword',async (ctx)=>{
    var _id = ctx.query._id;
    var oldPassword = ctx.query.password;
    var data = await Db.find('admin_user',{'_id':Db.getObjectId(_id)});
    if(data.length > 0){
        if(data[0].password == tools.md5(oldPassword)){//表示新旧密码一致
            ctx.body = false;
        }else{
            ctx.body = true;
        }
    }
});

//编辑管理员跳转
router.post('/doEdit',async (ctx)=>{
    var editData = ctx.request.body;
    var updateResult = await Db.update('admin_user',{'_id':Db.getObjectId(editData._id)},{
        'password':tools.md5(editData.password)
    });
    try{
        if(updateResult.result.ok){
            ctx.body = '<script>alert("保存成功！");location.href = "/admin/manage";</script>'
        }
    }catch(err){
        console.log(err);
    }
});

module.exports = router.routes();