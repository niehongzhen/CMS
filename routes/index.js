//前台页面路由配置文件
var router = require('koa-router')();
var url = require('url');


//引入自定义的模块
var Db = require('../model/db.js');
var tools = require('../model/tools.js');


//应用中间件
router.use(async (ctx, next) => {
    var host = ctx.request.header.host;
    var pathname = url.parse(ctx.request.url).pathname;

    //连接数据库，渲染导航
    var navList = await Db.find('nav', {}, {}, {
        sortJson: {
            'sort': 1
        }
    });
    //logo图标
    var setting = await Db.find('setting', {});

    //友情链接
    //核心产品
    var productLink = await Db.find('link', {'pid': '5b6c02b58f80b61644cf2606'}, {}, {
        sortJson: {
            'sort': 1
        }
    });

    //企业服务
    var companyServer = await Db.find('link', {'pid': '5b6c03048f80b61644cf2607'}, {}, {
        sortJson: {
            'sort': 1
        }
    });

    //二维码
    var connectList = await Db.find('article', {'pid': '5b6be34aaa72cc189c88fd51'}, {}, {
        sortJson: {
            'sort': 1
        }
    });

    ctx.state.navList = navList;
    ctx.state.site_logo = setting[0].site_logo;
    ctx.state.site_icp = setting[0].site_icp;
    ctx.state.site_email = setting[0].site_email;
    ctx.state.connectList = connectList;
    ctx.state.productLink = productLink;
    ctx.state.companyServer = companyServer;

    ctx.state.G = {
        host: 'http://' + host,//绝对路径
        url: pathname,
        title: '模拟百度教育'
    }
    await next();
})

//最新资讯
router.get('/', async (ctx) => {
    //渲染轮播图
    var sliderList = await Db.find('slider', {}, {}, {
        sortJson: {
            'sort': 1
        }
    });

    await ctx.render('web/index', {
        sliderList,
    });
});

//教育理念
router.get('/concept', async (ctx) => {
    var titleData = await Db.find('article', {'pid': '5b6bb54ef9f2a41bccf653bf'});
    var conceptList = await Db.find('article', {'pid': '5b6bb575f9f2a41bccf653c0'}, {}, {
        sortJson: {
            'sort': 1
        }
    });

    await ctx.render('web/concept', {
        titleList: titleData[0],
        conceptList
    });
});

//教育优势
router.get('/advantage', async (ctx) => {
    //连接数据库，获取内容
    var titleData = await Db.find('article', {'pid': '5b6bb6c444ae3a21e4c5e781'});
    var advantageList = await Db.find('article', {'pid': '5b6bb6ee44ae3a21e4c5e782'}, {}, {
        sortJson: {
            'sort': 1
        }
    })
    await ctx.render('web/advantage', {
        titleList: titleData[0],
        advantageList
    });
});

//机构服务
router.get('/service', async (ctx) => {
    var serviceList = await Db.find('article', {'pid': '5b6ba38eb161ca160c7a37cd'}, {}, {
        sortJson: {
            'sort': 1
        }
    });
    await ctx.render('web/service', {
        serviceList
    });
});

//战略合作
router.get('/cooperation', async (ctx) => {
    if(!ctx.query.pid){//初始化的时候，默认获取文库商务合作的数据
        ctx.request.url='/cooperation?pid=5b7128cb718eb822b4458f0f';
    }
    var pid = ctx.query.pid;
    var list = await Db.find('article', {'pid': pid}, {}, {
        sortJson: {
            'sort': 1
        }
    });

    await ctx.render('web/cooperation', {
        list,
        catename:list[0].catename
    })
});


module.exports = router.routes();