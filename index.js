const express = require("express");
const user = require("./classes/user.js");
const duel = require("./classes/duel.js");

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const userList = [];
const duelList = [];
const io = new Server(server, {
  cors: {
    origin: true,
  },
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  socket.on("username", (username) => {
    io.emit("chat message", username + " has connected.");
    socket.username = username;
    let currentUser = new user(username, socket);
    socket.user = currentUser;
    userList[username] = currentUser;
    io.emit("updateActiveUsers", Object.keys(userList));
  });

  socket.on("challenge", function (username) {
    if (userList[socket.username].duel || userList[username].duel) {
      console.log("One of these players is currently in a duel.");
      return false;
    }
    let newDuel = new duel(socket.username, username, userList);
    duelList.push(newDuel);
    userList[username].setDuel(newDuel);
    userList[socket.username].setDuel(newDuel);
  });
  socket.on("shoot", function () {
    //determine winner
    //end duel object
    //announce winner

    console.log(socket.username + " shot");
    if (socket.user.duel.endDuel(socket.username)) {
      io.emit("chat message", socket.username + " has won!");
    }
  });
  socket.on("disconnect", function () {
    io.emit(
      "chat message",
      socket.username + " has left the world's coolest chatroom."
    );
    delete userList[socket.username];
    io.emit("updateActiveUsers", Object.keys(userList));
  });
});

server.listen(3031, () => {
  console.log("listening on *:3031");
});

setInterval(() => {
  let remove = false;
  duelList.forEach((duel, index) => {
    if (duel.heartbeat() == -1) {
      remove = index;
    }
  });
  if (remove) {
    duelList[remove] = null;

    duelList.splice(remove, 1);
  }
}, 1000);
