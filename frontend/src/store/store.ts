import { init, RematchDispatch, RematchRootState } from "@rematch/core";

import { models, RootModel } from "./models";

export const store = init({
  models,
  redux: {
    devtoolOptions: {
      actionSanitizer: (action) => action,
    },
  },
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
