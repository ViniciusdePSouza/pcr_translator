import { LoginApiResponseType } from "./index";

export interface UserContextProps {
  user: LoginApiResponseType;
  saveUser: (user: LoginApiResponseType) => void;
}
