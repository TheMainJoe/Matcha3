var pool = require("../config/database");
//pictureModel
module.exports = {
  /* gets the all the pictures of a specific user id 
      findSingleDataInformation function name for finding data
      */
  findSingleDataInformation: async (field, data) => {
    try {
      var result = await pool.query({
        sql: "SELECT * FROM ?? WHERE ?? = ?",
        values: ["pictures", field, data]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
    //for inserting user additional information into the pictures table
  createSingleData: async data => {
    try {
      var result = await pool.query({
        sql:
          "INSERT INTO pictures (user_id, url, pic_index, profile_picture) VALUES (?)",
        values: [data]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
    //looks for a user profile picture based on the searched criteria
  searchForAProfile: async (field, data) => {
    try {
      var result = await pool.query({
        sql: "SELECT * FROM ?? WHERE ?? = ? AND profile_picture = 1",
        values: ["pictures", field, data]
      });
      if (result.length) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
    //deleting user picture in the picture table
  removeSingleData: async (id, pic_index) => {
    try {
      var result = await pool.query({
        sql: "DELETE FROM pictures WHERE user_id = ? AND pic_index = ?",
        values: [id, pic_index]
      });

      var userPictureRemaining = await pool.query({
        sql: "SELECT * FROM pictures WHERE user_id = ?",
        values: [id]
      });

      if (userPictureRemaining.length === 0) {
        //removes the last picture of the from the users table
        removeLastUserPictureFromUserTable = await pool.query({
          sql: "UPDATE users SET profile_picture_url = ? WHERE id = ?",
          values: ["", id]
        });
      }

      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },

  updateSingleUserInformation: async (id, data) => {
    try {
      //checks if there is an already existing index of a picture
      var PicIndexAlreadyExists = await pool.query({
        sql: "SELECT * FROM pictures WHERE user_id = ? AND pic_index = ?",
        values: [id, data.pic_index]
      });

      if (PicIndexAlreadyExists.length !== 0) {
        var result = await pool.query({
          sql:
            "UPDATE pictures SET url = ?, profile_picture = ? WHERE user_id = ? AND pic_index = ?",
          values: [data.url, data.profile_picture, id, data.pic_index]
        });

        if (data.profile_picture === 1) {
          await pool.query({
            sql: "UPDATE users SET profile_picture_url = ? WHERE id = ?",
            values: [data.url, id]
          });
        }
      } else {
        var result = await pool.query({
          sql:
            "INSERT INTO pictures(user_id, url, pic_index, profile_picture) VALUES (?, ?, ?, ?)",
          values: [id, data.url, data.pic_index, data.profile_picture]
        });

        if (data.profile_picture === 1) {
          await pool.query({
            sql: "UPDATE users SET profile_picture_url = ? WHERE id = ?",
            values: [data.url, id]
          });
        }
      }
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  //updates the the profile picture of the user
  userUpdateProfilePicture: async (id, pic_index, pic_url) => {
    try {
      await pool.query({
        sql:
          "UPDATE pictures SET profile_picture = 0 WHERE user_id = ? AND profile_picture = 1",
        values: [id]
      });

      var result = await pool.query({
        sql:
          "UPDATE pictures SET profile_picture = 1 WHERE user_id = ? AND pic_index = ?",
        values: [id, pic_index]
      });

      var result2 = await pool.query({
        sql: "UPDATE users SET profile_picture_url = ? WHERE id = ?",
        values: [pic_url, id]
      });

      if (result && result2) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
   //removes all the picture relating to the user
   removeAllUserPictures: async id => {
    try {
      var result = await pool.query({
        sql: "DELETE FROM pictures WHERE user_id = ?",
        values: [id]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  // gets all the pictures belonging to the user
  displayUserPicturesList: async data => {
    try {
      var result = await pool.query({
        sql:
          "SELECT * FROM pictures WHERE user_id IN (?) AND profile_picture = 1",
        values: [data]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};
