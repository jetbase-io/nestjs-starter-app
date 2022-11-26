import { connect } from "react-redux";
import { NextPage } from "next";
import React, { useEffect } from "react";
import { UserSlice, UserSliceProps } from "../../store/slice/user";
import { useRouter } from "next/router";
import { CardElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { HOME_ROUTE } from "../../store/constants/route-constants";
import { getChosenPlan } from "../../helpers/plan";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import Typography from "@mui/material/Typography";

const BillingPage: NextPage<UserSliceProps> = (props) => {
  const {
    isAuthenticated,
    getPaymentMethods,
    setSubscription,
    activateSubscription,
    detachPaymentMethod,
    paymentMethods,
  } = props;
  const router = useRouter();

  const stripe = useStripe();
  const elements = useElements();
  const chosenPlan: { id: string } = getChosenPlan();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(HOME_ROUTE);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (paymentMethods.length === 0) {
      getPaymentMethods();
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
            setSubscription({ status: "active", nickname });
            toast.success("Payment was successfully applied!");
          }
        });
      } else {
        setSubscription({ status: "active", nickname });
        toast.success("Payment was successfully applied!");
      }
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Email is invalid"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (values: any) => {
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
      priceId: chosenPlan.id,
      paymentMethodId: result.paymentMethod!.id,
    };
    const resultData = await activateSubscription(args);
    handleResultData(resultData);
    router.push(HOME_ROUTE);
  };

  const onExistedCardClick = async (paymentMethodId: string, priceId: string) => {
    const result = await activateSubscription({ paymentMethodId, priceId });
    handleResultData(result);
    router.push(HOME_ROUTE);
  };

  const onDetachCardClick = (paymentMethodId: string) => {
    detachPaymentMethod(paymentMethodId);
    router.push(HOME_ROUTE);
  };

  return (
    <div>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <PaymentOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Billing Details
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, maxWidth: 450, width: 450 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            {...register("email")}
            error={errors.email ? true : false}
            helperText={errors.email ? (errors.email.message as string) : ""}
          />
          <Typography component="h1" variant="body1">
            Card Details
          </Typography>
          <div
            style={{
              border: "1px solid",
              borderRadius: "4px",
              borderColor: "rgb(209 213 219)",
              marginTop: "16px",
              marginBottom: "8px",
              padding: "0 8px",
              height: "56px",
              margin: "auto",
            }}
          >
            <div style={{ height: "16px" }}></div>
            <CardElement />
          </div>

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Pay
          </Button>
          {paymentMethods?.map(({ id, card }) => (
            <Grid container spacing={2}>
              <Grid lg={4} md={4} sm={4} xs={4} item>
                <Input disabled placeholder={`${card.brand}-${card.last4}`} />
              </Grid>
              <Grid lg={4} md={4} sm={4} xs={4} item>
                <Button onClick={() => onDetachCardClick(id)} variant="contained">
                  Detach
                </Button>
              </Grid>
              <Grid lg={4} md={4} sm={4} xs={4} item>
                <Button onClick={() => onExistedCardClick(id, chosenPlan.id)} variant="contained">
                  Use Card
                </Button>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default connect(UserSlice.mapState, UserSlice.mapDispatch)(BillingPage);
