//工具封装
var md5 = require('md5-node');//引入md5加密的中间件

var tools = {
    md5: (data) => {
        return md5(data);
    },
    cateTolist: (data) => {
        //    一级分类
        var firstCate = [];
        data.forEach((item, index) => {
            if (item.pid == '0') {
                firstCate.push(item);
            }
        });
        //    在firstCate中添加二级分类
        firstCate.forEach((item, index) => {
            item.list = [];
            data.forEach((temp, key) => {
                if (item._id == temp.pid) {
                    item.list.push(temp);
                }
            })
        });
        return firstCate;
    },
    getTime() {
        return new Date();
    }


}

module.exports = tools;