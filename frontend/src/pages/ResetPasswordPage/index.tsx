import classNames from "classnames";
import { useFormik } from "formik";
import React, { FC } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Dispatch, RootState } from "../../store/store";

type ResetPasswordProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;
const ResetPasswordPage: FC<ResetPasswordProps> = ({ isAuthenticated, resetPassword }) => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().min(6, "Minimum 6 characters required").required("Required"),
      newPassword: Yup.string().min(6, "Minimum 6 characters required").required("Required"),
      confirmPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
    onSubmit: (values) => {
      resetPassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      navigate("/signIn");
    },
  });

  const buttonClass = classNames({
    "bg-blue-600 hover:bg-blue-600": formik.isValid,
    "bg-gray-400": !formik.isValid,
  });

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center font-medium text-xl">Reset Password</div>
      </div>
      <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-600 block">
              Old Password
            </label>
            <input
              name="oldPassword"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {formik.touched.oldPassword && formik.errors.oldPassword ? (
              <p className="text-red-500">{formik.errors.oldPassword}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-600 block">
              New Password
            </label>
            <input
              name="newPassword"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <p className="text-red-500">{formik.errors.newPassword}</p>
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
              Reset
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
  resetPassword: dispatch.user.resetPassword,
});

export default connect(mapState, mapDispatch)(ResetPasswordPage);
