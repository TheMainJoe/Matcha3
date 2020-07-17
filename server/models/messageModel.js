var pool = require("../config/database");
//chatModel
module.exports = {
  // initiate a chatroom for users who matched/liked each other
  initiateChatRoom: async data => {
    try {
      var result = await pool.query({
        sql: "INSERT INTO matches (room_id, user_1, user_2, username_1, username_2) VALUES (?)",
        values: [data]
      });
    } catch (err) {
      throw new Error(err);
    }
  },
 //stores the messages between the love birds who wants to be in an entanglement
 storeAllChatMessages: async data => {
    try {
      var result = await pool.query({
        sql: "INSERT INTO messages (content, user_id, room_id) VALUES (?)",
        values: [data]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
 // it gets all the messages based on the room id that was created between the users
 displayUserChatMessages: async room_id => {
    try {
      var result = await pool.query({
        sql: "SELECT * FROM messages WHERE room_id = ?",
        values: [room_id]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
// stores all the chat notifications for a later use, either when the user logs in or logged in
storeChatNotification: async data => {
    try {
      var result = await pool.query({
        sql:
          "INSERT INTO notification (user_id, sender_id, type, data, reference) VALUES (?)",
        values: [data]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //displays total number of the notifications for the logged in user/ any notifications for them
  displayNumberOfNotification: async (userID, data) => {
    try {
      var result = await pool.query({
        sql:
          "SELECT COUNT (*) FROM notification WHERE `user_id` = ? AND type = 2 AND `isRead` = 0 AND NOT `sender_id` IN (?)",
        values: [userID, data]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
    //populates the frontend with all the activities, either they have visited their profile of liked them etc. 
    displayListOfNotification: async (userID, data) => {
    try {
      var result = await pool.query({
        sql:
          "SELECT * FROM notification WHERE `user_id` = ? AND type = 2 AND `isRead` = 0 AND NOT `sender_id` IN (?)",
        values: [userID, data]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  //To basically to make sure there are no duplicated matches in the database
  checkIfMatchAlreadyExists: async (user_id, target_id) => {
    try {
      var result = await pool.query({
        sql:
          "SELECT * FROM matches WHERE `user_1` = ? AND `user_2`= ? OR `user_1` = ? AND `user_2` = ?",
        values: [user_id, target_id, target_id, user_id]
      });
      if (result.length) return true;
      else return false;
    } catch (err) {
      throw new Error(err);
    }
  },
  //this was an easier way to set/show if nofitications were read, by deleting them in the table
  setReadNotification: async (type, ref, userID) => {
    try {
      var result = await pool.query({
        sql:
          "DELETE FROM notification WHERE type = ? AND reference = ? AND user_id = ?",
        values: [type, ref, userID]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};
