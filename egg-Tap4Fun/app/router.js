'use strict';

/**
 * @param {Egg.Application} app - egg application
 * 输入格式e.g.： http://127.0.0.1:7001/?phone=egg&name=chloe
 */

module.exports = app => {
    const { router, controller } = app;
    //------------------------------------------基础功能------------------------------------------------
    //发送验证短信
    //发送成功返回1 *已注册返回-1
    //phone
    router.get('/',controller.home.index);

    //注册
    //短信验证码正确返回1 *短信验证码错误返回0 *验证码过期5分钟返回-1
    //phone, code, password
    router.get('/signup',controller.home.signup);

    //登录
    //账号正确密码正确返回1，*账号正确密码错误返回2，*账号不存在返回3
    //phone, password
    router.get('/login',controller.home.login);

    //------------------------------------------首页推荐------------------------------------------------
    //首页推荐界面
    //phone, page
    router.get('/mainpage', controller.mainpage.index);

    //点赞和取消赞
    //id, phone
    router.get('/likeOrUnlike', controller.mainpage.likeOrUnlike);

    //评论作品
    //id, phone, cmt(图片id+本人电话+评论内容)
    router.get('/addcomment', controller.mainpage.addcomment);


    //TODO 首页的搜索 等界面出来
    //搜索
    //input
    //旅拍 单色 冷淡 清新 文艺 色感 瞬间 空气 元气 远方
    //router.get('/search', controller.mainpage.search);

    //图片详情
    //id, phone
    router.get('/imgDetail', controller.mainpage.imgDetail);

    //图片详情 -> 加入购物车
    //id, phone (图片id+本人电话)
    router.get('/imgDetail/add2cart', controller.mainpage.add2cart);

    //图片详情 -> 立即购买
    //id, phone (图片id+本人电话)
    router.get('/imgDetail/pay', controller.mainpage.pay);

    //图片详情 -> 评论展开
    //id, page(图片id+页码)
    router.get('/imgDetail/comments', controller.mainpage.comments);

    //------------------------------------------首页发现------------------------------------------------
    //商城首页
    router.get('/store', controller.store.index);

    //商城分类
    //cate, page (图片类别, 页码)
    router.get('/store/cate', controller.store.cate);

    //TODO： 商城的搜索 等界面

    //商城 -> 购物车
    //phone, page (我的电话号, 页码)
    router.get('/store/cart', controller.store.cart);

    //商城 -> 购物车 -> 结算
    //phone, imgID(我的电话， 要购买的图片的图片id)
    router.get('/store/pay', controller.store.pay);

    //------------------------------------------版权上传------------------------------------------------
    //上传作品图, 并且编辑资料
    //phone, price, imgName, postfix, size, resolution, description, imgTag, ctag
    router.get('/uploadImg',controller.uploadimg.index);

    //上传源文件
    //phone, postfix
    router.get('/uploadRaw',controller.uploadimg.raw);

    //--------------------------------------------我的--------------------------------------------------
    //更改自己的用户信息
    //postfix, name, gender, birthday, signature, id
    router.get('/personInfo',controller.personInfo.index);

    // 获取用户信息---------------*返回此用户所有信息
    //phone
    router.get('/getpersonInfo',controller.personInfo.getInfo);

    //他人用户信息界面
    //selfID, targetID, page (15张作品为一页)
    router.get('/userpage',controller.personInfo.userpage);

    //我的主界面
    //返回我的头像， 名字， 签名， 作品数， 关注的人数， 粉丝的人数
    //phone
    router.get('/myInfo',controller.my.index);

    //---------------------------我的作品------------------------------
    //我的->作品->已发布
    //phone, page
    router.get('/myImg/published',controller.my.published);

    //我的->作品->待审核
    //phone, page
    router.get('/myImg/pending',controller.my.pending);

    //---------------------------我的关注------------------------------
    //我的->关注
    //phone, page
    router.get('/myImg/follow', controller.my.follow);

    //我的->搜索关注人
    //phone, input, page
    router.get('/myImg/follow/search', controller.my.followsearch);

    //---------------------------我的粉丝------------------------------
    //我的->粉丝
    //是否有关注这个粉丝（关注了1，没关注0）
    //phone, page
    router.get('/myImg/fans', controller.my.fans);

    //我的—>搜索粉丝
    //phone, page, input
    router.get('/myImg/fans/search', controller.my.fanssearch);

    //关注和取关
    //selfID,targetID
    router.get('/follow',controller.personInfo.follow);

    //---------------------------我的订单------------------------------
    //我的->我的订单
    //phone, page, category(我的电话， 页码， 类别：1全部 2待付款 3已付款)
    router.get('/myorders',controller.my.orders);

    //---------------------------我的收入------------------------------
    //我的->我的收入
    //phone, page
    router.get('/mytransaction',controller.my.transaction);

    //我的->我的收入->我的钱包
    //phone
    router.get('/mybalance', controller.my.balance);

    //我的->我的收入->我的钱包->收支明细
    //phone, page
    router.get('/mybalance/details', controller.my.transactionDetails);

    //---------------------------我的消息------------------------------
    //我的消息->赞
    //phone, page
    router.get('/mymessage/likes', controller.my.likemessage);

    //我的消息->评论
    //phone, page
    router.get('/mymessage/comments', controller.my.cmtmessage);

    //我的消息->通知
    //phone, page
    router.get('/mymessage/notification', controller.my.notification);

    //---------------------------我赞过的------------------------------
    //我的->我赞过的
    //phone, page
    router.get('/mylikes',controller.my.mylikes);


    //----------------------------------------其他----------------------------------------------
    //TODO
    //模拟的订单支付接口， 钱够直接扣， 不够返回失败信息
    //order_number
    router.get('/other/pay', controller.other.index);

};
