'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/checkLogin',controller.user.checkLogin);
  router.get('/checkImg',controller.user.checkImg)
};
