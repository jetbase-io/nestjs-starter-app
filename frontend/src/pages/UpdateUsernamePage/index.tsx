import { useFormik } from "formik";
import React, { FC } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Dispatch, RootState } from "../../store/store";

type ProfileProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

const UpdateUsernamePage: FC<ProfileProps> = ({ isAuthenticated, updateUsername }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().min(6, "Minimum 6 characters required").required("Required"),
    }),
    onSubmit: (values) => {
      updateUsername({
        username: values.username,
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center font-medium text-xl">Update Username</div>
      </div>
      <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden md:max-w-lg">
            <div className="md:flex">
              <div className="w-full">
                <div className="mb-1">
                  <label className="text-sm font-bold text-gray-600 block">New username</label>
                  <input
                    type="text"
                    className="h-12 px-3 w-full border-blue-400 border-2 rounded focus:outline-none focus:border-blue-600"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.username && (
                    <p className="text-center text-sm font-bold text-red-600 block mt-2 mb-2">
                      {formik.errors.username}
                    </p>
                  )}
                </div>
                <div className="mt-3 text-right">
                  <a
                    href="/"
                    className="ml-2 h-10 w-32 rounded px-3 py-1 hover:bg-gray-300 focus:shadow-outline focus:outline-none0"
                  >
                    Cancel
                  </a>
                  <button type="submit" className="ml-2 h-10 w-32 bg-blue-600 rounded text-white hover:bg-blue-700">
                    Update
                  </button>
                </div>
              </div>
            </div>
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
  updateUsername: dispatch.user.updateUsername,
});

export default connect(mapState, mapDispatch)(UpdateUsernamePage);
