import React, { FC } from "react";
import { useSelector } from "react-redux";

import Header from "../../components/Header";
import Plans from "../../components/Plans";
import { RootState } from "../../store/store";

const HomePage: FC = () => {
  const userState = useSelector((state: RootState) => state.user);

  return (
    <div>
      <Header />
      {userState.isAuthenticated ? <Plans /> : null}
    </div>
  );
};

export default HomePage;
