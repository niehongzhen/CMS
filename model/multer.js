//封装上传图片koa-multer
var multer = require('koa-multer');//图片、文件上传中间件

//配置koa-multer
var storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, 'static/upload');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
    },
    filename: function (request, file, cb) {   /*图片上传完成重命名*/
        var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
var upload = multer({ storage: storage });

module.exports = upload;