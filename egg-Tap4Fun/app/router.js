'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/:phone', controller.home.index);
  router.get('/login/:phone/:password',controller.login.index);
  router.get('/signup/:phone/:code/:password',controller.signup.index);
  router.get('/personInfo/:avatar/:name/:gender/:birthday/:signature/:id',controller.personInfo.index);
};
