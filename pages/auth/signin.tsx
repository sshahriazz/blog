import dynamic from "next/dynamic";
const PasswordStrength = dynamic(() =>
  import("@components/form/PasswordField").then((mod) => mod.PasswordStrength)
);

import {
  Anchor,
  Box,
  Button,
  createStyles,
  Divider,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { CtxOrReq } from "next-auth/client/_utils";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import Link from "next/link";
const SocialProvider = dynamic(() => import("@components/auth/SocialProvider"));

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
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        )
          ? null
          : "Invalid password",
    },
  });
  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: `${window.location.origin}/` });
  };

  const handleCredentialsSignIn = (email: string, password: string) => {
    signIn("credentials", {
      email,
      password,
      callbackUrl: `${window.location.origin}/`,
    });
  };
  const handleLogin = () => {
    const validate = form.validate();
    console.log(validate);

    if (validate.hasErrors === false) {
      handleCredentialsSignIn(form.values.email, form.values.password);
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
          {...form.getInputProps("email")}
          label="Email address"
          placeholder="hello@gmail.com"
          size="md"
        />
        <PasswordStrength form={form} />

        {/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}
        <Button onClick={handleLogin} fullWidth mt="xl" size="md">
          Login
        </Button>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor component={Link} href="/auth/signup" weight={700}>
            Register
          </Anchor>
        </Text>
        <Divider
          label="Or continue with OAuth"
          labelPosition="center"
          my="lg"
        />
        <SocialProvider providers={providers} handleSignIn={handleSignIn} />
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
