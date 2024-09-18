import axios from "axios";

const pcrApi = axios.create({
  baseURL: "https://www2.pcrecruiter.net/rest/api",
});

const zeroBounceApi = axios.create({
  baseURL: "https://bulkapi.zerobounce.net/v2/"
})

const openAiApi = axios.create({
  baseURL: "https://api.openai.com/v1/chat/",
});

export { pcrApi,  zeroBounceApi, openAiApi};
