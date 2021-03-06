var express = require("express");
var userController = require("../controllers/usersController");
//userRoute
exports.router = (() => {
  var userRouter = express.Router();

  userRouter
    .route("/verify/:id/password")
    .post(userController.confirmPasswordWithId);
  userRouter
    .route("/update/:id/password")
    .post(userController.userUpdatePasswordWithId);
  userRouter
    .route("/update/:id/custom/:field")
    .post(userController.updateUserProfileCustomFields);
  userRouter.route("/update/:id").post(userController.updateUserPersonalInformation);
  userRouter.route("/delete/:user_id/tag").post(userController.deleteIndividualUserTag);
  userRouter.route("/create/:user_id/tag").post(userController.userTagCreation);
  userRouter
    .route("/delete/:user_id/picture")
    .post(userController.updateUserGalleryPicture);
  userRouter
    .route("/update/:user_id/picture")
    .post(userController.updateUserGalleryPicture);
  userRouter
    .route("/update/:user_id/profile_picture")
    .post(userController.userUpdateProfilePicture);
  userRouter.route("/register/:key").get(userController.validateUserInformation);
  userRouter.route("/profile/:username").get(userController.retrieveUserProfile);
  userRouter
    .route("/profile/id/:user_id")
    .get(userController.retriveUserProfileFromUserId);
  userRouter
    .route("/profile/:user_id/liked_by/:username")
    .get(userController.checkUserLikes);
  userRouter
    .route("/delete/:user_id/liked_by/:by_id")
    .post(userController.removeUserLikes);
  userRouter
    .route("/create/:user_id/liked_by/:by_id")
    .post(userController.executeUserLike);
  userRouter.route("/login").post(userController.login);
  userRouter.route("/forgot-password").post(userController.applyforgotPassword);
  userRouter
    .route("/reset-password/:key")
    .get(userController.checkPasswordResetKeyId);
  userRouter
    .route("/reset-password/:key")
    .post(userController.userUpdatePasswordWithKey);
  userRouter.route("/register").post(userController.newAccountUserCreation);
  userRouter
    .route("/notification/main/:userID")
    .get(userController.retrieveAppNotification);
  userRouter
    .route("/read-notification/:userID")
    .post(userController.setDismissNotification);
  userRouter.route("/delete/:user_id").post(userController.removeUserFromUserTable);
  userRouter
    .route("/report/:user_id/:target_id")
    .get(userController.reportingTheUser);
  userRouter
    .route("/get-room-id/:user_id/:target_id")
    .get(userController.getMatchUserRoomId);
  userRouter
    .route("/isreported/:user_id/:target_id")
    .get(userController.checkIfTheUserIsReported);
  userRouter.route("/block/:user_id/:target_id").get(userController.blockMisbehavingUser);
  userRouter
    .route("/unblock/:user_id/:target_id")
    .get(userController.unblockMisbehavingUser);
  userRouter
    .route("/isblocked/:user_id/:target_id")
    .get(userController.checkIfTheUserIsBlocked);
  userRouter
    .route("/profile-picture/:user_id")
    .get(userController.retrieveUserProfilePicture);
  userRouter
    .route("/profiles-visited/:user_id")
    .get(userController.displayProfilesVisitedIdByUser);
  userRouter
    .route("/profiles-liked/:user_id")
    .get(userController.displayProfileLikedId);
  userRouter
    .route("/profiles-blocked/:user_id")
    .get(userController.fetchBlockedIdForUserProfile);
  userRouter
    .route("/profile/:user_id/list-profile")
    .get(userController.fetchUserProfileInformationListFromId);
  return userRouter;
})();
