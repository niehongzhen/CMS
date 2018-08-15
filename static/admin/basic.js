$(function(){
    app.deleteTip();
})
//    封装ajax改变数据的公用方法
var app = {
    toggle:(el,collectionName,attr,_id)=>{
        $.get('/admin/changeState',{collectionName,attr,_id},(result)=>{
            if(result.success){
                if(result.state == 1){
                    el.src='/admin/images/yes.gif';
                }else{
                    el.src='/admin/images/no.gif';
                }
            }
        })
    },
    //改变排列顺序
    changeSort:(el,collectionName,attr,_id)=>{
        var value = el.value;
        $.get('/admin/changeSort',{collectionName,attr,value,_id},(result)=>{
            console.log(result);
        })


    },
    deleteTip(){
        $('.delete_btn').on('click',()=>{
            var flag = confirm('确定删除该列表项？');
            return flag;
        })
    }
}
