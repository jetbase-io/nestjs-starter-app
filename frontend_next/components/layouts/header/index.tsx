import React from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { Paper, AppBar, Toolbar, Button, Typography } from "@mui/material";
import {
  PROFILE_ROUTE,
  RESET_PASSWORD_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  HOME_ROUTE,
} from "../../../store/constants/route-constants";
import { UserSlice, UserSliceProps } from "../../../store/slice/user";
import { useRouter } from "next/router";

const AppHeader: React.FC<UserSliceProps> = (props) => {
  const { isAuthenticated, signOut, fullSignOut } = props;
  const router = useRouter();

  const handleSignOutClick: React.MouseEventHandler<HTMLAnchorElement> = () => {
    signOut({ router });
  };

  const handleFullSignOutClick: React.MouseEventHandler<HTMLAnchorElement> = () => {
    fullSignOut({ router });
  };

  const links = [
    // { id: 1, text: "Reset Password", to: RESET_PASSWORD_ROUTE, isVisible: isAuthenticated },
    { id: 2, text: "Full Sign Out", to: SIGN_IN_ROUTE, isVisible: isAuthenticated, onClick: handleFullSignOutClick },
    { id: 3, text: "Sign Out", to: SIGN_IN_ROUTE, isVisible: isAuthenticated, onClick: handleSignOutClick },
    { id: 4, text: "Sign In", to: SIGN_IN_ROUTE, isVisible: !isAuthenticated },
    { id: 5, text: "Sign Up", to: SIGN_UP_ROUTE, isVisible: !isAuthenticated },
    { id: 6, text: "My Profile", to: PROFILE_ROUTE, isVisible: isAuthenticated },
  ];

  return (
    <AppBar color="primary" position="sticky">
      <Toolbar>
        <Link href={HOME_ROUTE}>HOME</Link>
        <div style={{ marginLeft: "auto" }}>
          {links.map(
            (link) =>
              link.isVisible && (
                <Link
                  style={{ marginLeft: 10, textDecoration: "none" }}
                  key={link.id}
                  href={link.to}
                  passHref
                  dir="auto"
                  onClick={link.onClick}
                >
                  {link.text}
                </Link>
              )
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default connect(UserSlice.mapState, UserSlice.mapDispatch)(AppHeader);
