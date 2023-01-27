import { connect, useSelector } from "react-redux";

import React, { FC, useEffect } from "react";
import { PlanSlice, PlanSliceProps } from "../../../store/slice/plan";
import { RootState } from "../../../store/store";
import { useRouter } from "next/router";
import { BILLING_ROUTE } from "../../../store/constants/route-constants";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

const Plans: FC<PlanSliceProps> = (props) => {
  const { plans, getPlans, setChosenPlan } = props;
  const router = useRouter();

  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      getPlans();
    }
  }, []);

  const handleSubscribe = (title: string, id: string) => {
    setChosenPlan(id);
    router.push(BILLING_ROUTE);
  };

  return (
    <>
      <Container maxWidth="md" component="main" sx={{ mt: 8 }}>
        <Grid container spacing={5} alignItems="flex-end">
          {plans?.map(({ id, nickname, amount }) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={id} xs={12} sm={6} md={4}>
              <Card>
                <CardHeader
                  title={nickname}
                  titleTypographyProps={{ align: "center" }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light" ? theme.palette.grey[200] : theme.palette.grey[700],
                  }}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "baseline",
                      mb: 2,
                    }}
                  >
                    <Typography component="h2" variant="h3" color="text.primary">
                      ${amount / 100}
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      /month
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button fullWidth variant="contained" onClick={() => handleSubscribe(nickname, id)}>
                    Subscribe
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default connect(PlanSlice.mapState, PlanSlice.mapDispatch)(Plans);
