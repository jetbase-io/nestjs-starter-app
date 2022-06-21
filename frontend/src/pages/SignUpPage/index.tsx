import classNames from "classnames";
import { useFormik } from "formik";
import React, { FC } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { SIGN_IN_ROUTE } from "../../store/constants/route-constants";
import { Dispatch, RootState } from "../../store/store";

type SignUpProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

const SignUpPage: FC<SignUpProps> = ({ isAuthenticated, signUp }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().min(6, "Minimum 6 characters required").required("Required"),
      password: Yup.string().min(6, "Minimum 6 characters required").required("Required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      signUp({
        username: values.username,
        password: values.password,
      });
      navigate(SIGN_IN_ROUTE);
    },
  });

  const buttonClass = classNames({
    "bg-blue-600 hover:bg-blue-600": formik.isValid,
    "bg-gray-400": !formik.isValid,
  });

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center font-medium text-xl">Sign Up Page</div>
      </div>
      <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-600 block">
              Username
            </label>
            <input
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {formik.touched.username && formik.errors.username ? (
              <p className="text-red-500">{formik.errors.username}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-600 block">
              Password
            </label>
            <input
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500">{formik.errors.password}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-bold text-gray-600 block">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <p className="text-red-500">{formik.errors.confirmPassword}</p>
            ) : null}
          </div>
          <div>
            <button type="submit" className={`${buttonClass} w-full py-2 px-4 rounded-md text-white text-sm`}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapState = (state: RootState) => ({
  isAuthenticated: state.user?.isAuthenticated,
});

const mapDispatch = (dispatch: Dispatch) => ({
  signUp: dispatch.user.signUp,
});

export default connect(mapState, mapDispatch)(SignUpPage);
