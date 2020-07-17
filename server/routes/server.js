let app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io").listen(http);
let bodyParser = require("body-parser");
let userRoute = require("./usersRoute");
var chatRoute = require("./messageRoute");
var mainRoute = require("./mainAppRoute");
var chatController = require("../controllers/messageController");
var userController = require("../controllers/usersController");
var userModel = require("../models/usersModel");
var Seed = require("../config/seed");
/* Listenning port */

const PORT = 8080;

http.listen(PORT, () => {
  console.log("Listening on port: ", PORT);
});

/* Middlewares */
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use("/users/", userRoute.router);
app.use("/chat/", chatRoute.router);
app.use("/main/", mainRoute.router);

app.get("/seed", (req, res) => {
  Seed.getUserSeed();
  res.send({ message: "Database created succefully" });
});
app.get("/setup", (req, resp) => {
  require("../config/setup");
  resp.send({ message: "Database Matcha created succefully" });
});

/* Socket.io */

var connections = [];
var clients = [];
var onlineTab = [];

var mainSocket = io.on("connection", async socket => {
  await onlineTab.push({
    userID: socket.handshake.query["userID"],
    socketID: socket.id
  });

  chatController.onlineSocketStatus(socket.handshake.query["userID"]);


  socket.broadcast.emit("online", {
    user_id: socket.handshake.query["userID"],
    status: "Online"
  });

  socket.on("sendNotif", async (type, user_id, target_id) => {
    var sendNotif = await userController.manageSocketNotifications(type, user_id, target_id);
    var isBlocked = await userModel.checkIfTheUserIsBlocked(user_id, target_id);
    if (sendNotif && !isBlocked) {
      socket.broadcast.emit("newNotif", target_id);
    }
  });

  socket.on("disconnect", reason => {
    //console.log(reason);
    for (var i = 0; i < onlineTab.length; i++) {
      if (onlineTab[i]["socketID"] == socket.id) onlineTab.splice(i, 1);
    }
    var result = onlineTab.find(
      elem => elem.userID === socket.handshake.query["userID"]
    );
    if (result === undefined) {
      socket.broadcast.emit("offline", {
        user_id: socket.handshake.query["userID"],
        status: "Offline"
      });
      chatController.offlineSocketStatus(socket.handshake.query["userID"]);
      
    }
  });
});
var nsp = io.of("/chat");

nsp.on("connection", socket => {
  // Get variables
  var userID = socket.handshake.query["userID"];
  var userToken = socket.handshake.query["token"];
  var userName = socket.handshake.query["userName"];
  var room_id = socket.handshake.query["room_id"];

  socket.join(room_id);

  socket.on(room_id, async (data, userID_other) => {
    chatController.storeAllChatMessages([data, userID, room_id]);
    chatController.storeChatNotification(
      userID_other,
      userID,
      "message",
      "",
      room_id
    );
    socket.broadcast.emit(room_id, { data, userID, userName });
    var isBlocked = await userModel.checkIfTheUserIsBlocked(userID_other, userID);
    if (!isBlocked) mainSocket.emit("new message", { room_id, userID_other });
  });

  socket.on("messageReadSocket", data => {
    chatController.messageReadSocket(data, userID);
    mainSocket.emit("messageReadSocket", userID, data);
  });

  socket.on("disconnect", () => {
    connections.splice(-1, 1);
    for (var i = 0, len = clients.length; i < len; ++i) {
      var c = clients[i];

      if (c.socketID == socket.id) {
        clients.splice(i, 1);
        break;
      }
    }
  });
});
