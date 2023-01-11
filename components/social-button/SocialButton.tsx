import { Button, ButtonProps } from "@mantine/core";
import { GoogleIcon } from "./GoogleIcon";
import { FacebookIcon } from "./FacebookIcon";
import { DiscordIcon, GithubIcon, TwitterIcon } from "@mantine/ds";
import { HTMLAttributes } from "react";

type PropsType = ButtonProps & HTMLAttributes<HTMLButtonElement>;

export function GoogleButton(props: PropsType) {
  return (
    <Button
      leftIcon={<GoogleIcon />}
      variant="default"
      color="gray"
      {...props}
    />
  );
}

export function FacebookButton(props: PropsType) {
  return (
    <Button
      leftIcon={<FacebookIcon />}
      sx={(theme) => ({
        backgroundColor: "#4267B2",
        color: "#fff",
        "&:hover": {
          backgroundColor: theme.fn.darken("#4267B2", 0.1),
        },
      })}
      {...props}
    />
  );
}

export function DiscordButton(props: PropsType) {
  return (
    <Button
      leftIcon={<DiscordIcon size={16} />}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === "dark" ? "#5865F2" : "#5865F2",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.fn.lighten("#5865F2", 0.05)
              : theme.fn.darken("#5865F2", 0.05),
        },
      })}
      {...props}
    />
  );
}

// Twitter button as anchor
export function TwitterButton(
  props: PropsType & React.ComponentPropsWithoutRef<"a">
) {
  return (
    <Button
      component="a"
      leftIcon={<TwitterIcon size={16} color="#00ACEE" />}
      variant="default"
      {...props}
    />
  );
}

export function GithubButton(props: PropsType) {
  return (
    <Button
      {...props}
      leftIcon={<GithubIcon size={16} />}
      sx={(theme) => ({
        backgroundColor:
          theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
        color: "#fff",
        "&:hover": {
          backgroundColor:
            theme.colors.dark[theme.colorScheme === "dark" ? 9 : 6],
        },
      })}
    />
  );
}

// export function SocialButtons() {
//   return (
//     <Group position="center" sx={{ padding: 15 }}>
//       <GoogleButton>Continue with Google</GoogleButton>
//       <TwitterButton href="https://twitter.com/mantinedev" target="_blank">
//         Follow on Twitter
//       </TwitterButton>
//       <FacebookButton>Sign in with Facebook</FacebookButton>
//       <GithubButton>Login with GitHub</GithubButton>
//       <DiscordButton>Join Discord community</DiscordButton>
//     </Group>
//   );
// }
