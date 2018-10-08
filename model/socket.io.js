//koa-socket通信配置
var Io = require('koa-socket');
var io = new Io();
var url = require('url');//NodeJs原生方法，用来获取不同的桌号

var socketIo = {
    init:function (app){
        io.attach(app);

        //和客户端建立连接
        app._io.on('connection',socket=>{
            var uid = url.parse(socket.request.url,true).query.uid;//获取桌号
            socket.join(uid);

            //接收'增加购物车'广播
            socket.on('addCart',data=>{
                //广播数据
                socket.broadcast.to(uid).emit('updateData',uid);
            });

            //用餐信息
            socket.on('mealsInfo',data=>{
                socket.broadcast.to(uid).emit('mealsInfo',uid);
            });

            //更新订单
            socket.on('updateOrder',data=>{
                socket.broadcast.to(uid).emit('updateOrder');
            });

            //取消订单
            socket.on('cancelOrder',data=>{
                socket.broadcast.to(uid).emit('cancelOrder');
            });
        })
    }};



module.exports = socketIo;
