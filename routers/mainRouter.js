const express = require('express');
const router = express.Router();

module.exports = (controller, auth) => {
  router.get('/', controller.getMain.bind(controller));
  router.post('/register', controller.postRegister.bind(controller));
  router.post('/login', controller.postLogin.bind(controller));
  return router;
}