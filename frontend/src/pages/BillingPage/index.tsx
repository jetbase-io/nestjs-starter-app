import { CardElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import classNames from "classnames";
import { useFormik } from "formik";
import React, { FC, MouseEventHandler, useEffect, useState } from "react";
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

  useEffect(() => {
    if (userState.paymentMethods.length === 0) {
      dispatch.user.getPaymentMethods();
    }
  }, []);

  const handleResultData = (resultData: { clientSecret: string; status: string; nickname: string | null }) => {
    if (!stripe || !elements) {
      return;
    }
    if (resultData) {
      const { clientSecret, status, nickname } = resultData;

      if (status === "requires_action") {
        stripe.confirmCardPayment(clientSecret).then((res) => {
          if (res.error) {
            toast.error("Payment failed");
          } else {
            dispatch.user.setSubscription({ status: "active", nickname });
            toast.success("Payment was successfully applied!");
          }
        });
      } else {
        dispatch.user.setSubscription({ status: "active", nickname });
        toast.success("Payment was successfully applied!");
      }
    }
  };

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
        paymentMethodId: result.paymentMethod?.id,
      };
      const resultData = await dispatch.user.activateSubscription(args);
      handleResultData(resultData);
      navigate(HOME_ROUTE);
    },
  });

  const buttonClass = classNames({
    "bg-blue-600 hover:bg-blue-600": formik.isValid,
    "bg-gray-400 ": !formik.isValid,
  });

  const onExistedCardClick = async (paymentMethodId: string, priceId: string) => {
    const result = await dispatch.user.activateSubscription({ paymentMethodId, priceId });
    handleResultData(result);
    navigate(HOME_ROUTE);
  };

  const onDetachCardClick = (paymentMethodId: string) => {
    dispatch.user.detachPaymentMethod(paymentMethodId);
    navigate(HOME_ROUTE);
  };

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
        <div className="max-w-md w-full mx-auto ">
          {userState.paymentMethods?.map(({ id, card }) => (
            <div
              key={id}
              className="flex mb-0.5 border border-r-2 lg:px-4 py-1 text-center text-primary-dark bg-primary-white"
            >
              <input
                type="text"
                disabled={true}
                className="text-left w-1/2 text-gray-600 font-bold text-center pl-1 align-baseline"
                placeholder={`${card.brand} - ${card.last4}`}
              />
              <p className="text-right w-1/2 pr-1">
                <button
                  onClick={() => onDetachCardClick(id)}
                  className="bg-blue-600 hover:bg-blue-600 py-2 px-4 rounded-md text-white text-sm mr-1"
                >
                  Detach
                </button>
                <button
                  onClick={() => onExistedCardClick(id, chosenPlan.id)}
                  className="bg-blue-600 hover:bg-blue-600 py-2 px-4 rounded-md text-white text-sm"
                >
                  Use Card
                </button>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
