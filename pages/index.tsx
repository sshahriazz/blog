import { Stack } from "@mantine/core";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ArticleCardVertical } from "../components/blog/article-card";
import ToggleColorScheme from "../components/core/ToggleColorScheme";
import { FeaturesGrid } from "../components/home/Features";
import { HeroBullets } from "../components/home/HeroBullets";
import HomeLayout from "../components/layout/home-layout";
import { NextSeo } from "next-seo";

export default function IndexPage() {
  return (
    <>
      <NextSeo
        title="Welcome - Home"
        description="Home page fo the blog site"
      />
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
