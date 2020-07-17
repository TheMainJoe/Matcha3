var jwt = require("jsonwebtoken");

const PRIVATE_KEY =
  "ThisVeryveryImportantSecreteKey";

module.exports = {
  generatingUserToken: userData => {
    var jwt_token = jwt.sign(
      {
        id: userData[0],
        username: userData[1]
      },
      PRIVATE_KEY,
      {
        expiresIn: "24h"
      }
    );
    return jwt_token;
  },

  parseAuth: authorization => {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },
  //it gets the user id form the authentication service
  retrieveUserIdFromAuthentication: authorization => {
    var userId = -1;
    var token = module.exports.parseAuth(authorization);
    if (token != null) {
      try {
        var jwtToken = jwt.verify(token, PRIVATE_KEY);
        if (jwtToken != null) userId = jwtToken.id;
      } catch (err) {}
    }
    return userId;
  },

  checkUserGeneratedToken: token => {
    if (token != null) {
        var jwtToken = jwt.verify(token, PRIVATE_KEY);
        if (jwtToken != null) return (jwtToken);
        else return (null);
    }
  }
};
