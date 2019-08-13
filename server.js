/** SERVER CONFIGURATION */
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");
const Game = require("./Game");

/** Database configuration */
const firebase = require("firebase");
require("firebase/firestore");
const firebaseConfig = {
  apiKey: "AIzaSyCp4w8EXPIrWdIBESfMg4jQw8Nr508fUwU",
  authDomain: "cs7580-final.firebaseapp.com",
  databaseURL: "https://cs7580-final.firebaseio.com",
  projectId: "cs7580-final",
  storageBucket: "cs7580-final.appspot.com",
  messagingSenderId: "821006790639",
  appId: "1:821006790639:web:acbb29f2f291764e"
}
firebase.initializeApp(firebaseConfig);
const database = firebase.firestore();

// Choose a port, default is 4002 (could be almost anything)
const PORT = process.env.PORT || 4002;

app.use(express.static(path.join(__dirname, "build")));

// When on Heroku, serve the UI from the build folder
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));
  app.get("*", (req, res) => {
    res.sendfile(path.join(__dirname = "build/index.html"));
  })
}

// When on local host, server from the public folder. 
// Rule will not be written if production conditional has executed
app.get("*", (req, res) => {
  app.sendFile(path.join(__dirname + "public/index.html"));
});

const userMap = {};
const gameMap = {};
const messages = [];
const gameIdMap = {};
const onlineUsers = {};

function GameObj(game, leftPlayer, rightPlayer) {
  this.game = game;
  this.leftPlayer = leftPlayer;
  this.rightPlayer = rightPlayer;
  this.id = leftPlayer + rightPlayer + Date.now();
  this.interval = null;
  io.to(userMap[leftPlayer].sockeId).emit("start_game", { leftPlayer, rightPlayer });
  io.to(userMap[rightPlayer].sockeId).emit("start_game", { leftPlayer, rightPlayer });
}

const updateScores = (winner, loser) => {
  onlineUsers[winner].win = onlineUsers[winner].win + 1;
  onlineUsers[loser].lose = onlineUsers[loser].lose + 1;
  database.collection("users").doc(onlineUsers[winner].id).update({
    win: onlineUsers[winner].win
  }).then(function () {
    console.log("Scores successfully updated!");
  }).catch(function (error) {
    console.error("Error updating scores: ", error);
  });
  database.collection("users").doc(onlineUsers[loser].id).update({
    lose: onlineUsers[loser].lose
  }).then(function () {
    console.log("Scores successfully updated!");
  }).catch(function (error) {
    console.error("Error updating scores: ", error);
  });
  appendToMessages("GAME", "", "Congratulations: " + winner + " beated " + loser + "!");
  io.sockets.emit("lobby", { onlineUsers, messages });
};

const makeGame = (leftPlayer, rightPlayer) => {
  let game = new Game(player => {
    let gameObj = gameMap[gameIdMap[leftPlayer]];
    clearInterval(gameObj.interval);
    delete gameIdMap[leftPlayer];
    delete gameIdMap[rightPlayer];
    delete gameMap[gameObj.id];
    let winner;
    let loser;
    if (player === "left") {
      winner = rightPlayer;
      loser = leftPlayer;
    } else {
      winner = leftPlayer;
      loser = rightPlayer;
    }
    if (userMap[leftPlayer]) {
      onlineUsers[leftPlayer].status = "pending";
      io.to(userMap[leftPlayer].sockeId).emit("game_over", { winner, loser });
    }
    if (userMap[rightPlayer]) {
      onlineUsers[rightPlayer].status = "pending";
      io.to(userMap[rightPlayer].sockeId).emit("game_over", { winner, loser });
    }
    updateScores(winner, loser);
  });
  let gameObj = new GameObj(game, leftPlayer, rightPlayer);
  gameIdMap[leftPlayer] = gameObj.id;
  gameIdMap[rightPlayer] = gameObj.id;
  gameMap[gameObj.id] = gameObj;
  onlineUsers[leftPlayer].status = "playing";
  onlineUsers[rightPlayer].status = "playing";
  io.sockets.emit("lobby", { onlineUsers, messages });
};

const startGame = gameObj => {
  gameObj.game.start();
  gameObj.interval = setInterval(() => {
    let state = gameObj.game.getState();
    io.to(userMap[gameObj.leftPlayer].sockeId).emit("update_game", state);
    io.to(userMap[gameObj.rightPlayer].sockeId).emit("update_game", state);
  }, 10);
};

const appendToMessages = (from, to, content) => {
  if (messages.length === 20) {
    messages.shift();
  }
  messages.push({ timestamp: new Date().toLocaleString(), from, to, content });
}

// Listen for client connections
server.listen(PORT, () => console.log(`Listening on ${PORT}`));

