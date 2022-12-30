import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { Session } from "next-auth";
import { theme } from "../utils/theme";
import { RouterTransition } from "../components/RouterTransition";

export default function App(
  props: AppProps & { colorScheme: ColorScheme; session: Session }
) {
  const { Component, pageProps, session } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    // when color scheme is updated save it to cookie
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <Head>
        <title>App</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      {/* <div dir="ltr"> */}
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          withCSSVariables
          theme={{ ...theme, colorScheme: colorScheme }}
        >
          <RouterTransition />
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
      {/* </div> */}
    </>
  );
}
App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  // get color scheme from cookie
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
