import "./App.css";

import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";

import { HomePage, NotFoundPage } from "./pages/index";
import routes from "./routes";

const App: FC = () => {
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
