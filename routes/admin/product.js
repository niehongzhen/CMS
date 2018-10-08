//商品路由
var router = require('koa-router')();
var ueditor = require('koa2-ueditor');//富文本编辑器中的图片上传插件

//引入自定义模块
var Db = require('../../model/db.js');
var tools = require('../../model/tools.js');
var upload = require('../../model/multer.js');//图片、文件上传模块


//商品列表
router.get('/', async (ctx) => {
    var page = ctx.query.page || 1;//当前第几页
    var pageSize = 8;//每页的数据条数
    var sortJson = {'last_time':-1};//表示降序排序

    //连接数据库获取内容
    var count = await Db.count('product',{});//查询到的总共的数据条数
    var totalPages = Math.ceil(count/pageSize);//总页数，向上取整
    var currentPage = page;//当前第几页

    var dataList = await Db.find('product',{},{},{
        page,pageSize,sortJson
    });
    await ctx.render('admin/product/productlist/list',{
        list:dataList,
        totalPages:totalPages,
        currentPage:currentPage
    });
});

//搜索内容
router.get('/search', async (ctx)=>{
    var msg = ctx.query.msg;
    var page = ctx.query.page || 1;
    var pageSize = 8;
    var sortJson = {'last_time':-1};

    //根据搜索内容查询数据库
    var count = await Db.count('product',{title:{$regex:msg}});
    if(count > 0){
        var totalPages = Math.ceil(count/pageSize);//总页数
        var currentPage = page;

        var dataList = await Db.find('product',{title:{$regex:msg}},{},{
            page,pageSize,sortJson
        });

        await ctx.render('admin/product/productlist/search_list',{
            list:dataList,
            totalPages,
            currentPage
        });
    }else{
        await ctx.render('admin/product/productlist/no_data_tip');
    }
});

//增加商品
router.get('/add', async (ctx) => {
    let data = await Db.find('productcate', {});
    var cateList = tools.cateTolist(data);
    await ctx.render('admin/product/productlist/add', {
        cateList
    });
});

//提交'增加商品'
router.post('/doAdd', upload.single('img_url'), async (ctx) => {
    let cate_id=ctx.req.body.cate_id;
    let catename=ctx.req.body.catename.trim();
    let price = ctx.req.body.price;
    let title=ctx.req.body.title.trim() || '';
    let sort = Number(ctx.req.body.sort);
    let status=ctx.req.body.status;
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file? ctx.req.file.path.substr(7) : '';
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let last_time = tools.getTime();
    var data = {
        cate_id,catename,price,title,sort,status,content,img_url,last_time,keywords,description
    };

    let addResult = await Db.insert('product',data);
    try{
     if(addResult.result.ok){
         ctx.body = '<script>alert("增加成功！");location.href="/admin/product";</script>'
     }
    }catch(err){
        console.log(err);
    }
});

//编辑商品
router.get('/edit', async (ctx) => {
    let _id = ctx.query._id;
    let cateData = await Db.find('productcate',{});
    var cateList = tools.cateTolist(cateData);
    var list = await Db.find('product',{'_id':Db.getObjectId(_id)});
    await ctx.render('admin/product/productlist/edit',{
        list:list[0],
        cateList
    });
});

//保存'编辑商品'
router.post('/doEdit', upload.single('img_url'),async (ctx) => {
    let _id = ctx.req.body._id;
    let cate_id=ctx.req.body.cate_id;
    let catename=ctx.req.body.catename.trim();
    let price = ctx.req.body.price;
    let title=ctx.req.body.title.trim() || '';
    let sort = Number(ctx.req.body.sort);
    let status=ctx.req.body.status;
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file? ctx.req.file.path.substr(7) : '';
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let last_time = tools.getTime();
    if(ctx.req.file){
        var data = {
            cate_id,catename,price,title,sort,status,content,img_url,last_time,keywords,description
        }
    }else{
        var data = {
            cate_id,catename,price,title,sort,status,content,last_time,keywords,description
        }
    }

    var editResult = await Db.update('product',{'_id':Db.getObjectId(_id)},data);
    try{
      if(editResult.result.ok){
          ctx.body = '<script>alert("保存成功！");location.href="/admin/product";</script>'
      }
    }catch(err){
        console.log(err);
    }
})


//分类列表
router.get('/productcate', async (ctx) => {
    var data = await Db.find('productcate', {});
    var list = tools.cateTolist(data);
    await ctx.render('admin/product/productcate/list', {
        list
    });
});

