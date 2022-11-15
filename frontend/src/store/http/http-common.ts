import axios, { AxiosRequestConfig } from "axios";

import history from "../../helpers/history";
import {
  cleanUserTokensFromLocalStorage,
  getAccessToken,
  getRefreshToken,
  setUserTokensToLocalStorage,
} from "../../helpers/user";
import { REFRESH_TOKEN_URL } from "../constants/api-contstants";
import { SIGN_IN_ROUTE } from "../constants/route-constants";

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
    if (error?.response?.status === 401 && !refresh) {
      refresh = true;
      try {
        const response = await axios.post(
          process.env.REACT_APP_API_URL + REFRESH_TOKEN_URL,
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
        // eslint-disable-next-line no-return-assign
        return (window.location.href = SIGN_IN_ROUTE);
      }
    }
    refresh = false;
    return error;
  }
);

export default http;
