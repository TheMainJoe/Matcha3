var pool = require("../config/database");
//tagModel

module.exports = {
    /*joins user tags table and the tag table for searching based on the filter
    findSingleDataInformation is function name has been reused*/
  findSingleDataInformation: async id => {
    try {
      var result = await pool.query({
        sql:
          "SELECT user_tags.tag_id, tags.value FROM user_tags INNER JOIN tags ON user_tags.tag_id = tags.tag_id WHERE user_tags.user_id = ?",
        values: [id]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
    /**
     * inserts the user id and the tag id in the user_tag table
     * addSingleData is a function name the for later reuse
     */
  addSingleData: async (id, tag_id) => {
    try {
      var result = await pool.query({
        sql: "INSERT INTO user_tags (user_id, tag_id) VALUES (?, ?)",
        values: [id, tag_id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
   /**
     * deletes user tags from user_tags table
     * removeSingleData is a function name the for later reuse
     */
  removeSingleData: async (id, tag_id) => {
    try {
      var result = await pool.query({
        sql: "DELETE FROM user_tags WHERE user_id = ? AND tag_id = ?",
        values: [id, tag_id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //gets all the tags from the tags table
  getAllTagsFromDB: async () => {
    try {
      var result = await pool.query({
        sql: "SELECT * FROM `tags`"
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
 //it removes all the tags belonging to the user id provided
 removeAllUserTags: async id => {
    try {
      var result = await pool.query({
        sql: "DELETE FROM user_tags WHERE user_id = ?",
        values: [id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },

  displayAllTheUserTags: async id => {
    try {
      var result = await pool.query({
        sql: "SELECT * FROM user_tags WHERE user_id = ?",
        values: [id]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};