//增加分类
router.get('/productcate/add', async (ctx) => {
    let data = await Db.find('productcate', {});
    var list = tools.cateTolist(data);
    await ctx.render('admin/product/productcate/add', {
        list
    });
});

//提交'增加分类'
router.post('/productcate/doAdd', async (ctx) => {
    let bodyData = ctx.request.body;
    var addResult = await Db.insert('productcate', bodyData);
    try {
        if (addResult.result.ok) {
            ctx.body = '<script>alert("增加成功！");location.href="/admin/product/productcate";</script>'
        }
    } catch (err) {
        console.log(err);
    }

});

//编辑分类
router.get('/productcate/edit', async (ctx) => {
    let _id = ctx.query._id;
    var list = await Db.find('productcate', {'_id': Db.getObjectId(_id)});
    var firstList = await Db.find('productcate', {'pid': '0'});
    await ctx.render('admin/product/productcate/edit', {
        list: list[0],
        firstList: firstList
    });
});

//保存编辑分类
router.post('/productcate/doEdit', async (ctx) => {
    let bodyData = ctx.request.body;
    let _id = bodyData._id;
    let title = bodyData.title;
    let pid = bodyData.pid;
    let keywords = bodyData.keywords;
    let state = bodyData.state;
    let description = bodyData.description;
    var data = {
        title, pid, keywords, state, description
    };
    var editResult = await Db.update('productcate', {'_id': Db.getObjectId(_id)}, data);
    try {
        if (editResult.result.ok) {
            ctx.body = '<script>alert("保存成功！");location.href="/admin/product/productcate";</script>'
        }
    } catch (err) {
        console.log(err);
    }

});

//订单管理
router.get('/order', async (ctx)=>{
    var page = ctx.query.page || 1;
    var pageSize = 8;
    var sortJson = {'time':-1};

    //连接数据库获取内容
    var count = await Db.count('paymentData',{});//查询到的总共的数据条数
    if(count > 0){
        var totalPages = Math.ceil(count/pageSize);//总页数，向上取整
        var currentPage = page;//当前第几页

        var dataList = await Db.find('paymentData',{},{},{
            page,pageSize,sortJson
        });

        await ctx.render('admin/product/order/list',{
            list:dataList,
            totalPages:totalPages,
            currentPage:currentPage
        });
    }else{
        await ctx.render('admin/product/order/order_tip');
    }
});

//订单搜索
router.get('/order_search', async ctx=>{
    var time = ctx.query.time;
    var msg = ctx.query.msg;
    var page = ctx.query.page || 1;
    var pageSize = 8;
    var sortJson = {'time':-1};

    //查询数据
    if(time == '' || msg == ''){//筛选一个条件
        var count = await Db.count('paymentData',{$or:[{order_id:msg},{uid:msg},{time:{$gte:new Date(time),$lt:new Date(time + ' 24:00:00')}}]});
        if(count > 0){
            var totalPages = Math.ceil(count/pageSize);
            var currentPage = page;
            var dataList = await Db.find('paymentData',{$or:[{order_id:msg},{uid:msg},{time:{$gte:new Date(time),$lt:new Date(time + ' 24:00:00')}}]},{},{
                page,pageSize,sortJson
            });

            await ctx.render('admin/product/order/order_search',{
                list:dataList,
                totalPages,
                currentPage,
                time,
                msg
            })

        }else{
            await ctx.render('admin/product/order/order_tip',{
                time,
                msg
            });
        }
    }else{//表示两个条件都存在
        var count = await Db.count('paymentData',{$and:[{$or:[{order_id:msg},{uid:msg}]},{time:{$gte:new Date(time),$lt:new Date(time + ' 24:00:00')}}]});
        if(count > 0){
            var totalPages = Math.ceil(count/pageSize);
            var currentPage = page;
            var dataList = await Db.find('paymentData',{$and:[{$or:[{order_id:msg},{uid:msg}]},{time:{$gte:new Date(time),$lt:new Date(time + ' 24:00:00')}}]},{},{
                page,pageSize,sortJson
            });

            await ctx.render('admin/product/order/order_search',{
                list:dataList,
                totalPages,
                currentPage,
                time,
                msg
            })
        }else{
            await ctx.render('admin/product/order/order_tip',{
                time,
                msg
            });
        }
    }
});

//富文本编辑器图片上传的路由配置(要和ueditor.config.js文件中的服务器接口路径一致,存放图片的静态文件夹名称要和自己项目中的一致)
router.all('/editor/controller', ueditor(['static', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))

module.exports = router.routes();