import { createModel } from "@rematch/core";

import history from "../../helpers/history";
import {
  cleanUserTokensFromLocalStorage,
  getAccessToken,
  getIsAuthenticated,
  getRefreshToken,
  setUserTokensToLocalStorage,
} from "../../helpers/user";
import { RESET_PASSWORD_URL, SIGN_IN_URL, SIGN_OUT_URL, SIGN_UP_URL } from "../constants/api-contstants";
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
        const result = await http.post(SIGN_UP_URL, {
          username,
          password,
        });
        if (result.request.status === 201) {
          history.push("/signIn");
        }
      } catch (err) {
        // need to add toaster
        console.log(err);
      }
    },

    async signIn({ username, password }) {
      try {
        const result = await http.post(SIGN_IN_URL, {
          username,
          password,
        });
        if (result.request.status === 201) {
          dispatch.user.setIsAuthenticated({ isAuthenticated: true });
          dispatch.user.setTokens({
            accessToken: result.data.accessToken,
            refreshToken: result.data.refreshToken,
          });
          setUserTokensToLocalStorage(result.data.accessToken, result.data.refreshToken);
        }
        if (result.request.status === 403) {
          console.log("Incorrect credentials");
        }
      } catch (error) {
        console.log(error);
      }
    },

    async signOut() {
      try {
        const result = await http.post(SIGN_OUT_URL, { refreshToken: getRefreshToken() });
        if (result.request.status === 201) {
          this.logOutUser();
        }
      } catch (error) {
        console.log(error);
      }
    },

    async resetPassword({ oldPassword, newPassword, confirmPassword }) {
      try {
        const result = await http.post(RESET_PASSWORD_URL, {
          oldPassword,
          newPassword,
          confirmPassword,
        });
        if (result.request.status === 201) {
          this.logOutUser();
        }
        if (result.request.status === 400) {
          console.log("Password does not match");
        }
      } catch (err) {
        console.log(err);
      }
    },

    logOutUser() {
      dispatch.user.setIsAuthenticated({ isAuthenticated: false });
      cleanUserTokensFromLocalStorage();
      history.push("/signIn");
    },
  }),
});
