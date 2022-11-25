import React from "react";
import AppHeader from "../../components/layouts/header";
import s from "./styles.module.scss";

interface IMainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<IMainLayoutProps> = ({ children }) => {
  return (
    <div className={s["layout"]}>
      <AppHeader className={s["desctop"]} />
      <div className={s["content"]}>{children}</div>
    </div>
  );
};

export default MainLayout;
