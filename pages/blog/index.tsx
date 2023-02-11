import { Grid, Stack } from "@mantine/core";
import dynamic from "next/dynamic";
import { Blog, User } from "@prisma/client";
import { serialize } from "@utils/prisma";
import { GetServerSideProps } from "next";
import React from "react";
const ArticleCardVertical = dynamic(() =>
  import("@components/blog/article-card").then((mod) => mod.ArticleCardVertical)
);
const Layout = dynamic(() => import("@components/layout/home-layout"));
import client from "@lib/prismadb";
import { BlogPostItem } from "@components/blog/BlogPostItem";
const dummy = {
  image:
    "https://images.unsplash.com/photo-1437719417032-8595fd9e9dc6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  title: "Verudela Beach",
  country: "Croatia",
  description:
    "Completely renovated for the season 2020, Arena Verudela Bech Apartments are fully equipped and modernly furnished 4-star self-service apartments located on the Adriatic coastline by one of the most beautiful beaches in Pula.",
  badges: [
    {
      emoji: "☀️",
      label: "Sunny weather",
    },
    {
      emoji: "🦓",
      label: "Onsite zoo",
    },
    {
      emoji: "🌊",
      label: "Sea",
    },
    {
      emoji: "🌲",
      label: "Nature",
    },
    {
      emoji: "🤽",
      label: "Water sports",
    },
  ],
};

export type BlogUser = Blog & {
  author?: User | null;
};
const Blog = ({ data }: { data: BlogUser[] }) => {
  return (
    <Layout>
      <Grid>
        <Grid.Col span={3}>1</Grid.Col>
        <Grid.Col span={6}>
          <Stack spacing={"sm"}>
            {data.map((dt: BlogUser) => (
              <BlogPostItem key={dt.title + Math.random()} {...dummy} />
            ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>3</Grid.Col>
      </Grid>
    </Layout>
  );
};
export const getServerSideProps: GetServerSideProps<{
  data: any;
}> = async () => {
  const data = await client.blog.findMany({
    where: { published: true },
    include: { author: true },
    orderBy: {
      createdAt: "asc",
    },
  });

  return {
    props: {
      data: serialize(data),
    },
  };
};

export default Blog;
