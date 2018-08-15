//引入中间件
var router = require('koa-router')();

//引入自定义模块
var Db = require('../../model/db.js');
var tools = require('../../model/tools.js');


router.get('/', async (ctx)=>{
    //连接数据库，获取列表数据
    var data = await Db.find('articlecate',{});
    var list = tools.cateTolist(data);
    await ctx.render('admin/articlecate/list',{
        list:list
    });
});

router.get('/add',async (ctx)=>{
    //连接数据库，获取分类列表数据
    var data = await Db.find('articlecate',{});
    var firstList = tools.cateTolist(data);
    await ctx.render('admin/articlecate/add',{
        list:firstList
    });
});

//增加分类的方法
router.post('/doAdd',async (ctx)=>{
    var data = ctx.request.body;
//    连接数据库，增加新分类
    var data = await Db.insert('articlecate',data);
    try{
        if(data.result.ok){//数据增加成功
            ctx.body = '<script>alert("增加成功！");location.href="/admin/articlecate";</script>'
        }
    }catch(err){
        console.log(err);
    }
});

//编辑分类页面
router.get('/edit',async (ctx)=>{
    var _id = ctx.query._id;
    var editList = await Db.find('articlecate',{'_id':Db.getObjectId(_id)});
    var firstList = await Db.find('articlecate',{'pid':'0'});
    await ctx.render('admin/articlecate/edit',{
        list:editList[0],
        firstList:firstList
    })
});

//编辑分类页面保存
router.post('/doEdit',async (ctx)=>{
    var data = ctx.request.body;
    var _id = data._id,
        title = data.title,
        pid = data.pid,
        keywords = data.keywords,
        description = data.description;
//    连接数据库，更新内容
    var updateResult = await Db.update('articlecate',{'_id':Db.getObjectId(_id)},{
        title,pid,keywords,description
    });
    try{
        if(updateResult.result.ok){//更新成功
            ctx.body = '<script>alert("保存成功！");location.href="/admin/articlecate";</script>'
        }

    }catch(err){
        console.log(err);
    }
});



//暴露路由
module.exports = router.routes();