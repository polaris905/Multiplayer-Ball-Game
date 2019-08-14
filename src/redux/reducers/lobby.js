import { LOGIN_REQUESTED, SET_REGISTER_OPEN, SET_REGISTER_CLOSE, SET_REGISTER_REQUESTED, SET_REGISTER_RESPONSE, SET_ONBOARDING, SET_TOOLTIP, SET_PAGE, SET_LOGIN_RESPONSE, UPDATE_LOBBY_DATA, UPDATE_MESSAGES, SET_START_GAME, SET_LOGOUT } from "../actionTypes";
import { PAGE, LOGIN_STATUS, TOOLTIP, REGISTER_STATUS } from "../../constants";

const INITIAL_STATE = {
  loginStatus: LOGIN_STATUS.LOGGED_OUT,
  registerStatus: REGISTER_STATUS.CLOSE,
  page: PAGE.LOGIN,
  userInfo: null,
  messages: [],
  onlineUsers: {},
  tooltipOrder: TOOLTIP.NONE
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_REQUESTED: {
      return {
        ...state,
        loginStatus: LOGIN_STATUS.REQUESTED
      };
    }
    case SET_REGISTER_OPEN: {
      return {
        ...state,
        registerStatus: REGISTER_STATUS.OPEN
      }
    }
    case SET_REGISTER_CLOSE: {
      return {
        ...state,
        registerStatus: REGISTER_STATUS.CLOSE
      }
    }
    case SET_REGISTER_REQUESTED: {
      return {
        ...state,
        registerStatus: REGISTER_STATUS.REQUESTED
      }
    }
    case SET_REGISTER_RESPONSE: {
      return {
        ...state,
        registerStatus: action.payload
      }
    }
    case SET_ONBOARDING: {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          onboardingComplete: action.payload
        }
      };
    }
    case SET_TOOLTIP: {
      return {
        ...state,
        tooltipOrder: action.payload
      }
    }
    case SET_PAGE: {
      return {
        ...state,
        page: action.payload.page
      };
    }
    case SET_LOGIN_RESPONSE: {
      return {
        ...state,
        loginStatus: action.payload.loginStatus,
        page: action.payload.page,
        userInfo: action.payload.userInfo
      };
    }
    case UPDATE_LOBBY_DATA: {
      return {
        ...state,
        onlineUsers: action.payload.onlineUsers,
        messages: action.payload.messages
      };
    }
    case UPDATE_MESSAGES: {
      return {
        ...state,
        messages: action.payload
      };
    }
    case SET_START_GAME: {
      return {
        ...state,
        page: PAGE.GAME
      }
    }
    case SET_LOGOUT: {
      return INITIAL_STATE;
    }
    default:
      return state;
  }
}