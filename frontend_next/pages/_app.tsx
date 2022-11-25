import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import * as React from "react";
import { createEmotionCache } from "../infrastructure/mui/emotion-cache";
import theme from "../infrastructure/mui/theme";
import MainLayout from "../layouts/main";
import { store } from "../store/store";

// Client-side cache, shared for the whole session of the user in the browser.

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const router = useRouter();
  const { locale = "en", locales = ["en", "ru"] } = router;
  const clientSideEmotionCache = createEmotionCache(locale);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <Provider store={store}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
};

export default appWithTranslation(MyApp);
