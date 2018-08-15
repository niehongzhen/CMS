//轮播图路由
var router = require('koa-router')();

//引入自定义的模块
var Db = require('../../model/db.js');
var tools = require('../../model/tools.js');
var upload = require('../../model/multer');

//轮播图列表页
router.get('/',async (ctx)=>{
    var page = ctx.query.page || 1;//当前页码
    var pageSize = 3;
    var sortJson = {'upload_time':-1};//按上传时间降序排序

    var count = await Db.count('slider',{});
    var totalPages = Math.ceil(count/pageSize);//总页数
    var list = await Db.find('slider',{},{},{//查询的数据
        page,pageSize,sortJson
    });

    await ctx.render('admin/slider/list',{
        list,
        currentPage : page,
        totalPages
    });
});

//轮播图增加页面
router.get('/add', async (ctx)=>{
    await ctx.render('admin/slider/add');
});

//轮播图增加提交
router.post('/doAdd', upload.single('pic'),async (ctx)=>{
    var fileData = ctx.req.file;
    var bodyData = ctx.req.body;

    let title = bodyData.title.trim();
    let url = bodyData.url.trim();
    let status = bodyData.status;
    let upload_time = tools.getTime();//上传时间
    var sort = Number(bodyData.sort);
    let pic = fileData?fileData.path.substr(7):'';

    var insertResult = await Db.insert('slider',{
        title,url,status,upload_time,sort,pic
    });
    try{
        if(insertResult.result.ok){
            ctx.body = '<script>alert("增加成功！");location.href="/admin/slider";</script>'
        }
    }catch(err){
        console.log(err);
    }
});

//编辑页面
router.get('/edit',async (ctx)=>{
    var _id = ctx.query.id;
    var list = await Db.find('slider',{'_id':Db.getObjectId(_id)});
    await ctx.render('admin/slider/edit',{
        list:list[0]
    });
});

router.post('/doEdit', upload.single('pic'), async (ctx)=>{
    var fileData = ctx.req.file;
    var bodyData = ctx.req.body;

    let _id = bodyData._id;
    let pic = fileData?fileData.path.substr(7) : '';
    let title = bodyData.title.trim();
    let url = bodyData.url.trim();
    let status = bodyData.status;
    let upload_time = tools.getTime();
    let sort = Number(bodyData.sort);

    if(fileData){//图片被修改了
        var data = {
            title,url,status,pic,upload_time,sort
        }
    }else{//图片没有被修改
        var data = {
            title,url,status,upload_time
        }
    }

    //连接数据库，更新数据
    var updateResult = await Db.update('slider',{'_id':Db.getObjectId(_id)},data);
    try{
        if(updateResult.result.ok){
            ctx.body = '<script>alert("保存成功！");location.href="/admin/slider";</script>'
        }
    }catch(err){
        console.log(err);
    }
})


module.exports = router.routes();
