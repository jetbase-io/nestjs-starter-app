import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import MainLayout from "../layouts/main";

import styles from "../styles/Home.module.css";

const HomePage = () => {
  const { locale, locales, push } = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({}) => {
  return {
    props: {},
  };
};

export default HomePage;
