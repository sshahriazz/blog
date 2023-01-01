import { Stack } from "@mantine/core";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ArticleCardVertical } from "../components/blog/article-card";
import ToggleColorScheme from "../components/core/ToggleColorScheme";
import { FeaturesGrid } from "../components/home/Features";
import { HeroBullets } from "../components/home/HeroBullets";
import HomeLayout from "../components/layout/home-layout";
const RTE = dynamic(import("../components/RTE"), { ssr: false });
const DisplayContent = dynamic(import("../components/DisplayContent"), {
  ssr: false,
});

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <HomeLayout>
        <HeroBullets />
        <FeaturesGrid
          title={"Integrate effortlessly with any technology stack"}
          description={
            "Every once in a while, you’ll see a Golbat that’s missing some fangs. This happens when hunger drives it to try biting a Steel-type Pokémon."
          }
        />
      </HomeLayout>
    </>
  );
}
