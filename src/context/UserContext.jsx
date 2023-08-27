import { createContext, useContext, useReducer } from "react";
import { reducer } from "./reducers";

const APP_DEFAULT = {
  isLoggedIn: false,
  currentUser: null,
};

export const UserContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, APP_DEFAULT);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthenticationProvider");
  }

  return context;
};
