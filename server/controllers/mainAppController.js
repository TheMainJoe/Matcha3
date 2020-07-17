const userModel = require("../models/usersModel");
const pictureModel = require("../models/imageModel");
const tagModel = require("../models/tagsModel");
const serviceForApp = require("../services/serviceForApp");
const moment = require("moment");

module.exports = {
  displayUserListWithFilters: async (req, res, next) => {
    var user = await userModel.findSingleDataInformation("id", req.params.uid);
    var gender = user[0].gender;
    var orientation = user[0].sexual_orientation;
    var range = serviceForApp.retrieveGeoLocationCoordinates(
      user[0].geo_lat,
      user[0].geo_long,
      100
    );
    var list;

    switch (orientation) {
      case "hetero":
        list = await userModel.displayUserListWithFilters(
          gender == "man" ? 2 : 1,
          gender == "man" ? 2 : 1,
          1,
          3,
          range,
          user[0].id
        );
        break;
      case "homo":
        list = await userModel.displayUserListWithFilters(
          gender == "man" ? 1 : 2,
          gender == "man" ? 1 : 2,
          1,
          2,
          range,
          user[0].id
        );
        break;
      case "bi":
        list = await userModel.displayUserListWithFiltersIfBisexual(
          gender == "man" ? 1 : 2,
          gender == "man" ? 2 : 1,
          range,
          user[0].id
        );
        break;
    }

    list = await serviceForApp.retrieveScoreDistanceList(list, user[0]);
    var idList = [];
    await list.forEach((element) => {
      idList.push(element.id);
    });

    return res.status(200).json({ list });
  },

  searchResultsWithAdditionalFilter: async (req, res, next) => {
    var uid = req.body.uid;
    var user = await userModel.findSingleDataInformation("id", uid);
    var gender = req.body.gender;
    var sexOrient = req.body.sexOrient;
    var ageMin = serviceForApp.convertBirthDateToAge(req.body.ageMin);
    var ageMax = serviceForApp.convertBirthDateToAge(req.body.ageMax);
    var popMin = req.body.popMin;
    var popMax = req.body.popMax;
    var userTags = req.body.tags;

    var range = serviceForApp.retrieveGeoLocationCoordinates(
      user[0].geo_lat,
      user[0].geo_long,
      req.body.distMax
    );

    var list = await userModel.searchResultsWithAdditionalFilter(
      gender,
      sexOrient,
      ageMin,
      ageMax,
      range,
      popMin,
      popMax,
      uid
    );

    var listData = list.copyWithin(0);

    for (var i = 0; i < listData.length; i++) {
      list[i].birthdate = moment().diff(listData[i].birthdate, "years", false);
      var tags = [];
      var result = await tagModel.displayAllTheUserTags(listData[i].id);
      result.forEach((element) => {
        tags.push(element.tag_id);
      });
      list[i].tags = tags;
      list[i].geo_lat = await serviceForApp.retrieveDistanceScore(
        user[0].geo_lat,
        user[0].geo_long,
        listData[i].geo_lat,
        listData[i].geo_long
      );
    }

    list = await serviceForApp.filterTheResultsWithTheTags(list, userTags);

    return res.status(200).json({ list: list });
  },
};
