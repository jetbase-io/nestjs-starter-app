import { createModel } from "@rematch/core";

import { SIGN_UP_URL } from "../constants/api-contstants";
import http from "../http/http-common";
import type { RootModel } from "./index";

type UserState = {
  isAuthenticated: boolean;
  accessToken: "";
  refreshToken: "";
};

export const user = createModel<RootModel>()({
  state: {
    isAuthenticated: false,
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
  }),
});
