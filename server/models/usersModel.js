var pool = require("../config/database");
var passwordHash = require("password-hash");
//userModel
module.exports = {
   //finds single informaltion based on the parameters provided
  findSingleDataInformation: async (field, data) => {
    try {
      var result = await pool.query({
        sql: "SELECT * FROM ?? WHERE ?? = ?",
        values: ["users", field, data]
      });
      if (result) return result;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
  //gets the username from id provided via parameters
  displayUsernameFromId: async user_id => {
    try {
      var result = await pool.query({
        sql: "SELECT username FROM users WHERE id = ?",
        values: [user_id]
      });
      if (result) return result;
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
  //gets the list of the user profiles from the id provided
  displayProfileDataFromId: async id => {
    try {
      var result = await pool.query({
        sql:
          "SELECT username, firstname, lastname, profile_picture_url FROM users WHERE id = ?",
        values: [id]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  //updates a user details 
  updateSingleUserInformation: async (id, field, data) => {
    try {
      var result = await pool.query({
        sql: "UPDATE users SET ?? = ? WHERE `id` = ?",
        values: [field, data, id]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
// updates user data in the database
updateUserPersonalInformation: async (id, data) => {
    try {
      let update_set = Object.keys(data).map(value => {
        if (data[value] == null) {
          return ` ${value}  = NULL`;
        } else return ` ${value}  = "${data[value]}"`;
      });
      var result = await pool.query({
        sql: "UPDATE users SET " + update_set.join(" ,") + " WHERE `id` = ?",
        values: [id]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
    //functions for creating a user registration, common naming is used
  createSingleData: async data => {
    data[4] = passwordHash.generate(data[4], {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5
    });
    try {
      var result = await pool.query({
        sql:
          "INSERT INTO users (lastname, firstname, username, mail, password, city, geo_lat, geo_long, `key`) VALUES (?)",
        values: [data]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //creates a new users by calling an api and populating database with api 
  createNewUsersFromSeed: async data => {
    data[8] = passwordHash.generate(data[8], {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5
    });
    try {
      var result = await pool.query({
        sql:
          "INSERT INTO users (lastname, firstname, username, gender, sexual_orientation, mail, bio, birthdate, password, city, pop_score, status, last_connexion) VALUES (?)",
        values: [data]
      });
      return result.insertId;
    } catch (err) {
      throw new Error(err);
    }
  },
    //updates the user rgistration by updating the keys
    userRegisterUpdate: async data => {
    try {
      var result = await pool.query({
        sql: "UPDATE users SET `key` = NULL, status = 1 WHERE `key` = ?",
        values: [data]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
    //updated the users passed work based on the id provided    
    userUpdatePasswordWithId: async (pwd, id) => {
    pwd = passwordHash.generate(pwd, {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5
    });
    try {
      var result = await pool.query({
        sql: "UPDATE users SET `password` = ? WHERE `id` = ?",
        values: [pwd, id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //resets the user password key to retrieve password
  setUserPasswordResetKey: async (id, key) => {
    try {
      var result = await pool.query({
        sql: "UPDATE users SET `password_key` = ? WHERE `id` = ?",
        values: [key, id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //updates the users password with a key
  userUpdatePasswordWithKey: async (pwd, key) => {
    pwd = passwordHash.generate(pwd, {
      algorithm: "sha512",
      saltLength: 10,
      iterations: 5
    });
    try {
      var result = await pool.query({
        sql: "UPDATE users SET `password` = ? WHERE `password_key` = ?",
        values: [pwd, key]
      });
      try {
        var result2 = await pool.query({
          sql: "UPDATE users SET `password_key`= NULL WHERE `password_key`= ?",
          values: key
        });
        return result.affectedRows + result2.affectedRows;
      } catch (err) {
        throw new Error(err);
      }
    } catch (err) {
      throw new Error(err);
    }
  },
//removes the user from the database
  removeUserFromUserTable: async user_id => {
    try {
      var result = await pool.query({
        sql: "DELETE FROM users WHERE `id` = ?",
        values: user_id
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
//stores the last connection you had with the system
    saveLastConnectionStatus: async (status, userID) => {
    try {
      var result = await pool.query({
        sql:
          "UPDATE users SET `online`= ?, `last_connexion` = NOW() WHERE `id`= ?",
        values: [status, userID]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //gets the current status of the user, Online or Offline
  fetchOnlineUserStatus: async data => {
    try {
      var result = await pool.query({
        sql: "SELECT `id`, online FROM users WHERE `id` IN (?)",
        values: [data]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  //get the users profile picture
  retrieveUserProfilePicture: async data => {
    try {
      var result = await pool.query({
        sql:
          "SELECT `user_id`, url FROM pictures WHERE `user_id` IN (?) AND profile_picture = 1",
        values: [data]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  //displays all user notifications
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
 //dismisses the user notifications by changing IsRead status to one
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
  //gets the popularity score of the user with a provided user id
  displayUserPopularityScore: async target_id => {
    try {
      var result = await pool.query({
        sql: "SELECT pop_score FROM users WHERE id = ?",
        values: [target_id]
      });
      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  //Increase popularity score
  increasePorpularityScore: async (score, target_id) => {
    try {
      var result = await pool.query({
        sql: "UPDATE users SET pop_score = pop_score + ? WHERE `id`= ?",
        values: [score, target_id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //decrease popularity score
  decreasePorpularityScore: async (score, target_id) => {
    try {
      var result = await pool.query({
        sql: "UPDATE users SET pop_score = pop_score - ? WHERE `id`= ?",
        values: [score, target_id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //resets the popularity score tfor the user
  resetPopularityScoreForUser: async target_id => {
    try {
      var result = await pool.query({
        sql: "UPDATE users SET pop_score = 0 WHERE `id`= ?",
        values: [target_id]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //functions that reprots the user by adding the details of the user in the report table
  reportingTheUser: async data => {
    try {
      var result = await pool.query({
        sql: "INSERT INTO report (user_id, reporting_id) VALUES (?)",
        values: [data]
      });
      return result.affectedRows;
    } catch (err) {
      throw new Error(err);
    }
  },
  //gets the room id of the users who are matched to create chat session
  getMatchUserRoomId: async (user_id, target_id) => {
    try {
      var result = await pool.query({
        sql:
          "SELECT room_id FROM matches WHERE user_1 = ? AND user_2 = ? OR user_1 = ? AND user_2 = ?",
        values: [user_id, target_id, target_id, user_id]
      });
      return result;
    } catch (err) {
      throw new Error(err);
    }
  },
//checks if the user is reported of any misconducts
checkIfTheUserIsReported: async (user_id, target_id) => {
    try {
      var result = await pool.query({
        sql: "SELECT * FROM report WHERE user_id = ? AND reporting_id = ?",
        values: [target_id, user_id]
      });
      if (result.length > 0) return true;
      return false;
    } catch (err) {
      throw new Error(err);
    }
  },
  //insert data of the user that has being blocked
  blockMisbehavingUser: async (user_id, target_id) => {
    try {
      var result = await pool.query({
        sql: "INSERT INTO block (user_id, blocking_id) VALUES (?, ?)",
        values: [target_id, user_id]
      });
      if (result.affectedRows > 0) return true;
      return false;
    } catch (err) {
      throw new Error(err);
    }
  },
    //checks if the user is blocked 
    checkIfTheUserIsBlocked: async (user_id, target_id) => {
    try {
      var result = await pool.query({
        sql: "SELECT * FROM block WHERE user_id = ? AND blocking_id = ?",
        values: [target_id, user_id]
      });
      if (result.length > 0) return true;
      return false;
    } catch (err) {
      throw new Error(err);
    }
  },
  //ii unblockes the misbehaving user
  unblockMisbehavingUser: async (user_id, target_id) => {
    try {
      var result = await pool.query({
        sql: "DELETE FROM block WHERE user_id = ? AND blocking_id = ?",
        values: [target_id, user_id]
      });
      if (result.affectedRows > 0) return false;
      return true;
    } catch (err) {
      throw new Error(err);
    }
  },
  //gets all the user id of the users who are blocked by the current user
  fetchMyListOfBlockedUserId: async user_id => {
    try {
      var result = await pool.query({
        sql: "SELECT user_id FROM block WHERE blocking_id = ?",
        values: [user_id]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
//searches the database without any sexual orientation, age, gender etc
displayUserList: async () => {
    try {
      var result = await pool.query({
        sql:
          "SELECT id, username, firstname, lastname, gender, online, pop_score, sexual_orientation, city, bio, birthdate, last_connexion FROM users WHERE id > 13270 LIMIT 12",
        values: []
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  //searches the database with sexual orientation, age, gender etc
  displayUserListWithFilters: async (g1, g2, or1, or2, range, uid) => {
    try {
      var result = await pool.query({
        sql:
          "SELECT id, username, firstname, lastname, gender, online, pop_score, sexual_orientation, city, profile_picture_url, bio, birthdate, geo_lat, geo_long, last_connexion, pop_max, tags FROM users WHERE (gender = ? OR gender = ?) AND (sexual_orientation = ? OR sexual_orientation = ?) AND (geo_lat BETWEEN ? AND ?) AND (geo_long BETWEEN ? AND ?) AND `id` NOT IN (SELECT user_id FROM block WHERE blocking_id = ?) AND `id` != ?;",
        values: [
          g1,
          g2,
          or1,
          or2,
          range[0],
          range[1],
          range[2],
          range[3],
          uid,
          uid
        ]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  //searches database with the users with an option of bisexual
  displayUserListWithFiltersIfBisexual: async (g1, g2, range, uid) => {
    try {
      var result = await pool.query({
        sql:
          "SELECT id, username, firstname, lastname, gender, online, pop_score, sexual_orientation, city, profile_picture_url, bio, birthdate, geo_lat, geo_long, last_connexion, pop_max, tags FROM users WHERE (sexual_orientation = 1 OR (sexual_orientation = 3 AND gender = ?) OR (sexual_orientation = 2 AND gender = ?)) AND (geo_lat BETWEEN ? AND ?) AND (geo_long BETWEEN ? AND ?) AND `id` NOT IN (SELECT user_id FROM block WHERE blocking_id = ?) AND `id` != ?;",
        values: [g1, g2, range[0], range[1], range[2], range[3], uid, uid]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  },
  //seaches the database with users with the same tags, gender, date of birth, porpularity score and the user is NOT blocked
  searchResultsWithAdditionalFilter: async (
    gender,
    sexOrient,
    ageMin,
    ageMax,
    range,
    popMin,
    popMax,
    uid
  ) => {
    try {
      var result = await pool.query({
        sql:
          "SELECT id, username, firstname, lastname, gender, online, pop_score, sexual_orientation, city, profile_picture_url, bio, birthdate, geo_lat, geo_long, last_connexion, pop_max, tags FROM users WHERE (gender = ?) AND (sexual_orientation = ?) AND ((SELECT YEAR(birthdate)) BETWEEN ? AND ?) AND (geo_lat BETWEEN ? AND ?) AND (geo_long BETWEEN ? AND ?) AND (pop_score BETWEEN ? AND ?) AND `id` NOT IN (SELECT user_id FROM block WHERE blocking_id = ?) AND `id` != ?;",
        values: [
          gender,
          sexOrient,
          ageMax,
          ageMin,
          range[0],
          range[1],
          range[2],
          range[3],
          popMin,
          popMax,
          uid,
          uid
        ]
      });
      if (result) return result;
    } catch (err) {
      throw new Error(err);
    }
  }
};
