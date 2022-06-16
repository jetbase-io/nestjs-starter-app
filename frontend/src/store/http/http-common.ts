import axios from "axios";
import { createBrowserHistory } from "history";

import { getRefreshToken, setUserTokensToLocalStorage } from "../../helpers/user";
import { REFRESH_TOKEN_URL } from "../constants/api-contstants";

const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

let refresh = false;

const history = createBrowserHistory(window);

http.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;
      const response = await http.post(
        REFRESH_TOKEN_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${getRefreshToken()}`,
          },
        }
      );
      if (response.data) {
        setUserTokensToLocalStorage(response.data.accessToken, response.data.refreshToken);
      } else {
        return history.push("/");
      }
      error.config.headers = {
        Authorization: `Bearer ${response.data.accessToken}`,
      };
      return http.request(error.config);
    }
    refresh = false;
    return error;
  }
);

export default http;
