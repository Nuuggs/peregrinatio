const express = require('express');
const router = express.Router();

module.exports = (controller) => {
  router.get('/', controller.getMain.bind(controller));
  return router;
}