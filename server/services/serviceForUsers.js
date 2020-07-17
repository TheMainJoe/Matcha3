var userModel = require("../models/usersModel");
var pictureModel = require("../models/imageModel");
var tagModel = require("../models/tagsModel");
var passwordHash = require("password-hash");
var sendmail = require("./serviceForEmail");

module.exports = {
  retrieveUserInformation: async data => {
    var user = data.login;
    var pwd = data.pwd;
	
    if (user.match(/@/)) {
      var result = await userModel.findSingleDataInformation("mail", user);
      if (result != "") {
        var hashed = result[0]["password"];
        if (result[0]["status"] == 0) return { error: "Inactive account" };
        if (passwordHash.verify(pwd, hashed))
          return { message: "Succesfully User Retrieved", userData: result };
        else return { error: "Incorrect login/password" };
      } else return { error: "Incorrect login/password" };
    } else {
      var result = await userModel.findSingleDataInformation("username", user);
      if (result != "") {
        var hashed = result[0]["password"];
        if (result[0]["status"] == 0) return { error: "Inactive account" };
        if (passwordHash.verify(pwd, hashed))
          return { message: "Succesfully User Retrieved", userData: result };
        else return { error: "Incorrect login/password" };
      } else return { error: "Incorrect login/password" };
    }
  },

  checkExistingUserAccount: async data => {
    var user = data.login;

    if (user.match(/@/)) {
      var result = await userModel.findSingleDataInformation("mail", user);
      if (result != "") {
        return { message: "User does exist", userData: result };
      } else return { error: "Incorrect login" };
    } else {
      var result = await userModel.findSingleDataInformation("username", user);
      if (result != "") {
        return { message: "User does exist", userData: result };
      } else return { error: "Incorrect login" };
    }
  },

  retrieveUserIdFromUsername: async username => {
    try {
      var result = await userModel.findSingleDataInformation("username", username);
      if (result != "") return result[0].id;
      else return { error: "User not found" };
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  getUsersDataFromId: async id => {
    try {
      var result = await userModel.findSingleDataInformation("id", id);
      return result[0];
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  verifyPwdWithId: async (pwd, id) => {
    var result = await userModel.findSingleDataInformation("id", id);
    if (result) {
      var hashed = result[0]["password"];
      if (passwordHash.verify(pwd, hashed))
        return { status: "Password is valid" };
      else {
        return { status: "Password isn't valid" };
      }
    }
  },

  updatePwdWithId: async (pwd, id) => {
    var updated = await userModel.userUpdatePasswordWithId(pwd, id);
    if (updated !== "") {
      return { status: "Password updated with success" };
    } else {
      return { status: "An error has occurred" };
    }
  },

  updatePwdWithKey: async (pwd, key) => {
    var updated = await userModel.userUpdatePasswordWithKey(pwd, key);
    if (updated) {
      return { status: "Password updated with success" };
    } else {
      return { status: "An error has occurred" };
    }
  },

  retrieveUserPictures: async id => {
    try {
      var result = await pictureModel.findSingleDataInformation("user_id", id);
      return result;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  retrieveUserProfilePicture: async id => {
    try {
      var result = await pictureModel.searchForAProfile("user_id", id);
      if (result[0] === undefined) {
        result = "default";
        return result;
      } else return result[0]["base64"];
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  getUsersTagsFromId: async id => {
    try {
      var result = await tagModel.findSingleDataInformation(id);
      return result;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  retrieveAllTheTags: async () => {
    try {
      var result = await tagModel.getAllTagsFromDB();
      return result;
    } catch (err) {
      console.log(err);
      return { error: err };
    }
  },

  newUserAccountRegistration: async data => {
    var uniqid = (
      new Date().getTime() + Math.floor(Math.random() * 10000 + 1)
    ).toString(16);
    data.push(uniqid);
    var created = await userModel.createSingleData(data);
    if (created) {
      var link = "http://localhost:3000/users/register/" + uniqid;
      await sendmail.emailRegistrationMailer(data[3], data[2], link);
      return { status: "User created with success" };
    }
    return { status: "An error has occurred" };
  },

  resetUserAccountPassword: async data => {
    var uniqid = (
      new Date().getTime() + Math.floor(Math.random() * 10000 + 1)
    ).toString(16);
    var created = await userModel.setUserPasswordResetKey(data[0]["id"], uniqid);
    if (created) {
      var link = "http://localhost:3000/users/reset-password/" + uniqid;
      await sendmail.forgotPasswordMailer(
        data[0]["mail"],
        data[0]["username"],
        link
      );
      return { status: "Reset password email sent with success" };
    }
  },

  fetchAllBlockedUsers: async (tab, userID) => {
    var blocked = await userModel.fetchMyListOfBlockedUserId(userID);

    var result = [];
    var i = 0;
    while (i < tab.length)
      result.push(tab[i++]);

    var i = 0;
    while (i < result.length) {
      var k = 0;
      while (k < blocked.length) {
        if (result[i]["user_1"] == blocked[k]['user_id'] || result[i]["user_2"] == blocked[k]['user_id']) {
          for (var j=0; j < tab.length; j++)
            if (tab[j]['user_1'] == blocked[k]['user_id'] || tab[j]['user_2'] == blocked[k]['user_id'])
              tab.splice(j, 1);
        }
        k++;
      }
      i++;
    }
    return tab;
  }
};
