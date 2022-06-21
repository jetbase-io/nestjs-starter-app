import classNames from "classnames";
import PropTypes from "prop-types";
import React, { FC, useState } from "react";
import { connect } from "react-redux";

import { Dispatch, RootState } from "../../store/store";
import HeaderLink from "../HeaderLink";

type HeaderPageProps = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;

const Header: FC<HeaderPageProps> = ({ isAuthenticated, signOut, fullSignOut }) => {
  const handleSignOutClick: React.MouseEventHandler<HTMLAnchorElement> = () => {
    signOut();
  };

  const handleFullSignOutClick: React.MouseEventHandler<HTMLAnchorElement> = () => {
    fullSignOut();
  };

  const LINKS = [
    { id: 1, text: "Reset Password", to: "/resetPassword", isVisible: isAuthenticated },
    { id: 2, text: "Full Sign Out", to: "/signIn", isVisible: isAuthenticated, onClick: handleFullSignOutClick },
    { id: 3, text: "Sign Out", to: "/signIn", isVisible: isAuthenticated, onClick: handleSignOutClick },
    { id: 4, text: "Sign In", to: "/signIn", isVisible: !isAuthenticated },
    { id: 5, text: "Sign Up", to: "/signUp", isVisible: !isAuthenticated },
  ];

  const [openBurger, setOpenBurger] = useState(false);

  const toggle = () => {
    setOpenBurger(!openBurger);
  };

  const burgerClass = classNames({
    block: openBurger,
    hidden: !openBurger,
  });

  return (
    <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-gray-500 mb-3">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">
          <a
            className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
            href="#pablo"
          >
            Home Page
          </a>
          <button
            onClick={toggle}
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
          >
            <span className="block relative w-6 h-px rounded-sm bg-white" />
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1" />
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1" />
          </button>
        </div>
        <div className={`${burgerClass} lg:flex flex-grow items-center`} id="example-navbar-warning">
          <ul className="flex flex-col lg:flex-row list-none ml-auto">
            {LINKS.map(
              ({ id, text, to, isVisible, onClick }) =>
                isVisible && <HeaderLink key={id} text={text} to={to} onClick={onClick} />
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

const mapState = (state: RootState) => ({
  isAuthenticated: state.user.isAuthenticated,
});

const mapDispatch = (dispatch: Dispatch) => ({
  signOut: dispatch.user.signOut,
  fullSignOut: dispatch.user.fullSignOut,
});

export default connect(mapState, mapDispatch)(Header);
