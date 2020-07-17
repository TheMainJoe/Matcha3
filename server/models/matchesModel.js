var pool = require("../config/database");
//matchModel
module.exports = {
  //displays a list of matches and orders them by descending order
  displayListOfMatches: async userID => {
    try {
      var result = await pool.query({
        sql:
          "SELECT * FROM matches WHERE user_1 = ? OR user_2 = ? ORDER BY last_message DESC",
        values: [userID, userID]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
 //sets the every last message to the current time it was sent to keep track of the time of the messages
 updateLastMessageTime: async roomID => {
    try {
      var result = await pool.query({
        sql: "UPDATE matches SET last_message = NOW() WHERE room_id = ?",
        values: [roomID]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};
