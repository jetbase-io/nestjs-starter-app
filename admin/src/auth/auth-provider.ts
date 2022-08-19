import axios from "axios";

import { SIGN_IN_URL, SIGN_OUT_URL } from "../constants/api-constants";
import {
  cleanUserTokensFromLocalStorage,
  getAccessToken,
  getRefreshToken,
  setUserTokensToLocalStorage,
} from "./helpers/auth";
import http from "./http-common";

interface Props {
  username: string;
  password: string;
}

interface ErrorProps {
  status: number;
}

const authProvider = {
  login: async ({ username, password }: Props) => {
    const request = await axios.post(`${process.env.REACT_APP_API_URL}${SIGN_IN_URL}`, { username, password });
    setUserTokensToLocalStorage(request.data.accessToken, request.data.refreshToken);
    return Promise.resolve();
  },
  logout: async () => {
    await http.post(`${SIGN_OUT_URL}`, {
      refreshToken: getRefreshToken(),
    });
    cleanUserTokensFromLocalStorage();
    return Promise.resolve();
  },
  checkAuth: () => (getAccessToken() ? Promise.resolve() : Promise.reject()),
  checkError: (error: ErrorProps) => {
    const { status } = error;
    if (status === 401 || status === 403) {
      cleanUserTokensFromLocalStorage();
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getIdentity: () =>
    Promise.resolve({
      id: "id",
      fullName: "username",
    }),
  getPermissions: () => Promise.resolve(""),
};

export default authProvider;
