var express = require("express");
var mainController = require("../controllers/mainAppController");
//mainRoute
exports.router = (() => {
  var mainRouter = express.Router();

  mainRouter.route("/suggestions/:uid").get(mainController.displayUserListWithFilters);
  mainRouter.route("/search").post(mainController.searchResultsWithAdditionalFilter);

  return mainRouter;
})();
