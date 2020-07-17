var pool = require("../config/database");
//likeModel
module.exports = {
   /*stores user id of the liker and user id of the likee into the the data
     addSingleData is function has been reused for adding liker and likeer id data into 
     a the database
    */
   addSingleData: async (user_id, by_id) => {
    try {
      var result = await pool.query({
        sql: "INSERT INTO likes (user_id, sender_id) VALUES (?, ?)",
        values: [user_id, by_id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
 /*deletes user id of the liker and user id of the likee from the database
     removeSingleData is function has been reused for removing liker and likeer id data into 
     a the database, and also to execute notifications
    */
   removeSingleData: async (user_id, by_id) => {
    try {
      var result = await pool.query({
        sql: "DELETE FROM likes WHERE user_id = ? AND sender_id = ?",
        values: [user_id, by_id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
 //checks the which user liked which user by their id
 checkWhoLikedWho: async (user_id, by_id) => {
    try {
      var result = await pool.query({
        sql: "SELECT * FROM likes WHERE `user_id` = ? AND sender_id = ?",
        values: [user_id, by_id]
      });
      if (result.length !== 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw new Error(err);
    }
  },
  //gets all the liked user profile id
  displayProfileLikedId: async userId => {
    try {
      var result = await pool.query({
        sql:
          "SELECT `user_id` FROM likes WHERE `sender_id` = ? ORDER BY `id` ASC",
        values: [userId]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};
