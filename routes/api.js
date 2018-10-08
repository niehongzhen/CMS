//api路由配置文件
var router = require('koa-router')();
const Alipay = require('alipay-mobile');
const assert = require('assert');


var Db = require('../model/db.js');
var tools = require('../model/tools.js');
var config = require('../model/config/config');


//'菜单'列表内容
router.get('/productlist', async (ctx) => {
    var cateList = await Db.find('productcate', {});
    var data = await Db.find('product', {}, {}, {
            sortJson: {
                'sort': 1
            }
        }
    );
    for (var i = 0; i < cateList.length; i++) {
        var list = [];
        for (var j = 0; j < data.length; j++) {
            if (cateList[i]._id == data[j].cate_id) {
                list.push(data[j]);
            }
        }
        cateList[i].list = list;
    }
    ;
    ctx.body = {
        message: 'true',
        result: cateList
    }
});

//菜品详情
router.get('/productcontent', async (ctx) => {
    let _id = ctx.query.id;
    var result = await Db.find('product', {'_id': Db.getObjectId(_id)});
    ctx.body = {
        'success': 'true',
        result
    }
});

//加入购物车
router.post('/addCart', async (ctx) => {
    let bodyData = ctx.request.body;
    let uid = bodyData.uid;
    let title = bodyData.title;
    let cate_id = bodyData.cate_id;
    let product_id = bodyData.product_id;
    let img_url = bodyData.img_url;
    let price = bodyData.price;
    let num = bodyData.num;
    var data = {
        uid, title, cate_id, product_id, img_url, price, num
    }

    var findResult = await Db.find('cart', {'product_id': product_id, 'uid': uid});
    if (findResult.length == 0) {
        var result = await Db.insert('cart', data);
    } else {
        var product_num = findResult[0].num;
        var result = await Db.update('cart', {'uid': uid, 'product_id': product_id}, {'num': product_num + num});
    }
    try {
        if (result.result.ok) {
            ctx.body = {
                success: 'true'
            }
        }
    } catch (err) {
        console.log(err);
    }
});

//当前餐桌购物车的菜品数量
router.get('/cartCount', async (ctx) => {
    let uid = ctx.query.uid;
    var data = await Db.find('cart', {'uid': uid});
    var num = 0;
    for (var i = 0; i < data.length; i++) {
        num += Number(data[i].num);
    }
    ctx.body = {
        success: 'true',
        result: num
    }
});

//购物车列表
router.get('/cartlist', async (ctx) => {
    let uid = ctx.query.uid;
    let result = await Db.find('cart', {'uid': uid});
    ctx.body = {
        success: 'true',
        result
    }
});

