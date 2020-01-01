/* eslint valid-jsdoc: "off" */

'use strict';
const fs = require('fs')
const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1577811539727_9662';

  // add your middleware config here
  config.middleware = [];

  config.security = {
    csrf:{
      enable:false
      // headerName: 'x-csrf-token'
    }
  }

  config.publicKey = fs.readFileSync(path.join(__dirname,'/rsakeys/pub.pem')).toString()

  config.privateKey = fs.readFileSync(path.join(__dirname,'/rsakeys/pri.pem')).toString()

  config.redis = {
    client:{
      // host:'132.232.254.141',
      // port:6379,
      // password:'123456',

      host:'127.0.0.1',
      port:6379,
      password:'',
      db:0
    }
  }

  config.sequelize = {
    dialect:'mysql',
    database:'myblog',
    host:'127.0.0.1',
    port:3306,
    username:'root',
    password:'123456'
  }

  

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  return {
    ...config,
    ...userConfig,
  };
};
