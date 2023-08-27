export const LOGIN = "login";
export const LOGOUT = "logout";

export const login = (payload) => ({ type: LOGIN, payload });
export const logout = () => ({ type: LOGOUT });