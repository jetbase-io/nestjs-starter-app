import React from "react";

import { HomePage, ResetPasswordPage, SignInPage, SignUpPage } from "./pages";

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
    path: "/signUp",
    title: "SignUpPage",
    element: <SignUpPage />,
  },
  {
    id: 3,
    path: "/signIn",
    title: "SignInPage",
    element: <SignInPage />,
  },
  {
    id: 4,
    path: "/resetPassword",
    title: "ResetPasswordPage",
    element: <ResetPasswordPage />,
  },
];

export default routes;
