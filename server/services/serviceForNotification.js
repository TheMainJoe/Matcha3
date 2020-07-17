var notifModel = require("../models/notificationModel");
var userModel = require("../models/usersModel");
var chatModel = require("../models/messageModel");
var chatController = require("../controllers/messageController");

module.exports = {
    /*fetches the the data about the user who has visited your profile*/
    executeVisits: async (user_id, target_id, username) => {
        if (user_id == target_id)
          return false;
        var visited = await notifModel.checkIfMatchAlreadyExists('visit', user_id, target_id);
        if (!visited)
        {
          await notifModel.addSingleData([target_id, user_id, username, 3, "just visited your profile!"]);
          var score = await userModel.displayUserPopularityScore(target_id);
          score = score[0].pop_score;
          if (score < 996)
            await userModel.increasePorpularityScore(5, target_id);
          return true;
        }
        return false;
    },
    /**
     * fetches the data about the users who liked your profile, and also it calculated your popularity score and 
     * updates the score by increasing you popularity
     */
    executeLikes: async (user_id, target_id, username) => {
        await notifModel.removeSingleData(target_id, user_id, 4);
        await notifModel.removeSingleData(target_id, user_id, 1);
        await notifModel.addSingleData([target_id, user_id, username, 1, "just liked your profile!"]);
        var score = await userModel.displayUserPopularityScore(target_id);
        score = score[0].pop_score;
        if (score < 991)
          await userModel.increasePorpularityScore(10, target_id);
    },
    /**
     * fetches the data about the users who disliked your profile, and also it calculated your popularity score and 
     * updates the score by decreasing your popularity
     */
    executeDislikes: async (user_id, target_id, username) => {
        await notifModel.removeSingleData(target_id, user_id, 1);
        await notifModel.removeSingleData(target_id, user_id, 4);
        await notifModel.removeSingleData(target_id, user_id, 5);
        await notifModel.addSingleData([target_id, user_id, username, 4, "just stopped liking your profile..."]);        
        var score = await userModel.displayUserPopularityScore(target_id);
        score = score[0].pop_score;
        if (score > 9)
          await userModel.decreasePorpularityScore(10, target_id);
        else  
          await userModel.resetPopularityScoreForUser(target_id);
    },
    /**
     * fetches the data about the users who Liked you back, and also it calculated your popularity score and 
     * updates the score by increasing your popularity
     */
    executeLikeBacks: async (user_id, target_id, username) => {
        await notifModel.removeSingleData(target_id, user_id, 4);
        await notifModel.addSingleData([target_id, user_id, username, 5, "just liked you back!"]);
        var score = await userModel.displayUserPopularityScore(target_id);
        score = score[0].pop_score;
        if (score < 991)
            await userModel.increasePorpularityScore(10, target_id);
        else
            await userModel.increasePorpularityScore((1000 - score), target_id);
         var exist = await chatModel.checkIfMatchAlreadyExists(user_id, target_id);
        if (exist == false) {
              var room_id = await chatController.initiateChatRoom(user_id, target_id, username);
        }
    }
}