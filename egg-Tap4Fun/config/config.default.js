'use strict';

module.exports = appInfo => {
  const config = exports = {
    mysql:{
        client: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '11111111',
            //Yezi123123!
            database: 'Tap4fun',
        },
        app: true,
        agent: false,
    },
      security : {
          csrf: {
              enable: false,
              ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
          },
          domainWhiteList: ['http://localhost:3000']
      },
      cors : {
          allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
      }
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1531907800021_2800';

  // add your config here
  config.middleware = [];

  return config;
};
