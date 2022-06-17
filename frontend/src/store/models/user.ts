import { createModel } from "@rematch/core";

import {
  cleanUserTokensFromLocalStorage,
  getAccessToken,
  getIsAuthenticated,
  getRefreshToken,
  setUserTokensToLocalStorage,
} from "../../helpers/user";
import { SIGN_IN_URL, SIGN_OUT_URL, SIGN_UP_URL } from "../constants/api-contstants";
import http from "../http/http-common";
import type { RootModel } from "./index";

type UserState = {
  isAuthenticated: boolean;
  accessToken: "";
  refreshToken: "";
};

export const user = createModel<RootModel>()({
  state: {
    isAuthenticated: getIsAuthenticated(),
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  } as UserState,
  reducers: {
    setIsAuthenticated(state, { isAuthenticated }) {
      return {
        ...state,
        isAuthenticated,
      } as UserState;
    },

    setTokens(state, { accessToken, refreshToken }) {
      return {
        ...state,
        accessToken,
        refreshToken,
      };
    },
  },
  effects: (dispatch) => ({
    async signUp({ username, password }) {
      try {
        await http.post(SIGN_UP_URL, {
          username,
          password,
        });
      } catch (err) {
        // need to add toaster
        console.log(err);
      }
    },

    async signIn({ username, password }) {
      try {
        const response = await http.post(SIGN_IN_URL, {
          username,
          password,
        });
        dispatch.user.setIsAuthenticated({ isAuthenticated: true });
        dispatch.user.setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
        setUserTokensToLocalStorage(response.data.accessToken, response.data.refreshToken);
      } catch (error) {
        console.log(error);
      }
    },

    async signOut() {
      try {
        await http.post(SIGN_OUT_URL);
        dispatch.user.setIsAuthenticated({ isAuthenticated: false });
        cleanUserTokensFromLocalStorage();
      } catch (error) {
        console.log(error);
      }
    },
  }),
});
