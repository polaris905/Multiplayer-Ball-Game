import { connect, register, requestGameToServer } from "../client";
import { LOGIN_REQUESTED, SET_REGISTER_OPEN, SET_REGISTER_CLOSE, SET_REGISTER_REQUESTED, SET_REGISTER_RESPONSE, SET_ONBOARDING, SET_LOGIN_RESPONSE, SET_TOOLTIP, UPDATE_MESSAGES, UPDATE_LOBBY_DATA, SET_PAGE, SET_GAME_REQUESTING, SET_GAME_REQUESTED, SET_START_GAME, SET_MOVEMENT, SET_GAME_OVER, SET_LOGOUT } from "./actionTypes";
import { MODAL_TYPE } from "../constants";

export const setLoginRequested = () => ({
  type: LOGIN_REQUESTED
});

export const loginToServer = (loginInfo) => {
  return dispatch => {
    connect(loginInfo,
      loginResponse => {
        dispatch(setLoginResponse(loginResponse));
      },
      messages => {
        dispatch(updateMessages(messages));
      },
      updateData => {
        dispatch(updateLobby(updateData));
      },
      page => {
        dispatch(setPage(page));
      },
      requestedFrom => {
        dispatch(setGameRequested({ modalType: MODAL_TYPE.REQUESTED, requestedFrom }));
      },
      requestedFrom => {
        dispatch(setGameRequested({ modalType: MODAL_TYPE.NONE, requestedFrom: null }));
      },
      gameInfo => {
        dispatch(setStartGame(gameInfo));
      },
      movement => {
        dispatch(setMovement(movement));
      },
      result => {
        dispatch(setGameOver({ modalType: MODAL_TYPE.GAMEOVER, winner: result.winner, loser: result.loser }));
      }
    );
  }
}

export const registerToServer = (registerInfo) => {
  return dispatch => {
    register(registerInfo,
      registerResponse => {
        dispatch(setRegisterResponse(registerResponse));
      }
    );
  }
}

const setLoginResponse = (response) => ({
  type: SET_LOGIN_RESPONSE,
  payload: {
    page: response.page,
    userInfo: response.userInfo,
    loginStatus: response.loginStatus,
  }
});

const setRegisterResponse = (response) => ({
  type: SET_REGISTER_RESPONSE,
  payload: response.registerStatus
})

export const setRegisterOpen = () => ({
  type: SET_REGISTER_OPEN
});

export const setRegisterClose = () => ({
  type: SET_REGISTER_CLOSE
});

export const setRegisterRequested = () => ({
  type: SET_REGISTER_REQUESTED
});

export const setTooltip = (tooltipOrder) => ({
  type: SET_TOOLTIP,
  payload: tooltipOrder
});

const updateMessages = (messages) => ({
  type: UPDATE_MESSAGES,
  payload: messages
});

const updateLobby = (lobbyData) => ({
  type: UPDATE_LOBBY_DATA,
  payload: {
    page: lobbyData.page,
    onlineUsers: lobbyData.onlineUsers,
    messages: lobbyData.messages,
    games: lobbyData.gameMap
  }
});

export const setPage = (page) => ({
  type: SET_PAGE,
  payload: {
    page: page
  }
});

export const requestGame = (player) => {
  return dispatch => {
    requestGameToServer(player, declinedFrom => {
      dispatch(setGameRequesting({ modalType: MODAL_TYPE.NONE, requestTo: null }));
    });
  }
}

export const setOnboarding = (status) => ({
  type: SET_ONBOARDING,
  payload: status
});

export const setGameRequesting = (status) => ({
  type: SET_GAME_REQUESTING,
  payload: {
    modalType: status.modalType,
    requestTo: status.requestTo
  }
});

export const setGameRequested = (status) => ({
  type: SET_GAME_REQUESTED,
  payload: {
    modalType: status.modalType,
    requestedFrom: status.requestedFrom
  }
});

const setStartGame = (gameInfo) => ({
  type: SET_START_GAME,
  payload: {
    leftPlayer: gameInfo.leftPlayer,
    rightPlayer: gameInfo.rightPlayer
  }
});

const setMovement = (movement) => ({
  type: SET_MOVEMENT,
  payload: movement
});

const setGameOver = (result) => ({
  type: SET_GAME_OVER,
  payload: {
    modalType: result.modalType,
    winner: result.winner,
    loser: result.loser
  }
});

export const setLogout = () => ({
  type: SET_LOGOUT
});