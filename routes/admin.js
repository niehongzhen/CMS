//后台路由配置文件
var router = require('koa-router')();//引入并实例化路由
var url = require('url');


//引入自定义模块
var Db = require('../model/db.js');


//进入后台页面之前的中间件
router.use(async (ctx,next)=>{
    //模板引擎配置admin中的全局变量host
    var host = ctx.request.header.host;
    ctx.state.host = 'http://' + host;

    //获取session
    var session = ctx.session.userinfo;

    //获取当前的地址
    var pathname = url.parse(ctx.request.url).pathname.slice(1);

    //根据当前的url进行左侧边栏的选中
    var splitUrl = pathname.split('/');

    //友情链接和导航的个数
    //友情链接和导航的个数
    var linkCount = await Db.count('link',{});
    var navCount = await Db.count('nav',{});

    ctx.state.G = {
        url:splitUrl,
        prevPage:ctx.request.headers['referer'],//上一个页面的地址
        linkNum:linkCount,
        navNum:navCount
    }

//进入页面的权限判断
    if(session){//权限存在
        ctx.state.username = session.username;
        if(pathname == 'admin/login' || pathname == 'admin/login/dologin'){//如果是登录的url，则跳转到首页
            ctx.redirect('/admin');
        }else{
            await next();
        }
    }else{//权限不存在
        if(pathname == 'admin/login' || pathname == 'admin/login/dologin' ||
            pathname == 'admin/register' || pathname =='admin/register/doRegister' ||
            pathname == 'admin/login/code'){
            await next();
        }else{
            ctx.redirect('/admin/login');
        }
    }
});


var index = require('./admin/index.js');//公共路由
var login = require('./admin/login.js');//登录
var manage = require('./admin/manage.js');//管理员
var articlecate = require('./admin/articlecate.js');//内容分类
var article = require('./admin/article.js');//内容
var slider = require('./admin/slider.js');//轮播图
var link = require('./admin/link.js');//友情链接
var nav = require('./admin/nav.js');//导航
var setting = require('./admin/setting.js');//系统设置
var user = require('./admin/user.js');
var product = require('./admin/product');//商品管理

router.use(index);
router.use('/login',login);
router.use('/manage',manage);
router.use('/articlecate',articlecate);
router.use('/article',article);
router.use('/slider',slider);
router.use('/link',link);
router.use('/nav',nav);
router.use('/setting',setting);
router.use('/user',user);
router.use('/product',product);




//暴露路由
module.exports = router.routes();