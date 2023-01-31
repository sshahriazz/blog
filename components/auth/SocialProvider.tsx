import {
  FacebookButton,
  GithubButton,
  GoogleButton,
  TwitterButton,
} from "@components/social-button/SocialButton";
import { Box, Stack } from "@mantine/core";

const SocialProvider = ({
  providers,
  handleSignIn,
}: {
  providers: [{ name: string; id: string }];
  handleSignIn: (provider: string) => void;
}) => {
  return (
    <Stack mb="md" mt="md">
      {Object.values(providers).map(
        (provider) =>
          provider.name !== "Credentials" && (
            <Box key={provider.name}>
              {provider.name === "Google" ? (
                <GoogleButton
                  w={"100%"}
                  onClick={() => handleSignIn(provider.id)}
                  radius="xl"
                >
                  {provider.name}
                </GoogleButton>
              ) : provider.name === "Facebook" ? (
                <FacebookButton
                  w={"100%"}
                  onClick={() => handleSignIn(provider.id)}
                  radius="xl"
                >
                  {provider.name}
                </FacebookButton>
              ) : provider.name === "GitHub" ? (
                <GithubButton
                  w={"100%"}
                  onClick={() => handleSignIn(provider.id)}
                  radius="xl"
                >
                  {provider.name}
                </GithubButton>
              ) : (
                <TwitterButton
                  w={"100%"}
                  onClick={() => handleSignIn(provider.id)}
                  radius="xl"
                >
                  {provider.name}
                </TwitterButton>
              )}
            </Box>
          )
      )}
    </Stack>
  );
};
export default SocialProvider;
