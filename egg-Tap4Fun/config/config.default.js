'use strict';

module.exports = appInfo => {
  const config = exports = {
    mysql:{
        client: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '11111111',
            database: 'Tap4fun',
        },
        app: true,
        agent: false,
    }
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1531907800021_2800';

  // add your config here
  config.middleware = [];

  return config;
};
