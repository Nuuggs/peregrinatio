const express = require('express');
const router = express.Router();

module.exports = (controller, auth) => {
  // router.get('/new', controller.newGame.bind(controller));
  router.put('/:gameId/stand', controller.stand.bind(controller));
  router.put('/:gameId/hit', controller.hit.bind(controller));
  router.get('/:userId', controller.game.bind(controller));
  
  return router;
}