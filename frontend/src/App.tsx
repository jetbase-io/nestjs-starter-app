import "./App.css";

import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { getAccessToken } from "./helpers/user";
import { HomePage, NotFoundPage } from "./pages/index";
import routes from "./routes";
import { Dispatch } from "./store/store";

const App: FC = () => {
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    if (getAccessToken()) {
      dispatch.user.checkUserAuthentication();
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {routes.map((route) => (
          <Route path={route.path} element={route.element} key={route.id} />
        ))}
        <Route path={"/*"} element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
