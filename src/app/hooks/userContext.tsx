"use client";

import { LoginApiResponseType, UserContextProps } from "@/@types";
import {
  ReactNode,
  createContext,
  useContext,
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
    localStorage.removeItem("@pcr-translator:user");

    SetUser({} as LoginApiResponseType);
  }

  function checkExpiredToken(loginDate: Date) {
    const currentDate = Date.now();
    const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
    return (currentDate - loginDate.getTime() > twoHoursInMilliseconds);
  }

  return (
    <UserContext.Provider value={{ user, saveUser, signOut, checkExpiredToken }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  const context = useContext(UserContext);

  return context;
}

export { UserProvider, useUser };
