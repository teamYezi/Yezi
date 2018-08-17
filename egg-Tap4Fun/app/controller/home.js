'use strict';

const Controller = require('egg').Controller;
const SMSClient = require('@alicloud/sms-sdk');

/*
   1 -----发送成功
   -1 -----已注册
*/
const accessKeyId = 'LTAIU8f2mJaX3HZE'
const secretAccessKey = 'ygYH04BL2dO7LfLLmtldiRD8T6GurM'

let smsClient = new SMSClient({accessKeyId, secretAccessKey});

class HomeController extends Controller {
    async index() {
      let status=1;
      //读取用户手机号
      const query=this.ctx.query;
      let inputPhone=query.phone;
      const preInfo = await this.app.mysql.get('userInfo', {id: inputPhone});
      console.log("preInfo",preInfo)
      if(preInfo!=null){
          status=-1;
      }else { //创造五位随机数验证码
          var code = require('random-number');
          var options = {
              min: 1000,
              max: 9999,
              integer:true
          }
          code = code(options)
          console.log('CODE==>>',code)

          smsClient.sendSMS({
              PhoneNumbers: inputPhone,
              SignName: '余亚希',
              TemplateCode: 'SMS_142075530',
              TemplateParam: `{"code":${code}}`
          }).then(function (res) {
              let {Code}=res
              if (Code === 'OK') {
                  //处理返回参数
                  console.log(res)
              }
          }, function (err) {
              console.log(err)
          });

          //--------------------------将用户手机号、发送的验证码、发送验证码的时间记入数据库-----------------------------
          var curTime = new Date().getTime(); //返回距1970年1月1日之间的毫秒数

          const user = {
              testNum: code,
              time: curTime,
              id: inputPhone,
          };

          //检测此用户是否已申请过验证码
          const userExist = await this.app.mysql.get('authCode', { id:inputPhone });
          if(userExist==null){
              const result = await this.app.mysql.insert('authCode', user);
          }else {
              const result1 = await this.app.mysql.update('authCode', user);
          }
      }
    this.ctx.body = status;
  }

    async signup(){
        const query=this.ctx.query;
        let phone=query.phone;
        let code=query.code;
        let password=query.password;
        const preInfo = await this.app.mysql.get('authCode', {id: phone});
        //-------------------检查用户填写的验证码是否正确， 如果正确， 存储用户电话和密码----------------
        let stateCode = 0
        if(preInfo!=null){
            //检测验证码是否过期（5分钟）
            var curTime = new Date().getTime();
            let preTime = preInfo.time;
            if((curTime - preTime)/1000 < 300){//验证码未过期
                let preCode = preInfo.testNum;
                console.log(preCode)
                if(preCode == code){
                    stateCode = 1
                    //存储电话和密码到用户表, 初始作品上传数为0
                    const user = {
                        id: phone,
                        password: password,
                        imgNum: 0,
                    };
                    const newUser = await this.app.mysql.insert('userInfo', user);
                    //生成初始钱包
                    let trans = {
                        phone: phone,
                        transaction: 0,
                        balance: 0,
                        time: new Date().getTime(),
                    }
                    const new_trans = await this.app.mysql.insert('transaction', trans);
                }
            }else{//验证码过期了
                stateCode = -1;
            }
        }
        this.ctx.body=stateCode;
    }

    async login(){
        const query=this.ctx.query;
        console.log(query)
        let phone=query.phone;
        let password=query.password;
        const userInfo = await this.app.mysql.get('userInfo', { id:phone });

        let stateCode=1;
        if(userInfo==null){
            stateCode=3
        }else {
            let userPassword=userInfo.password
            if(userPassword!=password){
                stateCode=2
            }
        }
        this.ctx.body=stateCode;
    }
}
module.exports = HomeController;
