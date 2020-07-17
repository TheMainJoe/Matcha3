var serviceForUsers = require("../services/serviceForUsers");
var userModel = require("../models/usersModel");
var tagModel = require("../models/tagsModel");
var pictureModel = require("../models/imageModel");
var likeModel = require("../models/likesModel");
var notifModel = require("../models/notificationModel");
var input = require("../services/serviceForInput");
var jwtUtils = require("../services/serviceForJwt");
var serviceForNotifications = require("../services/serviceForNotification");
//userController
module.exports = {
  login: async (req, res, next) => {
    var user = await serviceForUsers.retrieveUserInformation({
      login: req.body.login,
      pwd: req.body.pwd,
    });

    if (user.error) return res.status(401).json({ message: user.error });
    else {
      var id = user.userData[0]["id"];
      var username = user.userData[0]["username"];
      return res.status(200).json({
        message: "Succesfully User Retrieved",
        username: username,
        token: jwtUtils.generatingUserToken([id, username]),
      });
    }
  },

  updateUserProfileCustomFields: async (req, res, next) => {
    var err = "";
    switch (req.params.field) {
      case "firstname":
        err = await input.firstname(req.body.data);
        break;
      case "lastname":
        err = await input.lastname(req.body.data);
        break;
      case "mail":
        err = await input.mail(req.body.data);
        break;
      default:
        err = "wrong field";
        break;
    }

    if (err.error) {
      return res
        .status(400)
        .json({ error: `${req.params.field} ` + err.error });
    }
    if (err === "wrong field") {
      return res
        .status(400)
        .json({ error: `${req.params.field} is a wrong field` });
    }

    var result = await userModel.updateSingleUserInformation(
      req.params.id,
      req.params.field,
      req.body.data
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `${req.params.field} updated`,
      });
    }
  },

  updateUserPersonalInformation: async (req, res, next) => {
    var err;
    if (
      req.body.data.lastname &&
      (err = input.lastname(req.body.data.lastname).error)
    )
      return res.status(400).json({ error: "lastname " + err });
    if (
      req.body.data.firstname &&
      (err = input.firstname(req.body.data.firstname).error)
    )
      return res.status(400).json({ error: "firstname " + err });
    if (req.body.data.mail) {
      err = await input.mail(req.body.data.mail);
      if (err.error)
        return res.status(400).json({ error: "mail " + err.error });
    }
    if (req.body.data.bio && (err = input.bio(req.body.data.bio).error))
      return res.status(400).json({ error: "bio " + err });
    if (
      req.body.data.birthdate &&
      (err = input.date(req.body.data.birthdate).error)
    )
      return res.status(400).json({ error: "birthdate " + err });

    var result = await userModel.updateUserPersonalInformation(req.params.id, req.body.data);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`,
      });
    }
  },

  deleteIndividualUserTag: async (req, res, next) => {
    if (isNaN(req.params.user_id) || isNaN(req.body.tag_id)) {
      return res.status(400).json({ error: "Couldn't update tag" });
    }

    var result = await tagModel.removeSingleData(req.params.user_id, req.body.tag_id);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`,
      });
    }
  },
  //creation of each user tags to be used later in the filter
  userTagCreation: async (req, res, next) => {
    if (isNaN(req.params.user_id) || isNaN(req.body.tag_id)) {
      return res.status(400).json({ error: "Couldn't update tag" });
    }

    var result = await tagModel.addSingleData(req.params.user_id, req.body.tag_id);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`,
      });
    }
  },

  deleteUserGalleryPicture: async (req, res, next) => {
    if (isNaN(req.params.user_id) || isNaN(req.body.pic_index)) {
      return res.status(400).json({ error: "Couldn't update picture" });
    }

    var result = await pictureModel.removeSingleData(
      req.params.user_id,
      req.body.pic_index
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`,
      });
    }
  },
  //updates the individual picture of the user
  updateUserGalleryPicture: async (req, res, next) => {
    if (isNaN(req.params.user_id)) {
      return res.status(400).json({ error: "Couldn't update picture" });
    }

    var result = await pictureModel.updateSingleUserInformation(
      req.params.user_id,
      req.body.data
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`,
      });
    }
  },
  //updates the profile picture
  userUpdateProfilePicture: async (req, res, next) => {
    if (isNaN(req.params.user_id)) {
      return res.status(400).json({ error: "Couldn't update picture" });
    }

    var result = await pictureModel.userUpdateProfilePicture(
      req.params.user_id,
      req.body.pic_index,
      req.body.pic_url
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`,
      });
    }
  },

  applyforgotPassword: async (req, res, next) => {
    var user = await serviceForUsers.checkExistingUserAccount({
      login: req.body.login,
    });

    if (user.error) return res.status(401).json({ message: user.error });
    else {
      serviceForUsers.resetUserAccountPassword(user.userData);
      return res.status(200).json({
        message: "User Account Exists",
      });
    }
  },

  checkPasswordResetKeyId: async (req, res, next) => {
    var result = await userModel.findSingleDataInformation("password_key", req.params.key);
    if (result != "") {
      return res
        .status(200)
        .json({ message: "Successfully reached password reset" });
    } else
      return res
        .status(401)
        .json({ message: "password reset key isn't valid" });
  },

  confirmPasswordWithId: async (req, res, next) => {
    var err;
    if ((err = input.password(req.body.password).error))
      return res.status(400).json({ message: "password " + err });
    var result = await serviceForUsers.verifyPwdWithId(
      req.body.password,
      req.params.id
    );

    if (result.status !== "Password is valid")
      return res.status(401).json({ message: "Password isn't valid" });
    else {
      return res.status(200).json({
        message: "Password is valid",
      });
    }
  },

  userUpdatePasswordWithId: async (req, res, next) => {
    var err;
    if ((err = input.password(req.body.password).error))
      return res.status(400).json({ message: "password " + err });
    var result = await serviceForUsers.updatePwdWithId(
      req.body.password,
      req.params.id
    );
    if (result.status !== "Password updated with success")
      return res.status(401).json({ message: "Couldn't update password" });
    else {
      return res.status(200).json({
        message: "Password updated",
      });
    }
  },

  userUpdatePasswordWithKey: async (req, res, next) => {
    var pwd1 = req.body.pwd1;
    var pwd2 = req.body.pwd2;
    var key = req.body.password_key;
    var err;
    if ((err = input.password(pwd1).error))
      return res.status(400).json({ error: "password " + err });
    if ((err = input.password(pwd2).error))
      return res.status(400).json({ error: "password " + err });
    if (pwd1 !== pwd2)
      return res.status(400).json({ error: "passwords don't match" });

    var ret = await serviceForUsers.updatePwdWithKey(pwd1, key);
    if (ret.status === "Password updated with success")
      return res.status(201).send(ret.status);
    else return res.status(400).send(ret.status);
  },

  validateUserInformation: async (req, res, next) => {
    var result = await userModel.findSingleDataInformation("key", req.params.key);
    if (result != "") {
      var updated = await userModel.userRegisterUpdate(req.params.key);
      if (updated)
        return res.status(200).json({ message: "Successfully activated" });
      else return res.status(400).json({ message: "couldn't update status" });
    } else return res.status(400).json({ message: "couldn't update status" });
  },
 //handles the new user account creations parameters from the frontend
 newAccountUserCreation: async (req, res, next) => {
    //Params
    var lastname = req.body.lastname;
    var firstname = req.body.firstname;
    var username = req.body.username;
    var mail = req.body.email;
    var pwd1 = req.body.pwd1;
    var pwd2 = req.body.pwd2;
    var city = req.body.location["address"]["city"];
    var latitude = req.body.location["coords"]["latitude"];
    var longitude = req.body.location["coords"]["longitude"];

    //Check inputs
    var err;
    if ((err = input.lastname(lastname).error))
      return res.status(400).json({ error: "lastname " + err });
    if ((err = input.firstname(firstname).error))
      return res.status(400).json({ error: "firstname " + err });
    if ((err = input.password(pwd1).error))
      return res.status(400).json({ error: "password " + err });
    if ((err = input.password(pwd2).error))
      return res.status(400).json({ error: "password " + err });

    err = await input.username(username);
    if (err.error)
      return res.status(400).json({ error: "username " + err.error });
    err = await input.mail(mail);
    if (err.error) return res.status(400).json({ error: "mail " + err.error });

    //Create new user
    var ret = await serviceForUsers.newUserAccountRegistration([
      lastname,
      firstname,
      username,
      mail,
      pwd1,
      city,
      latitude,
      longitude,
    ]);
    if (ret.status === "New Account has been created")
      return res.status(201).send(ret.status);
    else return res.status(400).send(ret.status);
  },

  retrieveUserProfile: async (req, res, next) => {
    // Get user id from username
    var userId = await serviceForUsers.retrieveUserIdFromUsername(
      req.params.username
    );
    if (userId.error) return res.status(401).json({ message: userId.error });

    // Get data from db based on user access rights
    var userData = await serviceForUsers.getUsersDataFromId(userId);
    var userPictures = await serviceForUsers.retrieveUserPictures(userId);
    var userTags = await serviceForUsers.getUsersTagsFromId(userId);
    var allTags = await serviceForUsers.retrieveAllTheTags(userId);

    if (userData.error)
      return res.status(401).json({ message: userData.error });

    return res.status(200).json({
      data: userData,
      pictures: userPictures,
      tags: userTags,
      allTags: allTags,
    });
  },

  //retrieves user profile from a user id
  retriveUserProfileFromUserId: async (req, res, next) => {
    // Get user id from username
    var userId = req.params.user_id;
    if (userId.error) return res.status(401).json({ message: userId.error });

    // Get data from db based on user access rights
    var userData = await serviceForUsers.getUsersDataFromId(userId);
    var userPictures = await serviceForUsers.retrieveUserPictures(userId);
    var userTags = await serviceForUsers.getUsersTagsFromId(userId);
    var allTags = await serviceForUsers.retrieveAllTheTags(userId);

    if (userData.error)
      return res.status(401).json({ message: userData.error });

    return res.status(200).json({
      data: userData,
      pictures: userPictures,
      tags: userTags,
      allTags: allTags,
    });
  },

  removeUserFromUserTable: async (req, res, next) => {
    var authorization = req.body.headers.authorization;
    var userId = jwtUtils.retrieveUserIdFromAuthentication(authorization);

    if (userId != -1 && req.params.user_id == userId) {
      await userModel.removeUserFromUserTable(userId);
      await tagModel.removeAllUserTags(userId);
      await pictureModel.removeAllUserPictures(userId);
    }
    return res.status(200).json({ msg: "Unentangled!!!!" });
  },
  //gets the main application notifications
  retrieveAppNotification: async (req, res, next) => {
    var userID = req.params["userID"];
    var ret = await userModel.displayNotifications(userID);

    var blocked = await userModel.fetchMyListOfBlockedUserId(userID);

    for (var i = 0; i < ret.length; i++) {
      for (var k = 0; k < blocked.length; k++) {
        if (ret[i]["sender_id"] == blocked[k]["user_id"]) ret.splice(i, 1);
      }
    }
    return res.status(200).json({ tab: ret });
  },

  setDismissNotification: async (req, res, next) => {
    var userID = req.params["userID"];
    var result = await userModel.setDismissNotification(userID);
    if (result) return res.status(200).json({ msg: "Notifications dismissed" });
    else
      return res.status(200).json({
        error: "An error occurred and notifcations could not be dismissed",
      });
  },
  //check user likes, by checking who liked you and liking back
  checkUserLikes: async (req, res, next) => {
    var by_id = await serviceForUsers.retrieveUserIdFromUsername(
      req.params.username
    );
    var ret = await likeModel.checkWhoLikedWho(req.params["user_id"], by_id);
    var retRev = await likeModel.checkWhoLikedWho(by_id, req.params["user_id"]);
    return res.status(200).json({ likedBy: ret, reverse: retRev });
  },

  removeUserLikes: async (req, res, next) => {
    if (isNaN(req.params.user_id) || isNaN(req.params.by_id)) {
      return res.status(400).json({ error: "Couldn't update like" });
    }

    var result = await likeModel.removeSingleData(
      req.params.user_id,
      req.params.by_id
    );

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`,
      });
    }
  },
  // creates user like, to like the user profile
  executeUserLike: async (req, res, next) => {
    if (isNaN(req.params.user_id) || isNaN(req.params.by_id)) {
      return res.status(400).json({ error: "Couldn't update like" });
    }

    var result = await likeModel.addSingleData(req.params.user_id, req.params.by_id);

    if (result.error) return res.status(401).json({ error: result.error });
    else {
      return res.status(200).json({
        message: `User data updated`,
      });
    }
  },

  manageSocketNotifications: async (type, user_id, target_id) => {
    var sendNotif = false;
    var username = await userModel.displayUsernameFromId(user_id);
    username = await username[0].username;
    switch (type) {
      case "visit":
        sendNotif = await serviceForNotifications.executeVisits(
          user_id,
          target_id,
          username
        );
        break;
      case "like":
        serviceForNotifications.executeLikes(user_id, target_id, username);
        sendNotif = true;
        break;
      case "dislike":
        await serviceForNotifications.executeDislikes(user_id, target_id, username);
        sendNotif = true;
        break;
      case "like_back":
        await serviceForNotifications.executeLikeBacks(user_id, target_id, username);
        sendNotif = true;
        break;
    }
    return sendNotif;
  },

  reportingTheUser: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    var result = await userModel.reportingTheUser([target_id, user_id]);
    if (result)
      return res.status(200).json({ message: "Successfully reported!" });
    return res
      .status(200)
      .json({ message: "Impossible to report this user for now" });
  },

  getMatchUserRoomId: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    if (target_id == user_id) return res.status(200).json({ room_id: null });

    var result = await userModel.getMatchUserRoomId(target_id, user_id);

    return res.status(200).json({ room_id: result[0].room_id });
  },

  checkIfTheUserIsReported: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    var result = await userModel.checkIfTheUserIsReported(user_id, target_id);
    return res.status(200).json({ isReported: result });
  },

  blockMisbehavingUser: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    var result = await userModel.blockMisbehavingUser(user_id, target_id);
    if (result)
      return res.status(200).json({ message: "Successfully blocked!" });
    return res
      .status(200)
      .json({ message: "Impossible to block this user for now..." });
  },

  unblockMisbehavingUser: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    var result = await userModel.unblockMisbehavingUser(user_id, target_id);
    if (!result)
      return res.status(200).json({ message: "Successfully unblocked!" });
    return res
      .status(200)
      .json({ message: "Impossible to unblock this user for now..." });
  },

  checkIfTheUserIsBlocked: async (req, res, next) => {
    var user_id = req.params.user_id;
    var target_id = req.params.target_id;

    var result = await userModel.checkIfTheUserIsBlocked(user_id, target_id);
    return res.status(200).json({ isBlocked: result });
  },

  retrieveUserProfilePicture: async (req, res, next) => {
    var picture = await pictureModel.searchForAProfile("user_id", req.params.user_id);
    if (!picture) picture = null;
    return res
      .status(200)
      .json({ picture: picture ? picture[0].url : picture });
  },

  displayProfilesVisitedIdByUser: async (req, res, next) => {
    var user_id = req.params.user_id;
    var profilesVisited = await notifModel.displayProfilesVisitedIdByUser(user_id);

    if (profilesVisited.error)
      return res.status(401).json({ error: profilesVisited.error });
    if (!profilesVisited) profilesVisited = null;

    return res.status(200).json({ profiles_visited: profilesVisited });
  },

  displayProfileLikedId: async (req, res, next) => {
    var user_id = req.params.user_id;
    var profilesLiked = await likeModel.displayProfileLikedId(user_id);

    if (profilesLiked.error)
      return res.status(401).json({ error: profilesLiked.error });
    if (!profilesLiked) profilesLiked = null;

    return res.status(200).json({ profiles_liked: profilesLiked });
  },

  fetchBlockedIdForUserProfile: async (req, res, next) => {
    var user_id = req.params.user_id;
    var profilesBlocked = await userModel.fetchMyListOfBlockedUserId(user_id);

    if (profilesBlocked.error)
      return res.status(401).json({ error: profilesBlocked.error });
    if (!profilesBlocked) profilesBlocked = null;

    return res.status(200).json({ profiles_blocked: profilesBlocked });
  },

  fetchUserProfileInformationListFromId: async (req, res, next) => {
    var userId = req.params.user_id;

    var result = await userModel.displayProfileDataFromId(userId);

    if (result.error) return res.status(401).json({ error: result.error });

    return res.status(200).json({ data: result });
  },
};
