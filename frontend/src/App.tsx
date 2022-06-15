import "./App.css";

import React from "react";
import { Route, Routes } from "react-router-dom";

import { HomePage, NotFoundPage, SignUpPage } from "./pages/index";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signUp" element={<SignUpPage />} />
        <Route path={"/*"} element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
