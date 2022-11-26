import { RootState, Dispatch } from "../store";

const mapState = (state: RootState) => ({
  plans: state.plan.plans,
  chosenPlan: state.plan.chosenPlan,
});

const mapDispatch = (dispatch: Dispatch) => ({
  getPlans: () => dispatch.plan.getPlans(),
  choosePlan: (planId: string) => dispatch.plan.choosePlan(planId),
  setChosenPlan: (planId: string) => dispatch.plan.setChosenPlan(planId),
  setPlans: (plans: []) => dispatch.plan.setPlans(plans),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
export type PlanSliceProps = StateProps & DispatchProps;
export const PlanSlice = {
  mapState,
  mapDispatch,
};
