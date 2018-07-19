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
          // TemplateParam: '{"code":"12345"}'
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

    this.ctx.body = "input phone number is: "+ inputPhone;
  }
}

module.exports = HomeController;
