
import { SET_PAGE, SET_GAME_REQUESTING, SET_GAME_REQUESTED, SET_START_GAME, SET_MOVEMENT, SET_GAME_OVER, SET_LOGOUT } from "../actionTypes";
import { MODAL_TYPE } from "../../constants";

const INITIAL_STATE = {
  left: 150,
  right: 150,
  x: 300,
  y: 200,
  modalType: MODAL_TYPE.NONE,
  requestTo: null,
  requestedFrom: null,
  winner: null,
  loser: null,
  leftPlayer: null,
  rightPlayer: null
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_PAGE: {
      return INITIAL_STATE;
    }
    case SET_GAME_REQUESTING: {
      return {
        ...state,
        modalType: action.payload.modalType,
        requestTo: action.payload.requestTo
      };
    }
    case SET_GAME_REQUESTED: {
      return {
        ...state,
        modalType: action.payload.modalType,
        requestedFrom: action.payload.requestedFrom
      };
    }
    case SET_START_GAME: {
      return {
        ...INITIAL_STATE,
        leftPlayer: action.payload.leftPlayer,
        rightPlayer: action.payload.rightPlayer
      }
    }
    case SET_MOVEMENT: {
      return {
        ...state,
        left: action.payload.left,
        right: action.payload.right,
        x: action.payload.x,
        y: action.payload.y
      };
    }
    case SET_GAME_OVER: {
      return {
        ...state,
        modalType: action.payload.modalType,
        winner: action.payload.winner,
        loser: action.payload.loser
      };
    }
    case SET_LOGOUT: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
}