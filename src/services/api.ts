import axios from "axios";

const pcrApi = axios.create({
  baseURL: "https://www2.pcrecruiter.net/rest/api",
});

const zeroBounceApi = axios.create({
  baseURL: "https://bulkapi.zerobounce.net/v2/"
})

export { pcrApi,  zeroBounceApi};
