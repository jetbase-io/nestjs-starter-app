import { useFormik } from "formik";
import React, { FC, useState } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";

import { Dispatch, RootState } from "../../store/store";

type ProfileProps = ReturnType<typeof mapState>;

const ProfilePage: FC<ProfileProps> = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center font-medium text-xl">Profile Page</div>
      </div>
      <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
        <div>
          <a
            href="/profile/updateUsername"
            className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-black hover:opacity-75"
          >
            Change Username
          </a>
        </div>
        <br></br>
        <div>
          <a
            href="/profile/updateUserAvatar"
            className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-black hover:opacity-75"
          >
            Change Profile Picture
          </a>
        </div>
      </div>
    </div>
  );
};

const mapState = (state: RootState) => ({
  isAuthenticated: state.user?.isAuthenticated,
});

export default connect(mapState)(ProfilePage);
