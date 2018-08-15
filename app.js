//配置文件
//引入文件
var Koa = require('koa');
var path = require('path');
var router = require('koa-router')();
var render = require('koa-art-template');
var static = require('koa-static');
var bodyParser = require('koa-bodyparser');
var session = require('koa-session');
var sd = require('silly-datetime');//引入时间格式化的中间件
var jsonp = require('koa-jsonp');//前台页面进行ajax请求的中间件


//实例化Koa
var app = new Koa();

//配置koa-art-template中间件
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production',
    dateFormat: dateFormat = (value) => {//模板管道
        return sd.format(value, 'YYYY-MM-DD HH:mm');
    }
});

// app.use(static('.'));//容易暴露根目录下的文件，不推荐，可以使用字符串截取
//配置静态资源koa-static
app.use(static('static'));


//配置获取post传值的中间件koa-bodyparser
app.use(bodyParser());

///配置koa-session开始
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    maxAge: 864000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true, //每次操作时都会重置cookie,而不是在快到期时才重置cookie
    renew: false //表示每次cookie快到期时则重置cookie
};
app.use(session(CONFIG, app));
//配置session 结束

//配置koa-jsonp
app.use(jsonp());


//引入路由
var admin = require('./routes/admin.js');
var index = require('./routes/index.js');
var api = require('./routes/api.js');

router.use(index);
router.use('/admin', admin);
router.use('/api', api);

app
    .use(router.routes())//启动路由
    .use(router.allowedMethods());//设置response响应头，可以不写，但是推荐写上

app.listen(8001);


