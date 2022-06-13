import { createModel } from '@rematch/core'
import type { RootModel } from './index'
import http from '../http/http-common';

type UserState = {
  isAuthenticated: boolean,
  accessToken: '',
  refreshToken: '',
}

export const user = createModel<RootModel>()({
  state: {
    isAuthenticated: false,
  } as UserState,
  reducers: {
    setIsAuthenticated(state, payload) {
      return {
        ...state,
        isAuthenticated: payload
      } as UserState
    },

    setTokens(state, payload) {
      return {
        ...state,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken
      }
    }
  },
  effects: (dispatch) => ({
    async signUp({username, password}) {
      try {
        let response = await http.post('auth/signUp', {
          username: username,
          password: password
        });
        dispatch.user.setIsAuthenticated(true);
        dispatch.user.setTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken
        })
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);

      } catch (err) {
        dispatch.user.setIsAuthenticated(false);
      }
    },
  }),
})