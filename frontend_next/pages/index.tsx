import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { connect } from "react-redux";
import Plans from "../components/layouts/plans";
import { UserSlice, UserSliceProps } from "../store/slice/user";

import styles from "../styles/Home.module.css";

const HomePage: NextPage<UserSliceProps> = (props) => {
  const { isAuthenticated, checkSubscription } = props;
  const { locale, locales, push } = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      checkSubscription();
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isAuthenticated ? <Plans /> : <div />}
    </div>
  );
};

export default connect(UserSlice.mapState, UserSlice.mapDispatch)(HomePage);
