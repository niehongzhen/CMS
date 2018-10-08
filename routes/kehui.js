var router = require('koa-router')();
var request = require('superagent');

router.post('/send_message', async (ctx) => {
    var bodyData = ctx.request.body;
    // var pars = 'opt_type=p_load_filter_list_requirement&industryIds=null&categoryIds=null&finaQtys=null&labels=null&domainCodes=null&unitIds=null&max_page_items=9&pager.offset=9&msg_handler=NTechRequirementMsgHdr';
    var pars = 'opt_type=p_load_requirement_list_rz&orderBy=hits&pageFlag=hitsResult&max_page_items=7&pager.offset=undefined&msg_handler=NTechRequirementMsgHdr';
    var result = await request.post('http://www.51kehui.com/send_message')
        .send(pars);
    ctx.body = result.text;

});

module.exports = router.routes();