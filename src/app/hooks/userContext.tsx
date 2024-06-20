"use client";

import { LoginApiResponseType, UserContextProps } from "@/@types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext({} as UserContextProps);

function UserProvider({ children }: UserProviderProps) {
  const [user, SetUser] = useState<LoginApiResponseType>(
    {} as LoginApiResponseType
  );

  function saveUser(user: LoginApiResponseType) {
    localStorage.setItem("@pcr-translator:user", JSON.stringify(user));
    SetUser(user);
  }

  function signOut() {
    localStorage.removeItem("@aluchef:token");
    localStorage.removeItem("@aluchef:user");

    SetUser({} as LoginApiResponseType);
  }


  useEffect(() => {
    const user = localStorage.getItem("@pcr-translator:user");

    if (user) SetUser(JSON.parse(user));
  }, []);

  return (
    <UserContext.Provider value={{ user, saveUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);

  return context;
}

export { UserProvider, useUser };
