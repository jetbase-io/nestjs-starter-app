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
      console.log(values);
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

        {/* <div className="grid grid-cols-1 space-y-2">
        <form onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
              <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                <p className="pointer-none text-gray-500 ">
                  <span>Drag and drop</span> image here <br /> or <span>select an image</span> from your computer
                </p>
              </div>
              <input
                name="image"
                onChange={(e) => {
                  formik.setFieldValue("image", e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }}
                type="file"
                style={{ display: "none" }}
              />
            </label>
          </div>
          {formik.errors.image && (
            <p className="text-center text-sm font-bold text-red-600 block">{formik.errors.image}</p>
          )}
          <div className="flex flex-row justify-center">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150 mt-2 ml-3"
            >
              Upload Picture
            </button>
          </div>
        </form>
      </div> */}
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
