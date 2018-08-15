//后台系统的公用方法
// //用户页面路由
var router = require('koa-router')();

//引入自定义模块
var Db = require('../../model/db.js');//mongodb数据库模块
var tools = require('../../model/tools.js');//引入自定义的工具模块

router.get('/',async (ctx)=>{
    await ctx.render('admin/index');
});

//状态改变
router.get('/changeState',async (ctx)=>{
    var collectionName = ctx.query.collectionName,//集合名称
        attr = ctx.query.attr,//要修改的属性
        _id = ctx.query._id;//查询的条件

//    先判断是否存在该数据
    var data = await Db.find(collectionName,{'_id':Db.getObjectId(_id)});
    if(data.length > 0){//该数据存在,更新属性
        var json;
        if(data[0][attr] == 1){
            json = {
                [attr]:0
            }
        }else{
            json = {
                [attr]:1
            }
        }
        var updateResult = await Db.update(collectionName,{'_id':Db.getObjectId(_id)},json);
        if(updateResult.result.ok){//数据更新成功
            var refreshData = await Db.find(collectionName,{'_id':Db.getObjectId(_id)});
            ctx.body = {'message':'更新成功！','success':true,'state':refreshData[0][attr]};
        }else{
            ctx.body = {'message':'更新失败','success':false}
        }
    }else{//不存在
        ctx.body = {'message':'更新失败，参数错误！','success':false};
    }
});

//改变排列顺序
router.get('/changeSort',async (ctx)=>{
    var collectionName = ctx.query.collectionName;
    var attr = ctx.query.attr;//修改什么属性
    var value = Number(ctx.query.value);//属性值
    var _id = ctx.query._id;//修改哪条数据
    //更新数据
    await Db.update(collectionName,{'_id':Db.getObjectId(_id)},{[attr]:value});
})

//删除列表项
router.get('/delete',async (ctx)=>{
    var collectionName = ctx.query.collectionName;
    var _id = ctx.query.id;
    var deleteData = await Db.delete(collectionName,{'_id':Db.getObjectId(_id)});
    try{
        if(deleteData.result.ok){
            ctx.redirect(ctx.request.headers['referer']);
        }
    }catch(err){
        console.log(err);
        ctx.redirect(ctx.request.headers['referer']);
    }
});

module.exports = router.routes();