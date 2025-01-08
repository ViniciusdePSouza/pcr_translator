import { LoginApiResponseType, LoginFormData } from "@/@types";
import { pcrApi } from "../api";

export async function login({
  apiKey,
  appId,
  databaseId,
  password,
  username,
}: LoginFormData) {
  const resource = "/access-token/";
  const body = {
    Username: username,
    Password: password,
    DatabaseId: databaseId,
    ApiKey: apiKey,
    AppId: appId,
  };
  try {
    const response = await pcrApi.post(resource, body);

    return response.data as LoginApiResponseType;
  } catch (error: any) {
    if (
      error.response.statusText == null ||
      error.response.statusText == undefined
    ) {
      throw Error("Unexpected error try again later ");
    }
    throw error.response.statusText;
  }
}
