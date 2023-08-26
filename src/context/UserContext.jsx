import { createContext, useState } from "react";

const APP_DEFAULT = {
  isLoggedIn: false,
  currentUser: null,
};

export const UserContext = createContext(APP_DEFAULT);

export const AuthenticationProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
