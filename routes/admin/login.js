//用户页面路由
var router = require('koa-router')();
var md5 = require('md5-node');//引入md5-node加密的中间件
var svgCaptcha = require('svg-captcha');//验证码的中间件



//引入自定义的模块
var Db = require('../../model/db.js');//mongodb数据库方法
var tools = require('../../model/tools.js')


//登录页面
router.get('/',async (ctx)=>{
    await ctx.render('admin/login');
});

//登录跳转
router.post('/dologin',async (ctx)=>{
    var userInfo = ctx.request.body;
    var code = ctx.session.code;//获取生成的验证码
//    对比用户输入的验证码和生成的验证码
    if(userInfo.code.toLocaleLowerCase() == code.toLocaleLowerCase()){//验证码一致则再去数据库进行查询
        //    和数据库中的信息进行对比
        var data = await Db.find('admin_user',{'username':userInfo.username,'password':tools.md5(userInfo.password)});
        if(data.length > 0){//存在，跳转到首页并且设置session
            //判断权限状态
            if(data[0].status == 1){//表示允许登录
                //跳转到首页之前，更新用户的最后登录时间
                await Db.update('admin_user',{'_id':Db.getObjectId(data[0]._id)},{'lastTime':new Date()});
                //跳转到首页
                ctx.redirect('/admin');
                //设置session
                ctx.session.userinfo = data[0];
            }else{
                ctx.body = '<script>alert("对不起，该用户没有登录权限！");location.href="/admin/login";</script>'
            }
        }else{
            ctx.body = '<script>alert("用户名或密码错误，请重试！");location.href="/admin/login";</script>';
        }
    }else{
        ctx.body = '<script>alert("验证码输入有误！");location.href="/admin/login";</script>'
    }

})

//生成验证码
router.get('/code',async (ctx)=>{
    var captcha = svgCaptcha.create({
        size:4,
        fontSize:50,
        width:120,
        height:34,
        background:'#cc9966'
    })
    ctx.session.code = captcha.text;//存储在session中，在表单提交的时候和用户输入的验证码进行对比
    ctx.response.type = 'image/svg+xml';//设置响应头
    ctx.body = captcha.data;//显示在页面上
})

//退出登录
router.get('/loginOut',async (ctx)=>{
    ctx.session.userinfo = null;
    ctx.redirect('/admin/login');
})

module.exports = router.routes();