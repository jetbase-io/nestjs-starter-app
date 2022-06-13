import React, {FC, useState} from 'react';
import {connect} from "react-redux";
import {RootState, Dispatch} from "../../store/store";
import { Navigate } from "react-router-dom";

type SignUpProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>

const SignUpPage: FC<SignUpProps> = (props) => {

  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');

  const usernameChangeHandler = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEnteredUsername(event.target.value);
  };

  const passwordChangeHandler = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEnteredPassword(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    props.signUp({
      username: enteredUsername,
      password: enteredPassword
    });
  }

  if (props.isAuthenticated) {
    return <Navigate to='/'/>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center font-medium text-xl">Sign Up Page</div>
      </div>
      <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
        <form onSubmit={handleSubmit} action="" className="space-y-6">
          <div>
            <label htmlFor="" className="text-sm font-bold text-gray-600 block">Username</label>
            <input value={enteredUsername} onChange={usernameChangeHandler} type="text" className="w-full p-2 border border-gray-300 rounded mt-1"/>
          </div>
          <div>
            <label htmlFor="" className="text-sm font-bold text-gray-600 block">Password</label>
            <input value={enteredPassword} onChange={passwordChangeHandler} type="password" className="w-full p-2 border border-gray-300 rounded mt-1"/>
          </div>
          <div>
            <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const mapState = (state: RootState) => ({
  isAuthenticated: state.user?.isAuthenticated,
})

const mapDispatch = (dispatch: Dispatch) => ({
  signUp: dispatch.user.signUp,
})

export default connect(mapState, mapDispatch) (SignUpPage);