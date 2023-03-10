import dynamic from "next/dynamic";
const PasswordStrength = dynamic(() =>
  import("@components/form/PasswordField").then((mod) => mod.PasswordStrength)
);
const SocialProvider = dynamic(() => import("@components/auth/SocialProvider"));
const FacebookButton = dynamic(() =>
  import("@components/social-button/SocialButton").then(
    (mod) => mod.FacebookButton
  )
);
const GithubButton = dynamic(() =>
  import("@components/social-button/SocialButton").then(
    (mod) => mod.GithubButton
  )
);
const GoogleButton = dynamic(() =>
  import("@components/social-button/SocialButton").then(
    (mod) => mod.GoogleButton
  )
);
const TwitterButton = dynamic(() =>
  import("@components/social-button/SocialButton").then(
    (mod) => mod.TwitterButton
  )
);
import {
  Anchor,
  Box,
  Button,
  createStyles,
  Divider,
  Loader,
  Paper,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons";
import { CtxOrReq } from "next-auth/client/_utils";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    backgroundSize: "cover",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)",
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: "100vh",
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },

  title: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    width: 120,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export default function SignIn({
  providers,
  csrfToken,
}: {
  providers: [{ name: string; id: string }];
  csrfToken: string;
}) {
  const { classes } = useStyles();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    validateInputOnChange: true,
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
          ? null
          : "Invalid password",
      username: (value) =>
        /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(value)
          ? null
          : "Invalid username",
    },
  });

  const handleCredentialsSignIn = (
    email: string,
    password: string,
    username: string
  ) => {
    signIn("credentials", {
      email,
      password,
      username,
      callbackUrl: `${window.location.origin}/`,
    });
  };
  const handleSignup = async () => {
    const validate = form.validate();
    console.log(validate);

    if (validate.hasErrors === false) {
      await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.values.email,
          password: form.values.password,
          username: form.values.username,
        }),
      }).then((res) => {
        if (res.status === 200) {
          console.log("signed up");

          handleCredentialsSignIn(
            form.values.email,
            form.values.password,
            form.values.username
          );
        }
      });
    }
  };
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const handleUserNameValidation = async () => {
    setLoading(true);
    const validate = form.validate();
    console.log(validate);

    if (!validate.errors.username) {
      await fetch("/api/auth/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.values.username,
        }),
      }).then((res) => {
        if (res.status === 200) {
          setValid(true);
          setLoading(false);
        } else {
          setValid(false);
          setLoading(false);
        }
      });
    }
  };

  return (
    <Box className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30}>
        <Title
          order={2}
          className={classes.title}
          align="center"
          mt="md"
          mb={50}
        >
          Welcome back to Mantine!
        </Title>

        <TextInput
          {...form.getInputProps("username")}
          onBlur={handleUserNameValidation}
          rightSection={
            loading ? (
              <Tooltip label="Validation check failed, check username">
                <Box>
                  <Loader size="xs" />
                </Box>
              </Tooltip>
            ) : valid ? (
              <Tooltip label="Username available">
                <Box>
                  <IconCheck color="green" />
                </Box>
              </Tooltip>
            ) : (
              <Tooltip label="Username not available">
                <Box>
                  <IconX color="red" />
                </Box>
              </Tooltip>
            )
          }
          label="Username"
          placeholder="Username"
          size="md"
        />
        <TextInput
          mt={"md"}
          {...form.getInputProps("email")}
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
        />
        <PasswordStrength form={form} />

        {/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}
        <Button onClick={handleSignup} fullWidth mt="xl" size="md">
          Sign Up
        </Button>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor component={Link} href="/auth/signin" weight={700}>
            Login
          </Anchor>
        </Text>
        <Divider
          label="Or continue with OAuth"
          labelPosition="center"
          my="md"
        />
        <SocialProvider providers={providers} handleSignIn={handleSignup} />
      </Paper>
    </Box>
  );
}

export async function getServerSideProps(context: CtxOrReq) {
  const providers = await getProviders();

  return {
    props: { providers, csrfToken: await getCsrfToken(context) },
  };
}
