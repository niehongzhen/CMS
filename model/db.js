//mongodb数据库的方法封装
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;//数据库中的ID插件

//引入自定义的模块
var config = require('./config/config.js');

//使用ES6的类方法来封装mongodb的方法
class Db{
    //单例，避免多次实例化
    static getInstance(){
        if(!Db.instance){//静态方法
            Db.instance = new Db();
        }
        return Db.instance;
    }
    constructor(){
        this.DbClient = '';
        this.connect();//表示实例一创建就进行数据库连接
    }
    //因为NodeJs中的方法执行都是异步，想要获取它的返回值，在这里使用promise的方法
    //连接数据库
    connect(){
        return new Promise((resolve,reject)=>{
            if(!this.DbClient){//表示还没有连接过数据库
                MongoClient.connect(config.DBurl,(err,client)=>{
                    if(err){
                        reject(err);
                        return;
                    }
                    var db = client.db(config.DbName);//db对象
                    this.DbClient = db;
                    resolve(this.DbClient);
                })
            }else{//已经连接过数据库，直接返回
                resolve(this.DbClient);
            }
        })
    }
//    添加数据
    insert(collectionName,data){//参数是'表名称'和'要添加的数据'
        return new Promise((resolve, reject) => {
            this.connect().then((db)=>{
                db.collection(collectionName).insertOne(data,(error,docs)=>{
                    if(error){
                        reject(error);
                        return;
                    }
                    resolve(docs);
                })
            })
        })
    }

//    查找数据
    find(collectionName,data1,data2,data3){
        var attr,skipNum,pageSize,sortJson;
        if(arguments.length == 2){//表示查询全部数据
            attr = {};
            skipNum = 0;
            pageSize = 0;
        }else if(arguments.length == 3){//表示查询某一列
            attr = data2;
            skipNum = 0;
            pageSize = 0;
        }else{//分页查询
            attr = data2;
            var page = data3.page || 0;//当前第几页
            pageSize = data3.pageSize || 0;//每页多少条数据
            skipNum = (page - 1)*pageSize;//隔了多少条数据
            if(data3.sortJson){
                sortJson = data3.sortJson;
            }else{
                sortJson = {};
            }
        }
        return new Promise((resolve, reject) => {
            this.connect().then((db)=>{
                db.collection(collectionName).find(data1,{fields:attr}).skip(skipNum).limit(pageSize).sort(sortJson).toArray((error,docs)=>{
                    if(error){
                        reject(error);
                        return;
                    }
                    resolve(docs);
                })
            })
        })
    }
//    修改数据
    update(collectionName,data1,data2){
        return new Promise((resolve, reject) => {
            this.connect().then((db)=>{
                db.collection(collectionName).updateOne(data1,{$set:data2},(error,docs)=>{
                    if(error){
                        reject(error);
                        return;
                    }
                    resolve(docs);
                })
            })
        })
    }
//    删除数据
    delete(collectionName,data){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).deleteOne(data,(error,docs)=>{
                    if(error){
                        reject(error);
                        return;
                    }
                    resolve(docs);
                })
            })
        })
    }
    getObjectId(_id){
        return new ObjectId(_id);
    }
    count(collectionName,data){//计算一共多少条数据
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                db.collection(collectionName).count(data,(error,docs)=>{
                    if(error){
                        reject(error);
                        return;
                    }
                    resolve(docs);
                })
            })
        })
    }
}

//暴露模块
module.exports = Db.getInstance();







