import "./App.css";
import "react-toastify/dist/ReactToastify.min.css";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { FC } from "react";
import { Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

import { HomePage, NotFoundPage } from "./pages/index";
import routes from "./routes";

const App: FC = () => {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "");

  return (
    <div>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {routes.map((route) => (
            <Route path={route.path} element={route.element} key={route.id} />
          ))}
          <Route path={"/*"} element={<NotFoundPage />} />
        </Routes>
      </Elements>

      <ToastContainer autoClose={8000} position={toast.POSITION.TOP_RIGHT} />
    </div>
  );
};

export default App;
