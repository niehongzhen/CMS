//系统设置
var router = require('koa-router')();

//引入自定义的模块
var Db = require('../../model/db.js');
var tools = require('../../model/tools.js');
var upload = require('../../model/multer.js');//图片上传设置封装（koa-multer）

router.get('/', async (ctx)=>{
    //连接数据库，初始化数据
    var result = await Db.find('setting',{});
    await ctx.render('admin/setting/index',{
        list:result[0]
    });
});

//保存设置
router.post('/doSave',upload.single('site_logo'),async (ctx)=>{
    let site_title = ctx.req.body.site_title;
    let site_logo = ctx.req.file?ctx.req.file.path.substr(7):'';
    let site_keywords = ctx.req.body.site_keywords;
    let site_description = ctx.req.body.site_description;
    let site_icp = ctx.req.body.site_icp;
    let site_qq = ctx.req.body.site_qq;
    let site_tel = ctx.req.body.site_tel;
    let site_email = ctx.req.body.site_email;
    let site_address = ctx.req.body.site_address;
    let site_status = ctx.req.body.site_status;
    var data = {};
    if(site_logo){
        data= {
            site_title,site_logo,site_keywords,site_description,site_icp,site_qq,site_tel,site_email,site_address,site_status
        }
    }else{
        data= {
            site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_email,site_status
        }
    }
    //更新保存数据
    var saveResult = await Db.update('setting',{},data);
    try{
        if(saveResult.result.ok){
            ctx.body = '<script>alert("保存成功！");location.href="/admin/setting";</script>'
        }
    }catch(err){
        console.log(err);
    }

})

module.exports = router.routes();