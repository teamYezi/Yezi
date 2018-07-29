'use strict';

/**
 * @param {Egg.Application} app - egg application
 * 输入格式e.g.： http://127.0.0.1:7001/?phone=egg&name=chloe
 */

module.exports = app => {
    const { router, controller } = app;
    //------------------------------------------基础功能------------------------------------------------
    //发送验证短信---------*发送成功返回1 *已注册返回-1
    //phone
    router.get('/',controller.home.index);

    //注册--------------*短信验证码正确返回1 *短信验证码错误返回0 *验证码过期5分钟返回-1
    //phone, code, password
    router.get('/signup',controller.home.signup);

    //登录--------------*账号正确密码正确返回1，*账号正确密码错误返回2，*账号不存在返回3
    //phone, password
    router.get('/login',controller.home.login);

    //------------------------------------------首页推荐------------------------------------------------
    //首页推荐界面------------*返回所有图片的（图片URL+图片id+图片描述+作者名字+作者头像+发布日期+评论数+点赞数+是否为这个作品点过赞(点过1没点过-1)） 按点赞数排序 + 下一页页码
    //phone, page
    router.get('/mainpage', controller.mainpage.index);

    //点赞和取消赞------------*返回"点赞成功"或者"取消赞成功"
    //id, phone
    router.get('/likeOrUnlike', controller.mainpage.likeOrUnlike);

    //TODO 等界面出来
    //搜索-----------------
    //input
    //旅拍 单色 冷淡 清新 文艺 色感 瞬间 空气 元气 远方
    // router.get('/search', controller.mainpage.search);

    //图片详情
    //id, phone
    router.get('/imgDetail', controller.mainpage.imgDetail);

    //图片详情 -> 加入购物车
    //id, phone (图片id+本人电话)
    router.get('/imgDetail/add2cart', controller.mainpage.add2cart);

    //图片详情 -> 立即购买
    //id, phone (图片id+本人电话)
    router.get('/imgDetail/pay', controller.mainpage.pay);

    //TODO 做评论的分页
    //图片详情 -> 评论展开
    //id, phone
    //router.get('/imgDetail', controller.mainpage.imgDetail);

    //TODO 图片详情的转发界面

    //------------------------------------------首页发现------------------------------------------------
    //商城首页--------*1.返回广告图片URL 2.每类图片的URL, id, 价格
    router.get('/store', controller.store.index);

    //商城分类---------*返回此类别每张图片的URL, 图片名字， 图片id， 价格
    //cate, page (图片类别, 页码)
    router.get('/store/cate', controller.store.cate);

    //TODO： 商城的搜索

    //TODO: 右上角的购物车界面

    //------------------------------------------版权上传------------------------------------------------
    //TODO
    //上传图片 创建图片id
    // router.get('/uploadImg/:phone',controller.uploadImg.index);


    //--------------------------------------------我的--------------------------------------------------
    //更改自己的用户信息
    // postfix, name, gender, birthday, signature, id
    router.get('/personInfo',controller.personInfo.index);

    // 获取用户信息---------------*返回此用户所有信息
    //phone
    router.get('/getpersonInfo',controller.personInfo.getInfo);

    //他人用户信息界面-------------------*返回对象用户头像id， 关注人数， 粉丝人数， 是否已关注此人（是1否-1），所有作品的id和url
    //selfID, targetID, page (15张作品为一页)
    router.get('/userpage',controller.personInfo.userpage);

    //他人用户信息界面(关注和取关)---------已关注则取关， 未关注则关注
    //selfID,targetID
    router.get('/follow',controller.personInfo.follow);



    //'我的'主界面-------------*返回我的头像， 名字， 签名， 作品数， 关注的人数， 粉丝的人数
    //phone
    router.get('/myInfo',controller.my.index);

    //'我的'->'作品'->'已发布'-------------*返回已发布的所有头像URL， 头像id
    //phone, page
    router.get('/myImg/published',controller.my.published);

    //'我的'->'作品'->'待审核'-------------*返回待审核的所有头像URL， 头像id
    //phone, page
    router.get('/myImg/pending',controller.my.pending);

    //'我的'->'关注'-------------*返回关注人的头像， 名字， 签名
    //phone, page
    router.get('/myImg/follow', controller.my.follow);

    //TODO 关注人的搜索

    //'我的'->'粉丝'-------------*返回粉丝的头像， 名字， 签名， 是否有关注这个粉丝（关注了1，没关注0）
    //phone, page
    router.get('/myImg/fans', controller.my.fans);

    //TODO 粉丝的搜索

    //关注和取消关注------------*返回"点赞成功"或者"取消赞成功"
    //id, phone
    // router.get('/likeOrUnlike', controller.mainpage.likeOrUnlike);

};
