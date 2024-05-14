import axios from "axios";

const pcrApi = axios.create({
  baseURL: "https://www2.pcrecruiter.net/rest/api",
});

export { pcrApi };