//购物车减少菜品数量
router.get('/decCart', async (ctx) => {
    let uid = ctx.query.uid;
    let product_id = ctx.query.product_id;
    let num = Number(ctx.query.num);
    let result = await Db.find('cart', {'uid': uid, 'product_id': product_id});
    if (result[0].num > 1) {
        var updateResult = await Db.update('cart', {'uid': uid, 'product_id': product_id}, {'num': num - 1});
        try {
            if (updateResult.result.ok) {
                ctx.body = {
                    success: 'true'
                }
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        var deleteResult = await Db.delete('cart', {'uid': uid, 'product_id': product_id}, product_id);
        try {
            if (deleteResult.result.ok) {
                ctx.body = {
                    success: 'true'
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

});

//购物车增加菜品数量
router.get('/incCart', async (ctx) => {
    let uid = ctx.query.uid;
    let product_id = ctx.query.product_id;
    let num = Number(ctx.query.num);
    var updateResult = await Db.update('cart', {'uid': uid, 'product_id': product_id}, {'num': num + 1});
    try {
        if (updateResult.result.ok) {
            ctx.body = {
                success: 'true'
            }
        }
    } catch (err) {
        console.log(err);
    }
});

//提交用户信息
router.post('/addPeopleInfo', async (ctx) => {
    let bodyData = ctx.request.body;
    let uid = bodyData.uid;
    let p_num = bodyData.p_num;
    let p_mode = bodyData.p_mode;
    let p_mark = bodyData.p_mark;
    let findResult = await Db.find('userInfo', {'uid': uid});
    var data = {
        uid, p_num, p_mode, p_mark
    }
    if (findResult.length > 0) {
        var updateResult = await Db.update('userInfo', {'uid': uid}, {
            'p_num': p_num,
            'p_mode': p_mode,
            'p_mark': p_mark
        });
        try {
            if (updateResult.result.ok) {
                ctx.body = {
                    success: 'true'
                }
            }
        } catch (err) {
            console.log(err);
        }
    } else {
        var insertResult = await Db.insert('userInfo', data);
        try {
            if (insertResult.result.ok) {
                ctx.body = {
                    success: 'true'
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
});

//购物车页面获取用户信息
router.get('/peopleInfoList', async (ctx) => {
    let uid = ctx.query.uid;
    var result = await Db.find('userInfo', {'uid': uid});
    ctx.body = {
        success: 'true',
        result
    }
});

//提交订单
router.post('/addOrder', async (ctx) => {
    let bodyData = ctx.request.body;
    let uid = bodyData.uid;
    let p_num = bodyData.p_num;
    let p_mode = bodyData.p_mode;
    let p_mark = bodyData.p_mark;
    let total_num = bodyData.total_num;
    let total_price = bodyData.total_price;
    let order_list = bodyData.order_list ? JSON.parse(bodyData.order_list) : '';
    let pay_status = 0;//支付状态，0：未支付，1：已支付
    let time = tools.getTime();
    var data = {
        uid, p_num, p_mode, p_mark, total_num, total_price, pay_status, time
    };
    var findResult = await Db.find('order_info', {'uid': uid, 'pay_status': 0});
    //更新订单
    if (findResult.length > 0) {
        var totalNum = findResult[0].total_num;
        var totalPrice = findResult[0].total_price;
        var order_id = findResult[0]._id.toString();
        var update_order_info = await Db.update('order_info', {'uid': uid, 'pay_status': 0}, {
            p_num, p_mode, p_mark,
            total_num: totalNum + total_num,
            total_price: totalPrice + total_price,
            time
        });
        if (update_order_info.result.ok) {//表示信息更新成功
            for (var i = 0; i < order_list.length; i++) {
                var order_item_result = await Db.find('order_item', {
                    'order_id': order_id,
                    'product_id': order_list[i].product_id
                });
                if (order_item_result.length > 0) {//表示订单列表中已有该菜品
                    var num = order_item_result[0].num + order_list[i].num;
                    await Db.update('order_item', {
                        'order_id': order_id,
                        'product_id': order_list[i].product_id
                    }, {'num': num, 'total_price': num * Number(order_list[i].price)})
                } else {//订单列表中没有该菜品
                    await Db.insert('order_item', {
                        order_id: order_id,
                        product_id: order_list[i].product_id,
                        title: order_list[i].title,
                        num: order_list[i].num,
                        price: order_list[i].price,
                        total_price: order_list[i].num * Number(order_list[i].price)
                    })

                }
            }
            ctx.body = {
                success: 'true',
                order_id
            }
        } else {
            ctx.body = {
                success: 'false'
            }
        }


    } else {//首次提交订单
        var order_info_result = await Db.insert('order_info', data);
        var order_id = order_info_result.insertedId.toString();
        if (order_info_result.result.ok) {//表示添加成功
            for (var i = 0; i < order_list.length; i++) {
                await Db.insert('order_item', {
                    order_id: order_id,
                    product_id: order_list[i].product_id,
                    title: order_list[i].title,
                    price: order_list[i].price,
                    num: order_list[i].num,
                    total_price: order_list[i].num * Number(order_list[i].price)
                });
            }
            ctx.body = {
                success: 'true',
                order_id
            }
        } else {
            ctx.body = {
                success: 'false'
            }
        }

    }
    //删除该桌购物车数据
    await Db.deleteMany('cart', {'uid': uid});
});

//获取订单列表数据
router.get('/getOrderList', async (ctx) => {
    let order_id = ctx.query.order_id;
    var order_info = await Db.find('order_info', {'_id': Db.getObjectId(order_id)});
    var order_list = await Db.find('order_item', {'order_id': order_id});
    try {
        if (order_info.length > 0 && order_list.length > 0) {
            ctx.body = {
                order_info,
                order_list
            }
        }
    } catch (err) {
        console.log(err);
    }
});

//扫码进入时根据桌号获取订单信息
router.get('/getOrderInfo', async (ctx) => {
    let uid = ctx.query.uid;
    let orderInfo = await Db.find('order_info', {'uid': uid, 'pay_status': 0});
    try {
        if (orderInfo.length > 0) {
            ctx.body = {
                code: '1',
                order_id: orderInfo[0]._id
            }
        } else {
            ctx.body = {
                code: '0'
            }
        }
    } catch (err) {
        console.log(err);
    }
})

//取消订单操作
router.get('/deleteOrder', async (ctx) => {
    let order_id = ctx.query.order_id;
    let deleteInfo = await Db.delete('order_info', {'_id': Db.getObjectId(order_id)});
    let deleteItem = await Db.deleteMany('order_item', {'order_id': order_id});
    try {
        if (deleteInfo.result.ok && deleteItem.result.ok) {//表示均删除成功
            ctx.body = {
                success: 'true'
            }
        }
    } catch (err) {
        console.log(err);
    }
});

//支付宝支付接口
router.post('/doPay', async (ctx) => {
    let requestData = ctx.request.body;
    const options = config.alipayOption;
    const service = new Alipay(options);
    const data = {
        subject: '我的点餐系统',
        out_trade_no: requestData.order_id,//订单号，唯一的
        // total_amount:requestData.total_price,
        total_amount: '0.01'
    }
    const basicParams = {
        "return_url": requestData.return_url,
        "notify_url": "http://niehongzhen.vicp.io:31782/api/alipayNotify"
    }
    return service.createWebOrderURL(data, basicParams).then(result => {
        assert(result.code == 0, result.message)
        assert(result.message == 'success', result.message)
        ctx.body = {result: result};
    });
});

//支付完成，改变数据
router.post('/alipayNotify', async ctx => {
    const options = config.alipayOption
    const service = new Alipay(options);
    const params = ctx.request.body;

    //验证订单是否正确
    const result = await service.makeNotifyResponse(params);
    if (result.code == '0') {//表明订单正确
        if (params.trade_status == 'TRADE_SUCCESS') {//表明交易成功
            var order_id = params.out_trade_no;
            var payData = {};
            //更新数据库的支付状态(pay_type:2,表示使用支付宝支付)
            var updateResult = await Db.update('order_info', {'_id': Db.getObjectId(order_id)}, {
                'pay_status': 1,
                'pay_type': 2
            });
            try {
                if (updateResult.result.ok) {
                    var payResult = await Db.find('order_info', {'_id': Db.getObjectId(order_id)});
                    var payList = await Db.find('order_item', {'order_id': order_id});
                    payData.order_id = order_id;
                    payData.uid = payResult[0].uid;
                    payData.p_num = payResult[0].p_num;
                    payData.p_mode = payResult[0].p_mode;
                    payData.p_mark = payResult[0].p_mark;
                    payData.total_num = payResult[0].total_num;
                    payData.total_price = payResult[0].total_price;
                    payData.pay_status = payResult[0].pay_status;
                    payData.time = payResult[0].time;
                    payData.list = [];
                    for (var i = 0; i < payList.length; i++) {
                        var temp = {};
                        temp.product_id = payList[i].product_id;
                        temp.title = payList[i].title;
                        temp.price = payList[i].price;
                        temp.num = payList[i].num;
                        temp.total_price = payList[i].total_price;
                        payData.list.push(temp);
                    }
                    await Db.insert('paymentData', payData);
                    await Db.delete('order_info', {'_id': Db.getObjectId(order_id)});
                    await Db.deleteMany('order_item', {'order_id': order_id});
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
});

//搜索功能：菜品列表
router.get('/getSearchList', async (ctx) => {
    let uid = ctx.query.uid;//桌号
    let msg = ctx.query.msg;//该桌用户搜索的记录
    //查找符合条件的菜品列表，返回
    var result = await Db.find('product', {title: {$regex: msg}});
    try {
        if (result.length > 0) {
            ctx.body = {
                code: 1,
                result
            }
        } else {
            ctx.body = {
                code: 0
            }
        }
    } catch (err) {
        console.log(err);
    }

    //该桌用户搜索历史储存起来
    let historyResult = await Db.find('historyData', {uid, msg});
    if (historyResult.length > 0) {//表示已经有该搜索时记录，则不再重复储存
        return;
    }
    if (/^[\u4e00-\u9fa5]*$/.test(msg)) {//必须为汉字才储存起来
        await Db.insert('historyData', {uid, msg});
    }
});

//查询历史记录
router.get('/getHistory', async (ctx) => {
    let uid = ctx.query.uid;
    var result = await Db.find('historyData', {uid: uid});
    try {
        if (result.length > 0) {
            ctx.body = {
                code: 1,
                result
            }
        } else {
            ctx.body = {
                code: 0
            }
        }
    } catch (err) {
        console.log(err);
    }
});

//删除搜索的历史记录
router.get('/cancelHistory', async (ctx) => {
    let uid = ctx.query.uid;
    let cancelResult = await Db.deleteMany('historyData', {uid: uid});
    try {
        if (cancelResult.result.ok) {
            ctx.body = {
                success: 'true'
            }
        }
    } catch (err) {
        console.log(err);
    }
});

//购物车页面的热销菜品
router.get('/hotProduct', async (ctx) => {
    let result = await Db.find('product', {catename: '鸭梨特色菜'});
    try {
        if (result.length > 0) {
            ctx.body = {
                result
            }
        }
    } catch (err) {
        console.log(err);
    }
});

//复选框删除购物车菜品
router.post('/deleteCartData', async (ctx) => {
    let bodyData = ctx.request.body;
    for (var i = 0; i < bodyData.length; i++) {
        await Db.delete('cart', {_id: Db.getObjectId(bodyData[i])});
    }
    ctx.body = {
        success: 'true'
    }

})


module.exports = router.routes();