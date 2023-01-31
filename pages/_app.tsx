import type { AppProps } from "next/app";
import { ColorScheme } from "@mantine/core";
import { useState } from "react";
import { getCookie, setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import { theme } from "../utils/theme";
import { DefaultSeo } from "next-seo";
import dynamic from "next/dynamic";

const SessionProvider = dynamic(() =>
  import("next-auth/react").then((mod) => mod.SessionProvider)
);
const RouterTransition = dynamic(() =>
  import("@components/RouterTransition").then((mod) => mod.RouterTransition)
);
const NotificationsProvider = dynamic(() =>
  import("@mantine/notifications").then((mod) => mod.NotificationsProvider)
);
const MantineProvider = dynamic(() =>
  import("@mantine/core").then((mod) => mod.MantineProvider)
);
const ColorSchemeProvider = dynamic(() =>
  import("@mantine/core").then((mod) => mod.ColorSchemeProvider)
);

export default function App(
  props: AppProps & { colorScheme: ColorScheme; session: any }
) {
  const { Component, pageProps, session } = props;
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    props.colorScheme
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
  };

  return (
    <>
      <DefaultSeo
        title="Blog website"
        description="Write your blog with ease"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://www.localhost:3000/",
          siteName: "Interactive",
        }}
        twitter={{
          handle: "@interactive",
          site: "@interactive",
          cardType: "summary_large_image",
        }}
      />
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          withCSSVariables
          theme={{ ...theme, colorScheme }}
        >
          <RouterTransition />
          <SessionProvider session={session}>
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
});
