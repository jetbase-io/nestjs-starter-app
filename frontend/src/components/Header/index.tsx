import React, { FC, useState } from 'react';
import classNames from "classnames";
import { RootState } from "../../store/store";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

type HomePageProps = ReturnType<typeof mapState>;

const Header: FC<HomePageProps> = (props) => {
  const [openBurger, setOpenBurger] = useState(false);

  const isAuthenticated = props.isAuthenticated;

  const toggle = () => {
    setOpenBurger(openBurger => !openBurger);
  }

  const burgerClass = classNames({
    'block': openBurger,
    'hidden': !openBurger
  });

  return (
    <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-gray-500 mb-3">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">
          <a className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white" href="#pablo">
            Home Page
          </a>
          <button onClick={toggle} className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none" type="button">
            <span className="block relative w-6 h-px rounded-sm bg-white"/>
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1"/>
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1"/>
          </button>
        </div>
        <div className={burgerClass + " lg:flex flex-grow items-center"} id="example-navbar-warning">
          { isAuthenticated ? (
            <ul className="flex flex-col lg:flex-row list-none ml-auto">
              <li className="nav-item">
                <a className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75" href="#pablo">
                  Sign Out
                </a>
              </li>
            </ul>
            ) : (
            <ul className="flex flex-col lg:flex-row list-none ml-auto">
              <li className="nav-item">
                <Link to='/signIn' className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                  Sign In
                </Link>
              </li>
              <li className="nav-item">
                <Link to='/signUp' className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                  Sign Up
                </Link>
              </li>
            </ul>
            )}
        </div>
      </div>
    </nav>
  )
}

const mapState = (state: RootState) => ({
  isAuthenticated: state.user?.isAuthenticated,
})

export default connect(mapState) (Header);