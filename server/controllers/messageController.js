var serviceForJwt = require("../services/serviceForJwt");
var serviceForUsers = require("../services/serviceForUsers");
var chatModel = require("../models/messageModel");
var matchModel = require("../models/matchesModel");
var userModel = require("../models/usersModel");
//controller for messages and/or charts
module.exports = {
  storeAllChatMessages: async (data) => {
    await chatModel.storeAllChatMessages(data);
    await matchModel.updateLastMessageTime(data[2]);
  },

  displayUserChatMessages: async (req, res, next) => {
    var room_id = req.params.room_id;
    var result = await chatModel.displayUserChatMessages(room_id);
    return res.status(200).json({ result });
  },

  displayListOfMatches: async (req, res, next) => {
    var userID = serviceForJwt.checkUserGeneratedToken(req.params["token"])["id"];
    var result = await matchModel.displayListOfMatches(userID);
    var status = [];
    var profile_pic = [];
    for (var i = 0; i < result.length; i++) {
      status[i] =
        result[i]["user_1"] != userID
          ? result[i]["user_1"]
          : result[i]["user_2"];
    }
    if (status.length > 0) status = await userModel.fetchOnlineUserStatus(status);

    result = await serviceForUsers.fetchAllBlockedUsers(result, userID);

    for (var i = 0; i < result.length; i++) {
      profile_pic[i] =
        result[i]["user_1"] != userID
          ? result[i]["user_1"]
          : result[i]["user_2"];
    }
    if (profile_pic.length > 0)
      profile_pic = await userModel.retrieveUserProfilePicture(profile_pic);

    return res.status(200).json({ result, status, profile_pic });
  },

  onlineSocketStatus: async (userID) => {
    await userModel.saveLastConnectionStatus(1, userID);
  },

  offlineSocketStatus: async (userID) => {
    await userModel.saveLastConnectionStatus(0, userID);
  },

  messageReadSocket: async (data, userID) => {
    await chatModel.setReadNotification(2, data, userID);
  },

  storeChatNotification: async (user_id, sender_id, type, data, reference) => {
    await chatModel.storeChatNotification([
      user_id,
      sender_id,
      type,
      data,
      reference,
    ]);
  },

  messageNotificationCounter: async (req, res, next) => {
    var userID = req.params.userID;
    var blocked = await userModel.fetchMyListOfBlockedUserId(userID);
    var tab = [];
    for (var i = 0; i < blocked.length; i++) tab.push(blocked[i]["user_id"]);
    var result = await chatModel.displayNumberOfNotification(
      userID,
      blocked.length > 0 ? tab : ""
    );

    return res.status(200).json({ notification: result });
  },

  displayListOfNotification: async (req, res, next) => {
    var userID = req.params.userID;
    var blocked = await userModel.fetchMyListOfBlockedUserId(userID);
    var tab = [];
    for (var i = 0; i < blocked.length; i++) tab.push(blocked[i]["user_id"]);
    var result = await chatModel.displayListOfNotification(
      userID,
      blocked.length > 0 ? tab : ""
    );
    return res.status(200).json({ notification: result });
  },

  initiateChatRoom: async (user_id, target_id, username) => {
    var uniqid = (
      new Date().getTime() + Math.floor(Math.random() * 10000 + 1)
    ).toString(16);
    var username_1 = username;
    var username_2 = await userModel.displayUsernameFromId(target_id);
    username_2 = username_2[0].username;
    await chatModel.initiateChatRoom([
      uniqid,
      user_id,
      target_id,
      username_1,
      username_2,
    ]);
    return uniqid;
  },
};
