'use strict';

const Controller = require('egg').Controller;
const SMSClient = require('@alicloud/sms-sdk')

/*
    短信推送的key
    created by LoveMei 7/19/2018
*/
const accessKeyId = 'LTAIWsNF0xRDTygR'
const secretAccessKey = 'DNcw97wsNRTYi7UjdYz0vFIOt2R6r9'

let smsClient = new SMSClient({accessKeyId, secretAccessKey})

class HomeController extends Controller {
  async index() {
      //读取用户手机号
      let inputPhone=this.ctx.params.phone

      //创造五位随机数验证码
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
          TemplateCode: 'SMS_139935233',
          TemplateParam: `{"code":${code}}`
      }).then(function (res) {
          let {Code}=res
          if (Code === 'OK') {
              //处理返回参数
              console.log(res)
          }
      }, function (err) {
          console.log(err)
      })

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


    this.ctx.body = inputPhone;
  }
}
module.exports = HomeController;
