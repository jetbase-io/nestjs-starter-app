import { NextRouter } from "next/router";
import { RootState, Dispatch } from "../store";

interface signInProps {
  username: string;
  password: string;
}

interface signUpProps {
  username: string;
  email: string;
  password: string;
  router: NextRouter;
}

interface resetPasswordProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface updateUsernameProps {
  username: string;
  router: NextRouter;
}

interface updateUserAvatarProps {
  avatar: File;
  router: NextRouter;
}

interface activateSubscriptionProps {
  paymentMethodId: string;
  priceId: string;
}

interface detachPaymentProps {
  paymentMethodId: string;
}

interface logOutUserProps {
  router: NextRouter;
}

export const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
  accessToken: state.user.accessToken,
  refreshToken: state.user.refreshToken,
  paymentMethods: state.user.paymentMethods,
  subscription: state.user.subscription,
});

export const mapDispatch = (dispatch: Dispatch) => ({
  signIn: ({ username, password }: signInProps) => dispatch.user.signIn({ username, password }),
  signUp: ({ username, email, password, router }: signUpProps) =>
    dispatch.user.signUp({ username, email, password, router }),
  signOut: ({ router }: logOutUserProps) => dispatch.user.signOut({ router }),
  fullSignOut: ({ router }: logOutUserProps) => dispatch.user.fullSignOut({ router }),
  resetPassword: ({ oldPassword, newPassword, confirmPassword }: resetPasswordProps) =>
    dispatch.user.resetPassword({ oldPassword, newPassword, confirmPassword }),
  updateUsername: ({ username, router }: updateUsernameProps) => dispatch.user.updateUsername({ username, router }),
  updateUserAvatar: ({ avatar, router }: updateUserAvatarProps) => dispatch.user.updateUserAvatar({ avatar, router }),
  activateSubscription: ({ paymentMethodId, priceId }: activateSubscriptionProps) =>
    dispatch.user.activateSubscription({ paymentMethodId, priceId }),
  detachPayment: ({ paymentMethodId }: detachPaymentProps) => dispatch.user.detachPaymentMethod({ paymentMethodId }),
  getPaymentMethods: () => dispatch.user.getPaymentMethods(),
  checkSubscription: () => dispatch.user.checkSubscription(),
  logOutUser: ({ router }: logOutUserProps) => dispatch.user.logOutUser({ router }),
});
type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
export type UserSliceProps = StateProps & DispatchProps;
export const UserSlice = {
  mapState,
  mapDispatch,
};
