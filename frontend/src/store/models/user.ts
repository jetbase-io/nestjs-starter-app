import { createModel } from "@rematch/core";
import { toast } from "react-toastify";

import history from "../../helpers/history";
import {
  cleanUserTokensFromLocalStorage,
  getAccessToken,
  getIsAuthenticated,
  getRefreshToken,
  setUserTokensToLocalStorage,
} from "../../helpers/user";
import {
  ACTIVATE_SUBSCRIPTION_URL,
  CHECK_SUBSCRIPTION_URL,
  DETACH_PAYMENT_METHODS,
  FULL_SIGN_OUT_URL,
  GET_PAYMENT_METHODS_URL,
  RESET_PASSWORD_URL,
  SIGN_IN_URL,
  SIGN_OUT_URL,
  SIGN_UP_URL,
} from "../constants/api-contstants";
import { SIGN_IN_ROUTE } from "../constants/route-constants";
import http from "../http/http-common";
import type { RootModel } from "./index";

type UserState = {
  isAuthenticated: boolean;
  accessToken: "";
  refreshToken: "";
  paymentMethods: Array<{ id: string; card: { brand: string; last4: string } }>;
  subscription: { nickname: string; status: string };
};

export const user = createModel<RootModel>()({
  state: {
    isAuthenticated: getIsAuthenticated(),
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    paymentMethods: [],
    subscription: { nickname: "", status: "inactive" },
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

    setPaymentMethods(state, paymentMethods) {
      return {
        ...state,
        paymentMethods,
      };
    },

    setSubscription(state, subscription) {
      return {
        ...state,
        subscription,
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
          history.push(SIGN_IN_ROUTE);
        }
      } catch (err) {
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
          await this.checkSubscription();
        }
        if (result.request.status === 403) {
          toast.error("Incorrect credentials");
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

    async fullSignOut() {
      try {
        const result = await http.post(FULL_SIGN_OUT_URL);
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
          toast.success("Password updated!");
          this.logOutUser();
        }
        if (result.request.status === 400) {
          toast.error("Password does not match");
        }
      } catch (err) {
        console.log(err);
      }
    },

    async activateSubscription({ paymentMethodId, priceId }): Promise<{ clientSecret: string; status: string }> {
      let data = null;

      const res = await http.post(ACTIVATE_SUBSCRIPTION_URL, {
        paymentMethod: paymentMethodId,
        priceId,
      });
      console.log("RES DATA: ", res.data);
      const { clientSecret, status } = res.data;
      console.log("Client secret: ", clientSecret);
      data = res.data;

      return data;
    },

    async detachPaymentMethod(paymentMethodId: string) {
      const res = await http.post(DETACH_PAYMENT_METHODS, {
        paymentMethodId,
      });
      if (res.data) {
        const newArr = user.state.paymentMethods.filter((pM) => {
          return pM.id !== paymentMethodId;
        });
        dispatch.user.setPaymentMethods(newArr);
        toast.success("Card was detached successfully!");
      }
    },

    async getPaymentMethods() {
      const res = await http.get(GET_PAYMENT_METHODS_URL);
      console.log("PMS: ", res.data);
      dispatch.user.setPaymentMethods(res.data);
    },

    async checkSubscription() {
      const res = await http.get(CHECK_SUBSCRIPTION_URL);
      console.log("SUB STATUS: ", res.data);
      if (res.data) {
        dispatch.user.setSubscription(res.data);
      }
    },

    logOutUser() {
      dispatch.user.setIsAuthenticated({ isAuthenticated: false });
      cleanUserTokensFromLocalStorage();
      history.push(SIGN_IN_ROUTE);
    },
  }),
});
