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
      const post = await this.app.mysql.get('test', { name:'aaa' });
      smsClient.sendSMS({
          PhoneNumbers: '13551239822',
          SignName: '余亚希',
          TemplateCode: 'SMS_139935233',
          TemplateParam: '{"code":"12345"}'
      }).then(function (res) {
          let {Code}=res
          if (Code === 'OK') {
              //处理返回参数
              console.log(res)
          }
      }, function (err) {
          console.log(err)
      })
      console.log("post===>>>",post)
    this.ctx.body = post;
  }
}

module.exports = HomeController;