io.on("connection", socket => {
  let username = "";

  socket.on("login", loginInfo => {
    if (userMap[loginInfo.username]) {
      socket.emit("login", { loginStatus: "REPEATED", userInfo: null, page: "LOGIN" });
    } else {
      database.collection("users").where("username", "==", loginInfo.username).where("password", "==", loginInfo.password)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size === 1) {
            const doc = querySnapshot.docs[0];
            const userInfo = {
              id: doc.id,
              username: doc.data().username,
              password: doc.data().password,
              win: doc.data().win,
              lose: doc.data().lose,
              onboardingComplete: doc.data().onboardingComplete
            }
            username = userInfo.username;
            userMap[username] = { sockeId: socket.id };
            if (userInfo.onboardingComplete) {
              onlineUsers[username] = { id: userInfo.id, username: username, status: "available", win: userInfo.win, lose: userInfo.lose };
            } else {
              onlineUsers[username] = { id: userInfo.id, username: username, status: "pending", win: userInfo.win, lose: userInfo.lose };
            }
            appendToMessages("SYSTEM", "", "Welcome " + username + "!");
            socket.emit("login", { loginStatus: "SUCCESSFUL", userInfo, page: "LOBBY" });
            io.sockets.emit("lobby", { onlineUsers, messages });
          } else {
            socket.emit("login", { loginStatus: "INVALID", userInfo: null, page: "LOGIN" });
          }
        })
        .catch(error => {
          socket.emit("login", { loginStatus: "FAILED", userInfo: null, page: "LOGIN" });
        });
    }
  });

  socket.on("set_onboarding", complete => {
    if (username) {
      if (!complete) {
        onlineUsers[username].status = "pending";
      } else {
        database.collection("users").doc(onlineUsers[username].id).update({
          onboardingComplete: complete
        }).then(function () {
          console.log("Onboarding status successfully updated!");
        }).catch(function (error) {
          console.error("Error updating onboarding status: ", error);
        });
        onlineUsers[username].status = "available";
      }
      io.sockets.emit("lobby", { onlineUsers, messages });
    }
  });

  socket.on("request_game", name => {
    if (username) {
      onlineUsers[username].status = "pending";
      onlineUsers[name].status = "pending";
      io.to(userMap[name].sockeId).emit("request_game", username);
      io.sockets.emit("lobby", { onlineUsers, messages });
    }
  });

  socket.on("close_request", name => {
    if (username) {
      onlineUsers[username].status = "available";
      onlineUsers[name].status = "available";
      io.to(userMap[name].sockeId).emit("close_request", username);
      io.sockets.emit("lobby", { onlineUsers, messages });
    }
  })

  socket.on("chat", text => {
    if (username) {
      appendToMessages(username, "", text);
      io.sockets.emit("chat", messages);
    }
  });

  socket.on("accept", name => {
    if (username) {
      if (onlineUsers[name]) {
        makeGame(username, name);
      } else {
        onlineUsers[username].status = "available";
        io.sockets.emit("lobby", { onlineUsers, messages });
      }
    }
  });

  socket.on("decline", name => {
    if (username) {
      onlineUsers[username].status = "available";
      if (onlineUsers[name]) {
        onlineUsers[name].status = "available";
        io.to(userMap[name].sockeId).emit("request_declined", username);
      }
      io.sockets.emit("lobby", { onlineUsers, messages });
    }
  });

  socket.on("move_paddle", string => {
    if (username) {
      let gameObj = gameMap[gameIdMap[username]];
      if (gameObj) {
        if (gameObj.leftPlayer === username) {
          gameObj.game.moveLeftPaddle(string);
        } else {
          gameObj.game.moveRightPaddle(string);
        }
        io.to(userMap[gameObj.leftPlayer].sockeId).emit("update_game", gameObj.game.getState());
        io.to(userMap[gameObj.rightPlayer].sockeId).emit("update_game", gameObj.game.getState());
      }
    }
  });

  socket.on("start_game", () => {
    if (username) {
      let gameObj = gameMap[gameIdMap[username]];
      if (gameObj && !gameObj.interval)
        startGame(gameObj);
    }
  });

  socket.on("game_over", () => {
    if (username) {
      onlineUsers[username].status = "available";
      io.sockets.emit("lobby", { onlineUsers, messages });
    }
  })

  socket.on("disconnect", () => {
    if (username) {
      appendToMessages("SYSTEM", "", username + " left.");
      delete userMap[username];
      if (username in gameIdMap) {
        let gameObj = gameMap[gameIdMap[username]];
        if (gameObj.leftPlayer === username) {
          gameObj.game.stop("left");
        } else {
          gameObj.game.stop("right");
        }
        if (gameObj.interval) {
          clearInterval(gameObj.interval);
        }
        delete gameIdMap[gameObj.leftPlayer];
        delete gameIdMap[gameObj.rightPlayer];
        delete gameMap[gameObj.id];
      }
      delete onlineUsers[username];
      io.sockets.emit("lobby", { onlineUsers, messages });
    }
  });

  socket.on("logout", () => {
    if (username) {
      appendToMessages("SYSTEM", "", username + " left.");
      delete userMap[username];
      delete onlineUsers[username];
      io.sockets.emit("lobby", { onlineUsers, messages });
    }
  });
});