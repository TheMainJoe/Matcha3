var express = require("express");
var chatController = require("../controllers/messageController");
//chatRoute 
exports.router = (() => {
  var chatRouter = express.Router();

  chatRouter.route('/room/:room_id').get(chatController.displayUserChatMessages);
  chatRouter.route('/matches/:token').get(chatController.displayListOfMatches);
  chatRouter.route('/notification/list/:userID').get(chatController.displayListOfNotification);
  chatRouter.route('/notification/messages/:userID').get(chatController.messageNotificationCounter);

  return chatRouter;
})();
