import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import classNames from "classnames";
import { useFormik } from "formik";
import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { getChosenPlan } from "../../helpers/plan";
import { HOME_ROUTE } from "../../store/constants/route-constants";
import { Dispatch, RootState } from "../../store/store";

const BillingPage: FC = () => {
  const dispatch = useDispatch<Dispatch>();
  const userState = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();
  const chosenPlan = getChosenPlan();

  if (!userState.isAuthenticated) {
    return <Navigate to="/" />;
  }

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Required"),
    }),
    onSubmit: async (values) => {
      if (!stripe || !elements) {
        return;
      }

      const cardElement = elements!.getElement(CardElement);

      const result = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement!,
        billing_details: {
          email: values.email,
        },
      });
      const args = {
        email: values.email,
        priceId: chosenPlan.id,
        result,
      };
      const resultData = await dispatch.user.activateSubscription(args);
      if (resultData) {
        const { clientSecret, status } = resultData;

        if (status === "requires_action") {
          stripe.confirmCardPayment(clientSecret).then((res) => {
            if (result.error) {
              toast.error("Payment failed");
            } else {
              console.log("You got the money!");
              toast.success("Payment was successfully applied!");
            }
          });
        } else {
          console.log("You got the money!");
          toast.success("Payment was successfully applied!");
        }
      }
      navigate(HOME_ROUTE);
    },
  });

  const buttonClass = classNames({
    "bg-blue-600 hover:bg-blue-600": formik.isValid,
    "bg-gray-400 ": !formik.isValid,
  });

  return (
    <div>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center font-medium text-xl">Billing Details</div>
        </div>
        <div className="max-w-md w-full mx-auto mt-4 bg-white p-8 border border-gray-300">
          <div className="text-center">
            <h4>
              You have chosen <span className="text-blue-500 font-bold">{chosenPlan.nickname}</span> plan
            </h4>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-sm font-bold text-gray-600 block">
                Email
              </label>
              <input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="email"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500">{formik.errors.email}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-bold text-gray-600 block">
                Card details
              </label>
              <CardElement className="w-full p-2 border border-gray-300 rounded mt-1" />
            </div>
            <div>
              <button type="submit" className={`${buttonClass} w-full py-2 px-4 rounded-md text-white text-sm`}>
                Pay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
