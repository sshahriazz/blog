import { CacheProvider } from "@emotion/react";
import { ColorScheme, useEmotionCache } from "@mantine/core";
import { theme } from "@utils/theme";
import { setCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
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

export default function RootStyleRegistry({
  children,
  ...props
}: {
  children: React.ReactNode;
  colorScheme: ColorScheme;
}) {
  const cache = useEmotionCache();
  cache.compat = true;
  console.log(props);

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: Object.values(cache.inserted).join(" "),
      }}
    />
  ));
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
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
    <CacheProvider value={cache}>
      {/*@ts-ignore */}
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
          <NotificationsProvider>{children}</NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </CacheProvider>
  );
}

// RootStyleRegistry.getInitialProps = ({
//   ctx,
// }: {
//   ctx: GetServerSidePropsContext;
// }) => ({
//   colorScheme: getCookie("mantine-color-scheme", ctx) || "light",
// });
