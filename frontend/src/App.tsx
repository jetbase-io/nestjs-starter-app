import "./App.css";
import "react-toastify/dist/ReactToastify.min.css";

import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

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
      <ToastContainer autoClose={8000} position={toast.POSITION.TOP_RIGHT} />
    </div>
  );
};

export default App;
