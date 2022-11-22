import { createModel } from "@rematch/core";

import { setChosenPlan } from "../../helpers/plan";
import { GET_PLANS_URL } from "../constants/api-contstants";
import http from "../http/http-common";
import type { RootModel } from "./index";

type PlanState = {
  plans: [];
  chosenPlan: {
    id: string;
    nickname?: string;
    amount: number;
  };
};

export const plan = createModel<RootModel>()({
  state: {
    plans: [],
    chosenPlan: {},
  } as PlanState,
  reducers: {
    setPlans(state, plans) {
      return {
        ...state,
        plans,
      } as PlanState;
    },
    setChosenPlan(state, planId: string) {
      const chosenPlan = state.plans.find(({ id }) => id === planId);
      setChosenPlan(chosenPlan || {});
      return {
        ...state,
        chosenPlan,
      } as unknown as PlanState;
    },
  },
  effects: (dispatch) => {
    return {
      async getPlans() {
        const response = await http(GET_PLANS_URL);

        dispatch.plan.setPlans(response.data);
      },

      async choosePlan(planId: string) {
        dispatch.plan.setChosenPlan(planId);
      },
    };
  },
});
