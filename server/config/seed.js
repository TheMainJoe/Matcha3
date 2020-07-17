const request = require("request");
const userModel = require("../models/usersModel");
const pictureModel = require("../models/imageModel");
const tagModel = require("../models/tagsModel");
const randomInt = require("random-int");
const NodeGeocoder = require("node-geocoder");
const moment = require("moment");
const sampleCities = require("./cities.json");

module.exports = {
  getUserSeed: async () => {
    for (var j = 0; j < 1000; j++) {
      request(
			"https://randomuser.me/api/?results=1&nat=us&inc=gender,name,email,login,dob",
			async (err, resp, body) => {
				body = JSON.parse(body);
				for (var k = 0; k < body.results.length; k++) {
					var randomSexuality = randomInt(1, 3);
					var randomPopScore = randomInt(50, 999);
					var bio = "This a sample of a bio =)";
					var randomCity = Object.keys(sampleCities.za_cities)[randomInt(0, 70)];

					var uid = await userModel.createNewUsersFromSeed([
						body.results[k].name.last.charAt(0).toUpperCase() +
						body.results[k].name.last.substring(1),
						body.results[k].name.first.charAt(0).toUpperCase() +
						body.results[k].name.first.substring(1),
						body.results[k].login.username,
						body.results[k].gender == "male" ? "man" : "woman",
						randomSexuality,
						body.results[k].email,
						bio,
						body.results[k].dob.date.substr(0, 10),
						"Matcha1234",
						randomCity,
						randomPopScore,
						1,
						moment().format().substr(0, 10),
					]);

					request(
						`https://maps.googleapis.com/maps/api/geocode/json?address=${randomCity}&key=AIzaSyD6m6m4JM1B2tzLcJBnY0pLfw-PB77WoUo`,
						async (err, resp, body) => {
							body = JSON.parse(body);
							await userModel.updateUserPersonalInformation(uid, {
								geo_lat: body.results[0].geometry.location.lat,
								geo_long: body.results[0].geometry.location.lng,
							});
						}
					);
					request(
						`https://source.unsplash.com/random/640x480?${body.results[k].gender}`,
						async (err, resp, body) => {
							url = resp.request.uri.href;
							pictureModel.createSingleData([uid, url, 0, 1]);
							userModel.updateSingleUserInformation(uid, "profile_picture_url", url);
						}
					);
					var tags = [];
					var randomTag;
					for (var i = 0; i < 8; i++) {
						randomTag = randomInt(1, 16);
						if (!tags.includes(randomTag)) {
							tags.push(randomTag);
							tagModel.addSingleData(uid, randomTag);
						}
					}
				}
				console.log("Database has been populated!");
			}
		);
    }
  },
};
