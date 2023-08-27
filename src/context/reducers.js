import { LOGIN, LOGOUT } from "./actions";

export const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        currentUser: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        currentUser: null,
      };
    default:
      return state;
  }
};
