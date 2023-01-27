import { GetServerSideProps, NextPage } from "next";
import { connect } from "react-redux";
import Link from "@mui/material/Link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "../../store/constants/route-constants";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { UserSlice, UserSliceProps } from "../../store/slice/user";

const SignUpPage: NextPage<UserSliceProps> = (props) => {
  const { locale } = useRouter();
  const { t: translate } = useTranslation("common");
  const router = useRouter();

  const { signUp, isAuthenticated } = props;

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(6, "Username must be at least 6 characters")
      .max(30, "Username must not exceed 30 characters"),
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("password"), null], "Confirm Password does not match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: FieldValues) => {
    const { username, email, password } = data;
    signUp({
      username,
      email,
      password,
      router,
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push(HOME_ROUTE);
    }
  }, [isAuthenticated]);

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
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, maxWidth: 450, width: 450 }}>
          <TextField
            margin="normal"
            autoComplete="username"
            required
            fullWidth
            id="username"
            label="Username"
            autoFocus
            {...register("username")}
            error={errors.username ? true : false}
            helperText={errors.username ? (errors.username.message as string) : ""}
          />

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

          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            {...register("password")}
            error={errors.password ? true : false}
            helperText={errors.password ? (errors.password.message as string) : ""}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            label="Confirm Password"
            type="password"
            id="confirPassword"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={errors.confirmPassword ? true : false}
            helperText={errors.confirmPassword ? (errors.confirmPassword.message as string) : ""}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <Link href={SIGN_IN_ROUTE} variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale = "" }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
};

export default connect(UserSlice.mapState, UserSlice.mapDispatch)(SignUpPage);
