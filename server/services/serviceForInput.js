var userModel = require("../models/usersModel");

module.exports = {
  lastname: (data) => {
    const regex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöúùüýÿÁÀÃÅÇÉÈËÍÌÎÏÑÔÖÕÙÜÝŸ]*-?[a-zA-ZáàâäãåçéèêëíìïñóöõúùüýÿÁÄÃÅÇÈËÍÌÎÏÑÓÒÖÚÙÜÝŸ]*$/;

    if (data == null || data == "") return { error: "Lastname field cannot be empty" };
    if (/\s/.test(data)) return { error: "Lastname should not contain spaces" };
    if (!data.match(regex)) return { error: "invalid" };
    if (data.length < 2 || data.length > 20)
      return { error: "Lastname character length is incorrect" };
    else return { status: "valid" };
  },

  firstname: (data) => {
    const regex = /^[a-zA-ZáàâäãåçéèêëíìîïñóòôöúùüýÿÁÀÃÅÇÉÈËÍÌÎÏÑÔÖÕÙÜÝŸ]*-?[a-zA-ZáàâäãåçéèêëíìïñóöõúùüýÿÁÄÃÅÇÈËÍÌÎÏÑÓÒÖÚÙÜÝŸ]*$/;

    if (data == null || data == "") return { error: "Firstname field cannot be empty" };
    if (/\s/.test(data)) return { error: "Firstname should not contain spaces" };
    if (!data.match(regex)) return { error: "invalid" };
    if (data.length < 2 || data.length > 20)
      return { error: "Firstname character length is incorrect" };
    else return { status: "valid" };
  },

  date: (data) => {
    if (data) return { status: "valid" };
    else return { error: "invalid" };
  },
  
  username: async (data) => {
    const regex = /^[a-zA-Z0-9]*-?[a-zA-Z0-9]*$/;

    if (data == null || data == "") return { error: "Username name field cannot be empty" };
    if (/\s/.test(data)) return { error: "Username should not contain spaces" };
    if (!data.match(regex)) return { error: "invalid" };
    if (data.length < 2 || data.length > 30)
      return { error: "Username character length is incorrect" };

    //Check if the username already existing in the database
    var result = await userModel.findSingleDataInformation("username", data);
    if (result != "") return { error: "Username already exists in the database" };
    else return { status: "valid" };
  },

  mail: async (data) => {
    if (data == null || data == "") return { error: "Email Address field cannot be empty" };
    if (/\s/.test(data)) return { error: "Email Address should not contain spaces" };
    //Check if the pattern is correct
    var mailPattern = /^([a-zA-Z0-9]+(?:[\.\-\_]?[a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[\.\-\_]?[a-zA-Z0-9]+)*)\.([a-zA-Z]{2,})+$/;
    if (!mailPattern.test(data)) return { error: "Incorrect Email Address pattern" };
    //Check if the email already existing in the database
    var result = await userModel.findSingleDataInformation("mail", data);
    if (result != "") return { error: "Email Address already exists in the database" };
    else return { status: "valid" };
  },

  bio: (data) => {
    if (data.length > 140) return { error: " Bio character length is incorrect" };
    if (/^\s+/.test(data)) return { error: "Bio cannot start with space" };
    if (/\s+$/.test(data)) return { error: "Bio cannot end with space" };
    if (/\s\s+/.test(data)) return { error: "Bio cannot and should not have multiple spaces" };
    else return { status: "valid" };
  },

  password: (data) => {
    if (data == null || data == "") return { error: "Password  field cannot be empty" };
    if (/\s/.test(data)) return { error: "Password cannot have spaces" };
    //Check if the pattern is correct
    var passwordPattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/;
    if (!passwordPattern.test(data)) return { error: "Incorrect password pattern" };
    else return { status: "valid" };
  },
};
