//内容路由配置
var router = require('koa-router')();
var ueditor = require('koa2-ueditor');//富文本编辑器中的图片上传插件


//引入自定义模块
var Db = require('../../model/db.js');
var tools = require('../../model/tools.js');
var upload = require('../../model/multer.js');//图片、文件上传模块

router.get('/',async (ctx)=>{
    var page = ctx.query.page || 1;//当前第几页
    var pageSize = 8;//每页的数据条数
    var sortJson = {'last_time':-1};//表示降序排序

    //连接数据库获取内容
    var count = await Db.count('article',{});//查询到的总共的数据条数
    var totalPages = Math.ceil(count/pageSize);//总页数，向上取整
    var currentPage = page;//当前第几页

    var dataList = await Db.find('article',{},{},{
        page,pageSize,sortJson
    });
    await ctx.render('admin/article/list',{
        list:dataList,
        totalPages:totalPages,
        currentPage:currentPage
    });
});
router.get('/add',async (ctx)=>{
    //读取分类数据表,渲染分类名称
    var cateData = await Db.find('articlecate',{});
    var cateList = tools.cateTolist(cateData);
    await ctx.render('admin/article/add',{
        cateList
    });
});

//内容提交
router.post('/doAdd', upload.single('img_url'),async (ctx)=>{//upload.single()中的值和图片的name一致
    var fileData = ctx.req.file;//上传的文件或者图片相关的信息
    var bodyData = ctx.req.body;//post提交的其他信息
    //[注]：必须用req

    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    let title=ctx.req.body.title.trim() || '';
    let author=ctx.req.body.author.trim() || '';
    let sort = Number(ctx.req.body.sort);
    let link = ctx.req.body.link;
    let status=ctx.req.body.status;
    let is_best=ctx.req.body.is_best;
    let is_hot=ctx.req.body.is_hot;
    let is_new=ctx.req.body.is_new;
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file? ctx.req.file.path.substr(7) : '';
    let last_time = tools.getTime();

    let data={
        pid,catename,title,author,sort,link,status,is_best,is_hot,is_new,keywords,description,content,img_url,
        last_time
    }

//    保存到数据库，并且跳转到内容列表页
    var insertResult = await Db.insert('article',data);
    try{
        if(insertResult.result.ok){
            ctx.body = '<script>alert("添加成功!");location.href = "/admin/article";</script>'
        }
    }catch(err){
        console.log(err);
    }
});

//编辑页面
router.get('/edit',async (ctx)=>{
    //读取数据，渲染分类列表
    var cateList = tools.cateTolist(await Db.find('articlecate',{}));
    let _id = ctx.query.id;
//    查找数据
    let list = await Db.find('article',{'_id':Db.getObjectId(_id)});

    await ctx.render('admin/article/edit',{
        cateList,
        list:list[0]
    });
});

//编辑页面保存
router.post('/doEdit',upload.single('img_url'),async (ctx)=>{
    let _id = ctx.req.body._id;
    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    let title=ctx.req.body.title.trim() || '';
    let author=ctx.req.body.author.trim() || '';
    let sort = Number(ctx.req.body.sort);
    let link = ctx.req.body.link;
    let status=ctx.req.body.status;
    let is_best=ctx.req.body.is_best;
    let is_hot=ctx.req.body.is_hot;
    let is_new=ctx.req.body.is_new;
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file? ctx.req.file.path.substr(7) : '';
    let last_time = tools.getTime();

    if(ctx.req.file){
        var data={
            pid,catename,title,author,sort,link,status,is_best,is_hot,is_new,keywords,description,content,img_url,
            last_time
        }
    }else{
        var data={
            pid,catename,title,author,sort,link,status,is_best,is_hot,is_new,keywords,description,content,last_time
        }
    }

    var updateResult = await Db.update('article',{'_id':Db.getObjectId(_id)},data);
    try{
        if(updateResult.result.ok){
            ctx.body = '<script>alert("编辑成功！");location.href="/admin/article";</script>'
        }
    }catch(err){
        console.log(err);
    }
})

//富文本编辑器图片上传的路由配置(要和ueditor.config.js文件中的服务器接口路径一致,存放图片的静态文件夹名称要和自己项目中的一致)
router.all('/editor/controller', ueditor(['static', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))



module.exports = router.routes();