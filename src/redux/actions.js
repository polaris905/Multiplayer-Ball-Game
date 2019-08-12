import { connectServer, requestGameToServer } from "../client";
import { LOGIN_REQUESTED, SET_ONBOARDING, SET_LOGIN_RESPONSE, SET_TOOLTIP, UPDATE_MESSAGES, UPDATE_LOBBY_DATA, SET_PAGE, SET_GAME_REQUESTING, SET_GAME_REQUESTED, SET_START_GAME, SET_MOVEMENT, SET_GAME_OVER, SET_LOGOUT } from "./actionTypes";
import { LOGIN_STATUS, MODAL_TYPE } from "../constants";

export const setLoginRequested = () => ({
  type: LOGIN_REQUESTED
});

export const loginToServer = (loginInfo) => {
  return dispatch => {
    connectServer(loginInfo,
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

const setLoginResponse = (data) => ({
  type: SET_LOGIN_RESPONSE,
  payload: {
    page: data.page,
    userInfo: data.userInfo,
    loginStatus: data.loginStatus,
  }
});

export const setTooltip = (tooltipOrder) => ({
  type: SET_TOOLTIP,
  payload: tooltipOrder
})

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
})

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
})

/**
 * Template calling client.js example
 *
 * export const actionName = () => {
 *    return dispatch => {
 *      myFunction(result => {
 *          dispatch(...an action that updates the store...)
 *      })
 *    }
 * }
 */