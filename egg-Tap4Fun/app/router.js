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
    router.get('/signup',controller.signup.index);

    //登录--------------*账号正确密码正确返回1，*账号正确密码错误返回2，*账号不存在返回3
    //phone, password
    router.get('/login',controller.login.index);

    //------------------------------------------首页推荐------------------------------------------------
    //首页推荐界面------------*返回所有图片的（图片URL+作者名字+作者头像+发布日期+评论数+点赞数）
    //phone
    router.get('/mainpage', controller.mainpage.index);
    //搜索-----------------





    //------------------------------------------首页发现------------------------------------------------





    //------------------------------------------版权上传------------------------------------------------
    //TODO
    //上传图片 创建图片id
    // router.get('/uploadImg/:phone',controller.uploadImg.index);




    //--------------------------------------------我的--------------------------------------------------
    //更改用户信息--------*返回用户所有信息
    // postfix, name, gender, birthday, signature, id
    router.get('/personInfo',controller.personInfo.index);

    // 进入编辑资料页面 获取用户信息-----------------*返回此用户所有信息
    //phone
    router.get('/getpersonInfo',controller.personInfo.getInfo);

    //TODO（所有作品的id）
    //用户信息界面-------------------*返回对象用户头像id， 关注人数， 粉丝人数， 是否已关注此人（是1否-1），所有作品的id
    //selfID, targetID
    router.get('/userpage',controller.userpage.index);

    //用户信息界面(关注和取关)---------已关注则取关， 未关注则关注
    //selfID,targetID
    router.get('/follow',controller.userpage.follow);
};
