'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/:phone', controller.home.index);
  router.get('/login/:phone/:password',controller.login.index)
};
