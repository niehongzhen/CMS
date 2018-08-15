//友情链接路由
var router = require('koa-router')();

//引入自定义模块
var Db = require('../../model/db.js');
var tools = require('../../model/tools.js');



//分类列表
router.get('/catelist',async (ctx)=>{
    var data = await Db.find('linkcate',{});
    var list = tools.cateTolist(data);
    await ctx.render('admin/link/catelist',{
        list
    });
});

//增加分类
router.get('/addcate',async (ctx)=>{
    var cateList = await Db.find('linkcate',{});
    var list = tools.cateTolist(cateList);
    await ctx.render('admin/link/addcate',{
        list
    });
});

//提交‘增加分类’
router.post('/cateAdd',async (ctx)=>{
    var bodyData = ctx.request.body;
    let title = bodyData.title;
    let pid = bodyData.pid;
    let keywords = bodyData.keywords;
    let status = bodyData.status;
    let description = bodyData.description;
    var data = {
        title,pid,keywords,status,description
    }
    var insertResult = await Db.insert('linkcate',data);
    try{
        if(insertResult.result.ok){
            ctx.body = '<script>alert("增加成功！");location.href="/admin/link/catelist";</script>'
        }
    }catch(err){
        console.log(err);
    }
});

//编辑分类
router.get('/editcate',async (ctx)=>{
    var _id = ctx.query._id;
    var cateData = await Db.find('linkcate',{});
    var cateList = tools.cateTolist(cateData);
    var data = await Db.find('linkcate',{'_id':Db.getObjectId(_id)});
    await ctx.render('admin/link/editcate',{
        list:data[0],
        cateList
    });
});

//保存编辑分类
router.post('/doEditCate', async (ctx)=>{
    var bodyData = ctx.request.body;
    let _id = bodyData._id;
    let title = bodyData.title;
    let pid = bodyData.pid;
    let keywords = bodyData.keywords;
    let status = bodyData.status;
    let description = bodyData.description;
    var data = {
        title,pid,keywords,status,description
    }
    var updateResult = await Db.update('linkcate',{'_id':Db.getObjectId(_id)},data);
    try{
      if(updateResult.result.ok){
          ctx.body = '<script>alert("保存成功！");location.href="/admin/link/catelist";</script>'
      }
    }catch(err){
        console.log(err);
    }
});

//友情链接列表
router.get('/',async (ctx)=>{
    var page = ctx.query.page || 1;//页码
    var pageSize = 8;//每页展示数
    var sortJson = {
        'add_time':-1 //根据添加时间降序排序
    }

    var count = await Db.count('link',{});//总条数
    var totalPages = Math.ceil(count/pageSize);//总页数
    var data = await Db.find('link',{},{},{
        page,pageSize,sortJson
    });
    await ctx.render('admin/link/list',{
        list:data,
        totalPages,
        currentPage:page
    });
});

//添加友情链接
router.get('/add',async (ctx)=>{
    //连接数据库，渲染所属分类
    var data = await Db.find('linkcate',{});
    var cateList = tools.cateTolist(data);
    await ctx.render('admin/link/add',{
        cateList
    });
});

//友情链接提交
router.post('/doAdd', async (ctx)=>{
    var bodyData = ctx.request.body;
    let linkName = bodyData.linkName.trim();
    let pid = bodyData.pid;
    let linkCate = bodyData.linkCate.trim();
    let linkUrl = bodyData.linkUrl.trim();
    let sort = Number(bodyData.sort);
    let add_time = tools.getTime();
    let status = bodyData.status;

    if(pid == '0'){
        linkCate = '';
    }
    var data = {
        linkName,pid,linkCate,linkUrl,sort,add_time,status
    }

    var insertResult = await Db.insert('link',data);
    try{
        if(insertResult.result.ok){
            ctx.body = '<script>alert("增加成功！");location.href="/admin/link";</script>'
        }
    }catch(err){
        console.log(err);
    }
});

//编辑友情链接
router.get('/edit', async (ctx)=>{
    var _id = ctx.query.id;
    var data = await Db.find('link',{'_id':Db.getObjectId(_id)});
    var cateList = await Db.find('linkcate',{});
    await ctx.render('admin/link/edit',{
        list:data[0],
        cateList
    })
});

//保存编辑页面
router.post('/doEdit', async (ctx)=>{
    var bodyData = ctx.request.body;
    let _id = bodyData._id;
    let linkName = bodyData.linkName.trim();
    let pid = bodyData.pid;
    let linkCate = bodyData.linkCate;
    let linkUrl = bodyData.linkUrl.trim();
    let sort = Number(bodyData.sort);
    let status = bodyData.status;
    let add_time = tools.getTime();
    if(pid == '0'){
        linkCate = '';
    }
    var data = {
        linkName,pid,linkCate,linkUrl,sort,status,add_time
    }

    var updateResult = await Db.update('link',{'_id':Db.getObjectId(_id)},data);
    try{
        if(updateResult.result.ok){
            ctx.body = '<script>alert("保存成功！");location.href="/admin/link";</script>'
        }
    }catch(err){
        console.log(err);
    }
})


module.exports = router.routes();