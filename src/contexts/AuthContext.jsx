import { createContext, useEffect, useState } from "react";
import { generateUUID } from "../utils/helpers";
import {
  localStorageGetItem,
  localStorageSetItem,
  localStorageRemoveItem,
} from "../gateways/localStorage";
import {
  deleteAuthByUserName,
  fetchAuthByUserName,
  updateAuthByUserName,
} from "../gateways/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchAuthData = async (userName) => {
      const authData = await fetchAuthByUserName(userName);
      setUser(authData);
      setIsAuth(true);
      setIsLoading(false);
    };

    // this is true when reloading or come back to the app without logout
    const userNameLoggedIn = localStorageGetItem("login");
    if (!!userNameLoggedIn) {
      fetchAuthData(userNameLoggedIn);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async ({ userName, pass }) => {
    const authData = await fetchAuthByUserName(userName);

    if (!!authData && authData.pass === btoa(pass)) {
      localStorageSetItem("login", userName);
      setUser(authData);
      setIsAuth(true);

      return {
        ok: true,
        message: "",
      };
    }

    return {
      ok: false,
      message: "Authentication failed",
    };
  };

  const register = async ({ userName, email, pass }) => {
    const userId = generateUUID();

    const authData = {
      email,
      id: userId,
      pass: btoa(pass),
      userName,
    };

    await updateAuthByUserName({ userName, data: authData });
  };

  const updateAccount = async ({ userName, email }) => {
    await deleteAuthByUserName(user.userName);

    const newAuthData = {
      ...user,
      email,
      userName,
    };

    await updateAuthByUserName({ userName, data: newAuthData });
    setUser(newAuthData);
    localStorageSetItem("login", userName);
  };

  const logout = () => {
    localStorageRemoveItem("login");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        isLoading,
        user,
        login,
        logout,
        register,
        updateAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
