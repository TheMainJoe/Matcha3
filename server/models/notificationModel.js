var pool = require("../config/database");
//notifModel
module.exports = {
  /*stores user id of the liker and user id of the likee into the the data
    addSingleData is function has been reused for adding liker and likeer id data into 
    a the database
  */
  addSingleData: async data => {
    try {
      await pool.query({
        sql:
          "INSERT INTO notification (user_id, sender_id, sender_username, type, data) VALUES (?)",
        values: [data]
      });
    } catch (err) {
      throw new Error(err);
    }
  },
 /*deletes user id of the liker and user id of the likee from the database
     removeSingleData is function has been reused for removing liker and likeer id data into 
     a the database
  */
  removeSingleData: async (target_id, user_id, type) => {
    try {
      await pool.query({
        sql:
          "DELETE FROM notification WHERE user_id = ? AND sender_id = ? AND type = ?",
        values: [target_id, user_id, type]
      });
    } catch (err) {
      throw new Error(err);
    }
  },
  //displays all the nnotifications for the user who's notifications are for
  displayNotifications: async userID => {
    try {
      var result = await pool.query({
        sql:
          "SELECT * FROM notification WHERE `user_id` = ? AND type != 2 ORDER BY date DESC",
        values: [userID]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  // it dismisses the notification after the user has read the notification and set IsRead to 1
  setDismissNotification: async userID => {
    try {
      var result = await pool.query({
        sql: "UPDATE notification SET `isRead`= 1 WHERE `user_id`= ?",
        values: [userID]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
 //checkes if there are any matches related to the user so it can pull all notifications ratlated to the user
  checkIfMatchAlreadyExists: async (type, user_id, target_id) => {
    try {
      var result = await pool.query({
        sql:
          "SELECT * FROM notification WHERE `user_id` = ? AND `sender_id` = ? AND type = ?",
        values: [target_id, user_id, type]
      });
      return result.length > 0 ? true : false;
    } catch (err) {
      throw new Error(err);
    }
  },
  //gets the profiles id's that the user has visited
  displayProfilesVisitedIdByUser: async userId => {
    try {
      var result = await pool.query({
        sql:
          "SELECT `user_id` FROM notification WHERE `sender_id` = ? AND type = 'visit' ORDER BY date DESC",
        values: [userId]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};
