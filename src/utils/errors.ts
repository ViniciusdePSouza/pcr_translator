import { AxiosError } from "axios";

export function getAxiosErrorMessage(error: AxiosError){
  switch (true) {
    case error.code === 'ERR_FR_TOO_MANY_REDIRECTS':
      throw Error("Too many redirects occurred. Please check the URL and try again.");
    case error.code === 'ERR_BAD_OPTION_VALUE':
      throw Error("An invalid option value was provided. Please review your input and try again.");
    case error.code === 'ERR_BAD_OPTION':
      throw Error("An invalid option was specified. Please check the options and try again.");
    case error.code === 'ERR_NETWORK':
      throw Error("A network error occurred. Please check your internet connection and try again.");
    case error.code === 'ERR_DEPRECATED':
      throw Error("The requested feature is deprecated. Please refer to the updated documentation.");
    case error.code === 'ERR_BAD_RESPONSE':
      throw Error("Received a bad response from the server. Please try again later.");
    case error.code === 'ERR_BAD_REQUEST':
      throw Error("The request was malformed. Please verify your request and try again.");
    case error.code === 'ERR_NOT_SUPPORT':
      throw Error("The requested operation is not supported. Please check the documentation.");
    case error.code === 'ERR_INVALID_URL':
      throw Error("The URL provided is invalid. Please check the URL and try again.");
    case error.code === 'ERR_CANCELED':
      throw Error("The request was canceled. Please try again.");
    case error.code === 'ECONNABORTED':
      throw Error("The connection was aborted. Please try again.");
    case error.code === 'ETIMEDOUT':
      throw Error("The request timed out. Please try again later.");
    default:
      throw Error("An unknown error occurred. Please try again.");
  }
}