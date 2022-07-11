import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../components/Header";
import Plans from "../../components/Plans";
import { Dispatch, RootState } from "../../store/store";

const HomePage: FC = () => {
  const dispatch = useDispatch<Dispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const { isAuthenticated } = userState;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch.user.checkSubscription();
    }
  }, []);

  return (
    <div>
      <Header />
      {isAuthenticated ? <Plans /> : <div />}
    </div>
  );
};

export default HomePage;
