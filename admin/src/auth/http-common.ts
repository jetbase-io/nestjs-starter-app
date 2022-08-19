import axios, { AxiosRequestConfig } from "axios";

import {
  cleanUserTokensFromLocalStorage,
  getAccessToken,
  getRefreshToken,
  setUserTokensToLocalStorage,
} from "./helpers/auth";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

http.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const accessToken = getAccessToken();
    if (config.headers === undefined) {
      config.headers = {};
    }
    if (accessToken) {
      config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : "";
    }
    return config;
  },
  (error) => error
);

let refresh = false;

http.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getRefreshToken()}`,
            },
          }
        );
        setUserTokensToLocalStorage(response.data.accessToken, response.data.refreshToken);
        error.config.headers = {
          Authorization: `Bearer ${response.data.accessToken}`,
        };
        return await http.request(error.config);
      } catch (er) {
        cleanUserTokensFromLocalStorage();
        // eslint-disable-next-line no-restricted-globals,no-return-assign
        return (location.href = "/#/login");
      }
    }
    refresh = false;
    return error;
  }
);

export default http;
