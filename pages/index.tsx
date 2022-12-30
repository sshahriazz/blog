import dynamic from "next/dynamic";
import Head from "next/head";
import ToggleColorScheme from "../components/core/ToggleColorScheme";
import Layout from "../components/layout/layout";
import RTE from "../components/RTE";

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Layout>
        <ToggleColorScheme />
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <h1>NextAuth.js Example</h1>
        <p>
          This is an example site to demonstrate how to use{" "}
          <a href="https://next-auth.js.org">NextAuth.js</a> for authentication.
        </p>
        <RTE />
      </Layout>
    </>
  );
}
