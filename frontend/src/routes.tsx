import React from "react";

import {
  BillingPage,
  HomePage,
  ProfilePage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage,
  UpdateUserAvatarPage,
  UpdateUsernamePage,
} from "./pages";
import {
  BILLING_ROUTE,
  PROFILE_ROUTE,
  PROFILE_ROUTE_UPDATE_USER_AVATAR,
  PROFILE_ROUTE_UPDATE_USERNAME,
  RESET_PASSWORD_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from "./store/constants/route-constants";

interface Page {
  id: number;
  path: string;
  title: string;
  element: React.ReactElement;
}

const routes: Page[] = [
  {
    id: 1,
    path: "/",
    title: "HomePage",
    element: <HomePage />,
  },
  {
    id: 2,
    path: SIGN_UP_ROUTE,
    title: "SignUpPage",
    element: <SignUpPage />,
  },
  {
    id: 3,
    path: SIGN_IN_ROUTE,
    title: "SignInPage",
    element: <SignInPage />,
  },
  {
    id: 4,
    path: RESET_PASSWORD_ROUTE,
    title: "ResetPasswordPage",
    element: <ResetPasswordPage />,
  },
  {
    id: 5,
    path: BILLING_ROUTE,
    title: "BillingPage",
    element: <BillingPage />,
  },
  {
    id: 6,
    path: PROFILE_ROUTE,
    title: "ProfilePage",
    element: <ProfilePage />,
  },
  {
    id: 7,
    path: PROFILE_ROUTE_UPDATE_USERNAME,
    title: "UpdateUsernamePage",
    element: <UpdateUsernamePage />,
  },
  {
    id: 8,
    path: PROFILE_ROUTE_UPDATE_USER_AVATAR,
    title: "UpdateUserAvatarPage",
    element: <UpdateUserAvatarPage />,
  },
];

export default routes;
