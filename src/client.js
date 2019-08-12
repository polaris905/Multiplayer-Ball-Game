import { appendMessage, loginResponse, setLobbyResponse } from "./redux/actions";

/** CLIENT CONFIGURATION - connect to the server */
const socketIOClient = require("socket.io-client");

// When deployed, connect to the hosted server, otherwise connect to local server
// Localhost port must match server
let host = process.env.NODE_ENV === 'production' ? "https://cs7580-final.herokuapp.com/" : "localhost:4002"
let socket = socketIOClient.connect(host, { secure: true });
// Checks which host we're connected to (for troubleshooting);
console.log("connected to " + host);

socket.on('login', data => {
  // loginResponse(data);
  // let { username, lobby, state } = data;
  // this.setState({ username, lobby, state });
});

export const connectServer = (
  loginInfo,
  callbackLoginResponse,
  callbackMessages,
  callbackLobby,
  callbackSwitchPage,
  callbackGameRequest,
  callbackCloseRequest,
  callbackStartGame,
  callbackGameMovement,
  callbackGameOver
) => {
  socket.emit('login', loginInfo);
  socket.on('login', loginResponse => {
    callbackLoginResponse(loginResponse);
  })
  socket.on('chat', messages => {
    callbackMessages(messages);
  });
  socket.on('lobby', lobbyData => {
    callbackLobby(lobbyData);
  });
  socket.on('page', page => {
    callbackSwitchPage(page);
  });
  socket.on('request_game', from => {
    callbackGameRequest(from)
  });
  socket.on('close_request', from => {
    callbackCloseRequest(from);
  });
  socket.on("start_game", gameInfo => {
    callbackStartGame(gameInfo);
  });
  socket.on('update_game', movement => {
    callbackGameMovement(movement);
  });
  socket.on('game_over', result => {
    callbackGameOver(result);
  });
}

export const setOnboardingToServer = (status) => {
  socket.emit("set_onboarding", status);
}

export const sendMessageToServer = (message) => {
  socket.emit('chat', message);
}

export const requestGameToServer = (requestTo, callbackDeclineRequest) => {
  socket.emit('request_game', requestTo);
  socket.on('request_declined', declinedFrom => {
    callbackDeclineRequest(declinedFrom);
  })
};

export const acceptGameToServer = (player) => {
  socket.emit('accept', player);
}

export const declineGameToServer = (player) => {
  socket.emit('decline', player);
}

export const closeGameRequestToServer = (player) => {
  socket.emit('close_request', player);
}

export const sendMovementToServer = (key) => {
  socket.emit('move_paddle', key);
}

export const sendStartGameToServer = (key) => {
  socket.emit('start_game', key);
}

export const confirmGameOverToServer = () => {
  console.log("hahah");
  socket.emit('game_over');
}

export const setLogoutToServer =() => {
  socket.emit('logout');
}

/**
 * Send and receive messages
 *
 * // Emit a message and wait for a reponse. Call this in an async action.
 * export const myFunction = callbackFunc => {
 *    socket.emit("message for the server", data);
 *
 *    socket.on("message from the server", result => {
 *       callbackFunc(result);
 *    })
 *
 * }
 *
 * // Listen for a particular message
 * socket.on("message received", msg => {
 *    //do something
 * })
 */


