import classNames from "classnames";
import React from "react";
import s from "./container.module.scss";

export interface IAppContainerProps {
  className?: string;
  children: React.ReactNode;
}

const AppContainer: React.FC<IAppContainerProps> = (props) => {
  const { children, className = "" } = props;
  const containerClassNames = classNames(s["container"], className);

  return <div className={containerClassNames}>{children}</div>;
};

export default AppContainer;
