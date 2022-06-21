import classNames from "classnames";
import { useFormik } from "formik";
import React, { FC } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { SIGN_IN_ROUTE } from "../../store/constants/route-constants";
import { Dispatch, RootState } from "../../store/store";

type IPasswordValues = Record<string, string>;

type ResetPasswordProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;
const ResetPasswordPage: FC<ResetPasswordProps> = ({ isAuthenticated, resetPassword }) => {
  const navigate = useNavigate();

  const passwordValues: IPasswordValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const formik = useFormik({
    initialValues: passwordValues,
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
      navigate(SIGN_IN_ROUTE);
    },
  });

  const buttonClass = classNames({
    "bg-blue-600 hover:bg-blue-600": formik.isValid,
    "bg-gray-400": !formik.isValid,
  });

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const inputs = [
    { id: 0, label: "Old Password", name: "oldPassword" },
    { id: 1, label: "New Password", name: "newPassword" },
    { id: 2, label: "Confirm Password", name: "confirmPassword" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center font-medium text-xl">Reset Password</div>
      </div>
      <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {inputs.map((input) => (
            <div key={input.id}>
              <label htmlFor={input.name} className="text-sm font-bold text-gray-600 block">
                {input.label}
              </label>
              <input
                name={input.name}
                value={formik.values[`${input.name}`]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="password"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {formik.touched[`${input.name}`] && formik.errors[`${input.name}`] && (
                <p className="text-red-500">{formik.errors[`${input.name}`]}</p>
              )}
            </div>
          ))}
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
